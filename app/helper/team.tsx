import {getMatches} from "@/app/api/lolAPI";
import {getCurrentSortMode} from "@/app/helper/leagues";
import {getCurrentColorScheme} from "@/app/helper/colorScheme";
import {gpr} from "@/app/api/gprAPI";
import {betNameMap} from "@/app/api/betAPI";
import {safeIsMobile} from "@/app/menu/menu";
import {getTooltipString} from "@/app/helper/util";

/**
 * Represents a team in a match.
 * Includes properties such as name, image, abbreviation, and match score.
 * There is also win %, match score, predictions, and a probability bar.
 */
interface Team {
    name: string;
    image: string;
    abbreviation: string;
    matchScore: number;
}

function predictWins(team1Score: number, team2Score: number, maxWins: number) {
    const t1W = team1Score / 100;
    const t2W = team2Score / 100;

    const tWS = t1W + t2W;
    const p1 = t1W / tWS;
    const p2 = t2W / tWS;

    const r = 100000;
    let sT1W = 0;
    let sT2W = 0;
    let st1T = 0;
    let st2T = 0;

    for (let sim = 0; sim < r; sim++) {
        let t1G = 0;
        let t2G = 0;

        while (t1G < maxWins && t2G < maxWins) {
            if (Math.random() < p1) {
                t1G++;
            } else {
                t2G++;
            }
        }

        if (t1G === maxWins) {
            sT1W++;
            st1T += t1G;
            st2T += t2G;
        } else {
            sT2W++;
            st1T += t1G;
            st2T += t2G;
        }
    }

    let t1E = Math.round(st1T / r);
    let t2E = Math.round(st2T / r);

    const mTotal = 2 * maxWins - 1;
    t1E = Math.min(t1E, maxWins);
    t2E = Math.min(t2E, maxWins);

    if (t1E < maxWins && t2E < maxWins) {
        const rT1 = st1T / r;
        const rT2 = st2T / r;

        if (rT1 >= rT2) {
            t1E = maxWins;
        } else {
            t2E = maxWins;
        }
    }

    const tE = t1E + t2E;
    if (tE > mTotal) {
        if (t1E === maxWins) {
            t2E = mTotal - maxWins;
        } else if (t2E === maxWins) {
            t1E = mTotal - maxWins;
        } else {
            const r1 = t1E / tE;
            t1E = Math.round(mTotal * r1);
            t2E = mTotal - t1E;

            if (t1E < maxWins && t2E < maxWins) {
                t1E = maxWins;
                t2E = mTotal - maxWins;
            }
        }
    }

    t1E = Math.floor(t1E);
    t2E = Math.floor(t2E);

    return { t1E: t1E, t2E: t2E };
}


