import { getMatches } from "@/app/api/lolAPI";
import { getCurrentSortMode } from "@/app/helper/leagues";
import { getCurrentColorScheme } from "@/app/helper/colorScheme";
import { gpr } from "@/app/api/gprAPI";

// The interface for the Team formatting
interface Team {
    name: string;
    image: string;
    abbreviation: string;
}

/**
 * Formats a match given a match (which I called event because match is a different thing)
 * @param event - The event/match/whatever to format
 * @return { string } - A formatted string that represents 1 match
 */
function formatMatch(event: any): string {
    const matchTime = new Date(event.startTime).toLocaleString("en-US", {
        minute: "2-digit",
        hour: "2-digit",
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    const teams: Team[] = event.match?.teams?.map((team: any): { name: any; image: any; abbreviation: any; } => ({
        name: team?.name,
        image: team?.image,
        abbreviation: team?.code || team?.abbreviation
    })) || [];

    const matchNames = teams.map((team) => team.name).join(" vs ");
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

    const teamImages = teams.map(team => {
        const score = scoreMap[team.name];
        let ss = "";

        // So far, only supports LCK leagues for win % because I'm broke and can't get the data for other leagues
        // easily without paying :(
        // TODO: make this support other leagues
        if (score) {
            ss = ` (${ score })`;
        }

        // if (score) {
        //     ss = ` (${ score })`;
        // } else {
        //     ss = "";
        // }

        return `
            <div style="display: flex; flex-direction: column; align-items: center; margin: 0 10px;">
                <img src="${ team.image }" alt="${ team.name }" width="40" height="40"/>
                <span style="margin-top: 4px; text-align: center;">
                    ${ team.abbreviation }${ ss }
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

            const a = Math.round((Math.pow(parseInt(scoreMap[team1.name] || "0", 10), 15) / scaledTotal) * 100);
            const b = 100 - a;


            probabilityBar = `
                <div style="margin: 12px auto; width: 360px; height: 12px; display: flex; border-radius: 6px; overflow: hidden; background: #e0e0e0;">
                    <div style="width: ${ a }%; background-color: #4caf50;"> 
                        </br>
                    </div>
                    
                    <div style="width: ${ b }%; background-color: #f44336;">
                        </br>
                    </div>
                    
                </div>
                    <div style="width: 360px; margin: 6px auto 0; display: flex; justify-content: space-between; font-size: 14px;">
                        <span>
                            ${ team1.abbreviation } ${ a }%
                        </span>
                    <span>
                        ${ team2.abbreviation } ${ b }%
                    </span>
                </div>
            `;
        }
    }

    return `
        <div style="margin-bottom: 24px;">
            <strong>${ matchNames }</strong><br/>
            <em>${ league } (${ gameType })</em> — ${ matchTime }<br/>
            <div style="margin-top: 8px; display: flex; justify-content: center;">
                ${ teamImages }
            </div>
            ${ probabilityBar }
        </div>
    `;
}


/**
 * Gets formatted match (by using the formatMatch() function)
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

    return `<div style ="margin: 16px auto; padding: 16px; border: 1px solid #ccc; border-radius: 8px; background-color: ${ getCurrentColorScheme().buttonColor }; 
                display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: fit-content };">
                <div style = "display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    ${ formattedMatch }
                </div>
            </div>`;

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

