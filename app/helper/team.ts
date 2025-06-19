import { getMatches } from "@/app/api/lolAPI";
import { getCurrentSortMode } from "@/app/helper/leagues";
import { getCurrentColorScheme } from "@/app/helper/colorScheme";
import {getGPR, gpr} from "@/app/api/gprAPI";
import { betNameMap } from "@/app/api/betAPI";

// The interface for the Team formatting
interface Team {
    name: string;
    image: string;
    abbreviation: string;
    matchScore: number;
}

/**
 * Formats a match given a match (which I called event because match is a different thing)
 * @param event - The event/match/whatever to format
 * @return { string } - A formatted string that represents 1 match√
 */
function formatMatch(event: any): string {
    const matchTime = new Date(event.startTime).toLocaleString("en-US", {
        minute: "2-digit",
        hour: "2-digit",
        weekday: "short",
        month: "short",
        day: "numeric"
    });

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


            probabilityBar = `
                <div style="margin: 12px auto; width: 360px; height: 12px; display: flex; border-radius: 6px; overflow: hidden; background: #e0e0e0;">
                    <div style="width: ${ team1Score }%; background-color: #4caf50;"> 
                        </br>
                    </div>
                    
                    <div style="width: ${ team2Score }%; background-color: #f44336;">
                        </br>
                    </div>
                    
                </div>
                    <div style="width: 360px; margin: 6px auto 0; display: flex; justify-content: space-between; font-size: 14px;">
                        <span>
                            ${ team1.abbreviation } ${ team1Score }%
                        </span>
                    <span>
                        ${ team2.abbreviation } ${ team2Score }%
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
                — ${ matchTime }
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


/**
 * Gets formatted match (by using the {@link formatMatch()} function)
 * @param matches The matches to format
 * @param matchType The match type ("Live", "Next" or "Past")
 * @return { string } - A formatted string of formatted matches
 */
function getFormattedMatch(matches: any[], matchType: string): string {
    let formattedMatch;

    if (matches.length > 0) {
        formattedMatch = matches.map(event => formatMatch(event)).join("");
    } else if (matchType === "") {
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

/**
 * Gets formatted match given the current sort mode combined with HTML string & formatting
 * @return { string } - A HTML string of formatted matches that can be directly called in the UI page.tsx
 */
export function getFormattedMatches(): string {
    let result = "";


    const sortMode = getCurrentSortMode();

    if (sortMode === "status") {
        result += `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline; align-content: center;
                         display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                         Live Matches:
                   </h2>`;
        result += getFormattedMatch(getMatches("live"), "Live");

        result += `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline; align-content: center;
                         display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                         Next Matches:
                   </h2>`;
        result += getFormattedMatch(getMatches("next"), "Next");

        result += `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline; align-content: center;
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