function formatMatch(event: any): string | null {
    const matchTime = new Date(event.startTime).toLocaleString("en-US", {
        minute: "2-digit",
        hour: "2-digit",
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    const matchNumber = event.match?.strategy.count;
    const maxWins = Math.ceil(matchNumber / 2);

    let winnerIndex = -1;

    if (event.match?.teams[0].result?.outcome === "win") {
        winnerIndex = 0;
    } else if (event.match?.teams[1].result?.outcome === "win") {
        winnerIndex = 1;
    }

    const teams: Team[] = event.match?.teams?.map((team: any): Team => ({
        name: team?.name,
        image: team?.image,
        abbreviation: team?.code || team?.abbreviation,
        matchScore: team?.result?.gameWins || 0
    })) || [];

    const matchNames = teams.map((team) => team.name).join(" vs ");
    const betURL = betNameMap[matchNames];
    const isCompleted = event.state === "completed";

    const gameType = event.blockName;
    const league = event.league?.name;

    let matchStatus = "Live";
    if (event.state === "completed") {
        matchStatus = "Past";
    } else if (event.state === "unstarted") {
        matchStatus = "Next";
    }

    const scoreMap = Object.fromEntries(
        gpr.map((line: string) => {
            if (line) {
                const [teamName, score] = line.split("|||");
                return [teamName.trim(), score.trim()];
            }
        }).filter(Boolean) as [string, string][]
    );

    const teamImages = (() => {
        const teamBlocks = teams.map((team: Team, index: number): string => {
            const isLeftTeam = index === 0;
            const bold = index === winnerIndex ? "font-weight: bold;" : "";
            const score = scoreMap[team.name];
            const tooltipPosition = isLeftTeam ? 'left' : 'right';

            const content = `${team.abbreviation}: ${team.matchScore}${score ? ` (GPR - ${score})` : ""}`;

            const fullLine = isLeftTeam
                ? `
                <span style="display: flex; align-items: center;">
                    ${getTooltipString(
                    "Current GPR (Global Power Rankings) - a measure of a team's skill or performance currently",
                    getCurrentColorScheme(),
                    tooltipPosition
                )}
                    <span style="margin-left: 6px;">${content}</span>
                </span>
            `
                : `
                <span style="display: flex; align-items: center;">
                    <span style="margin-right: 6px;">${content}</span>
                    ${getTooltipString(
                    "Current GPR (Global Power Rankings) - a measure of a team's skill or performance currently",
                    getCurrentColorScheme(),
                    tooltipPosition
                )}
                </span>
            `;

            return `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50%;">
                <img src="${team.image}" alt="${team.name}" width="60" height="60"/>
                <span style="margin-top: 4px; text-align: center; font-size: 16px; ${bold}">
                    ${fullLine}
                </span>
            </div>
        `;
        });

        const verticalLine = `
    <div style="
        font-weight: bold;
        font-size: 27px;
        color: ${getCurrentColorScheme().foreground};
    ">
        VS
    </div>
`;

        return `
    <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
        ${teamBlocks[0]}
        ${verticalLine}
        ${teamBlocks[1]}
    </div>
`;

    })();



    let probabilityBar = "";
    if (teams.length === 2) {
        const [team1, team2] = teams;
        const team1ScoreVal = parseInt(scoreMap[team1.name] || "0", 10);
        const team2ScoreVal = parseInt(scoreMap[team2.name] || "0", 10);

        if (team1ScoreVal + team2ScoreVal > 0) {
            const exp = 15;
            const scaledTotal = Math.pow(team1ScoreVal, exp) + Math.pow(team2ScoreVal, exp);

            const team1Score: number = Math.round((Math.pow(team1ScoreVal, exp) / scaledTotal) * 100);
            const team2Score: number = 100 - team1Score;

            const prediction = predictWins(team1Score, team2Score, maxWins);
            const team1Predict = prediction.t1E.toFixed(2).toString().charAt(0);
            const team2Predict = prediction.t2E.toFixed(2).toString().charAt(0);

            probabilityBar = `
                <div style="margin: 12px auto; width: 600px; height: 15px; display: flex; border-radius: 6px; overflow: hidden; background: #e0e0e0;">
                    <div style="width: ${team1Score}%; background-color: #4caf50;"></div>
                    <div style="width: ${team2Score}%; background-color: #f44336;"></div>
                </div>

                <div style="width: 600px; margin: 6px auto 0; display: flex; justify-content: space-between; font-size: 14px;">
                    <span style="display: flex; align-items: center;">
                        ${getTooltipString(
                "Probability of this team winning the match (calculated from GPR scores)",
                getCurrentColorScheme(),
                'left'
            )}
                        <span style="margin-left: 6px;">
                            ${team1.abbreviation} Win Chance: ${team1Score}%
                        </span>
                    </span>
                    <span style="display: flex; align-items: center;">
                        <span style="margin-right: 6px;">
                            ${team2.abbreviation} Win Chance: ${team2Score}%
                        </span>
                        ${getTooltipString(
                "Probability of this team winning the match (calculated from GPR scores)",
                getCurrentColorScheme(),
                'right'
            )}
                    </span>
                </div>

                <div style="width: 600px; margin: 6px auto 0; display: flex; justify-content: space-between; font-size: 14px;">
                    <span style="display: flex; align-items: center;">
                        ${getTooltipString(
                "A simulated prediction of the number of games this team will win (out of" + ` ${matchNumber})`,
                getCurrentColorScheme(),
                'left'
            )}
                        <span style="margin-left: 6px;">
                            Expected Wins: ${team1Predict}
                        </span>
                    </span>
                    <span style="display: flex; align-items: center;">
                        <span style="margin-right: 6px;">
                            Expected Wins: ${team2Predict}
                        </span>
                        ${getTooltipString(
                "A simulated prediction of the number of games this team will win (out of" + ` ${matchNumber})`,
                getCurrentColorScheme(),
                'right'
            )}
                    </span>
                </div>
            `;
        }
    }

    let betButton = ``;

    if (!isCompleted && betURL) {
        betButton = `
            <div style="margin-top: -30px; text-align: center;"> 
                <a href="${betURL}" target="_blank" rel="noopener noreferrer"
                   style="padding: 6px 12px; background-color: #1e88e5; color: white; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 16px;">
                    Bet Now
                    ${getTooltipString(
            "Allows you to bet REAL money on this match. See the Betting page for more information.",
            getCurrentColorScheme(),
            'right'
        )}
                </a>
            </div>`;
    }

    return `
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 3px solid ${getCurrentColorScheme().foreground}50; width: 750px; margin-left: auto; margin-right: auto;">
            <div style="text-align: center;">
                <strong style="font-size: 18px;">${matchNames}</strong><br>
                <em style="font-size: 16px;">${league} (${gameType})</em>
                <span style="font-size: 16px;"> — ${matchTime} [${matchStatus}]</span>
            </div>

            <div style="margin-top: 16px; display: flex; justify-content: center; align-items: center; gap: 24px;">
                <div style="display: flex; justify-content: center; width: 100%;">
                    ${teamImages}
                </div>
            </div>

            <div style="margin-top: 16px;">
                ${probabilityBar}
            </div>

            ${betButton}
        </div>
    `;
}

function mobileFormatMatch(event: any): string | null {
    const matchTime = new Date(event.startTime).toLocaleString("en-US", {
        minute: "2-digit",
        hour: "2-digit",
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    const matchNumber = event.match?.strategy.count;
    const maxWins = Math.ceil(matchNumber / 2);

    let winnerIndex = -1;

    if (event.match?.teams[0].result?.outcome === "win") {
        winnerIndex = 0;
    } else if (event.match?.teams[1].result?.outcome === "win") {
        winnerIndex = 1;
    }

    const teams: Team[] = event.match?.teams?.map((team: any): Team => ({
        name: team?.name,
        image: team?.image,
        abbreviation: team?.code || team?.abbreviation,
        matchScore: team?.result?.gameWins || 0
    })) || [];

    const matchNames = teams.map((team) => team.name).join(" vs ");
    const betURL = betNameMap[matchNames];
    const isCompleted = event.state === "completed";

    const gameType = event.blockName;
    const league = event.league?.name;

    let matchStatus = "Live";
    if (event.state === "completed") {
        matchStatus = "Past";
    } else if (event.state === "unstarted") {
        matchStatus = "Next";
    }

    const scoreMap = Object.fromEntries(
        gpr.map((line: string) => {
            if (line) {
                const [teamName, score] = line.split("|||");
                return [teamName.trim(), score.trim()];
            }
        })
    );

    const teamImages = teams.map((team: Team, index: number): string => {
        let bold = "";

        if (index === winnerIndex) {
            bold = "font-weight: bold;";
        }

        let teamScore = "";
        const score = scoreMap[team.name];

        if (score) {
            teamScore = ` (${ score })`;
        }

        return `
            <div style="display: flex; flex-direction: column; align-items: center; margin: 0 10px;">
                <img src="${ team.image }" alt="${ team.name }" width="40" height="40"/>
                <span style="margin-top: 4px; text-align: center; font-size: 15px; ${ bold }">
                    ${ team.abbreviation }: ${ team.matchScore } ${ teamScore }
                </span>
            </div>
        `;
    }).join("");

    let probabilityBar = "";
    if (teams.length === 2) {
        const [team1, team2] = teams;

        if (parseInt(scoreMap[team1.name] || "0", 10) + parseInt(scoreMap[team2.name] || "0", 10) > 0) {
            const exp = 15;
            const scaledTotal = Math.pow(parseInt(scoreMap[team1.name] || "0", 10), exp) + Math.pow(parseInt(scoreMap[team2.name] || "0", 10), exp);

            const team1Score: number = Math.round((Math.pow(parseInt(scoreMap[team1.name] || "0", 10), 15) / scaledTotal) * 100);
            const team2Score: number = 100 - team1Score;

            const team1Predict = predictWins(team1Score, team2Score, maxWins).t1E.toFixed(2).toString().charAt(0);
            const team2Predict = predictWins(team1Score, team2Score, maxWins).t2E.toFixed(2).toString().charAt(0);

            probabilityBar = `
                <div style="margin: 12px auto; width: 360px; height: 12px; display: flex; border-radius: 6px; overflow: hidden; background: #e0e0e0;">
                    <div style="width: ${ team1Score }%; background-color: #4caf50;"> 
                        </br>
                    </div>
                    
                    <div style="width: ${ team2Score }%; background-color: #f44336;">
                        </br>
                    </div>
                    
                </div>
                  
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span>
                        ${ team1.abbreviation } ${ team1Score }%
                    </span>
                    <span>
                        ${ team2.abbreviation } ${ team2Score }%
                    </span>
                </div>   
                   
                <div style="width: 360px; margin: 6px auto 0; display: flex; justify-content: space-between; font-size: 14px;">
                    <span>
                        Expected: ${ team1Predict }
                    </span>
                    <span>
                        Expected: ${ team2Predict }
                    </span>
                </div>
            `;
        }
    }

    let betButton = ``;

    if (!isCompleted && betURL) {
        betButton =
            `<a href="${ betURL }" target="_blank" rel="noopener noreferrer"
                style="padding: 6px 12px; background-color: #1e88e5; color: white; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 14px;">
                Bet Now
            </a>`
    }

    return `
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid
            ${ getCurrentColorScheme().foreground }50;"
        >   
            <strong>
                ${ matchNames }
            </strong>
        
            <br>
                <em>
                    ${ league } (${ gameType })
                </em>
                — ${ matchTime } [${ matchStatus }]
            <br/>

            <div style="margin-top: 8px; display: flex; justify-content: center; align-items: center; gap: 16px;">
                <div style="display: flex;">
                    ${ teamImages }
                </div>
            </div>
        
            ${ probabilityBar }
            ${ betButton }
        </div>
    `;
}

function getFormattedMatch(matches: any[], matchType: string): string {
    let formattedMatch;

    if (matches.length > 0 && safeIsMobile()) {
        formattedMatch = matches.map(event => mobileFormatMatch(event)).join("");
    }

    else if (matches.length > 0 && !safeIsMobile()) {
        formattedMatch = matches.map(event => formatMatch(event)).join("");
    }

    else if (matchType === "") {
        formattedMatch = "No Matches Found.";
    } else {
        formattedMatch = "No " + matchType + " Matches Found.";
    }

    return `
        <div style ="margin: 16px auto; padding: 16px; border: 1px solid #ccc; border-radius: 8px; background-color: ${ getCurrentColorScheme().buttonColor }; 
            display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: fit-content };">
            <div style = "display: flex; flex-direction: column; align-items: center; justify-content: center;">
                ${ formattedMatch }
            </div>
        </div>
    `;
}

export function getFormattedMatches(): string {
    let result = "";

    const sortMode = getCurrentSortMode();

    if (sortMode === "status") {
        result += `<h2 style="margin-top: 16px; font-size: 23px; font-weight: bold; text-decoration: underline; align-content: center;
                         display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                         Live Matches:
                   </h2>`;
        result += getFormattedMatch(getMatches("live"), "Live");

        result += `<h2 style="margin-top: 16px; font-size: 23px; font-weight: bold; text-decoration: underline; align-content: center;
                         display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                         Next Matches:
                   </h2>`;
        result += getFormattedMatch(getMatches("next"), "Next");

        result += `<h2 style="margin-top: 16px; font-size: 23px; font-weight: bold; text-decoration: underline; align-content: center;
                         display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                         Past Matches:
                   </h2>`;
        result += getFormattedMatch(getMatches("past"), "Past");
    } else if (sortMode === "importance") {
        result += getFormattedMatch(getMatches("importance"), "");
    } else {
        result += getFormattedMatch(getMatches("date"), "");
    }

    return result || "No matches found.";
}