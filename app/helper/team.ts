import { getMatches } from "@/app/api/lolAPI";
import { getCurrentSortMode } from "@/app/helper/leagues";

// The interface for the Team formatting
interface Team {
    name: string;
    image: string;
    abbreviation: string;
}

/**
 * Formats a match given a match (which I called event because match is a different thing)
 * @param event - The event/match/whatever to format
 * @return { string } - 1formatted string that represents 1 match
 */
function formatMatch(event: any): string {
    const matchTime = new Date(event.startTime).toLocaleString("en-US", {
        minute: "2-digit",
        hour: "2-digit",
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    const teams: Team[] = event.match?.teams?.map((team: any) : { name : any, image : any, abbreviation : any } => ({
        name: team?.name,
        image: team?.image,
        abbreviation: team?.code || team?.abbreviation
    })) || [];

    const matchNames = teams.map((team) => team.name).join(" vs ");
    const gameType = event.blockName;
    const league = event.league?.name;

    const teamImages = teams.map(team =>
        `<div style="display:inline-block; text-align:center; margin:0 10px;">
            <img src="${ team.image }" alt="${ team.name }" width="40" height="40"/>
            <span>
                ${ team.abbreviation }
            </span>
        </div>`
    ).join('');

    return `
        <div style="margin-bottom:24px;">
            <strong>
                ${ matchNames }
            </strong>
                <br/>
                    <em> 
                        ${ league }
                        (${ gameType }) 
                    </em>
                    — ${ matchTime }
                <br/>
            <div style="margin-top: 8px;">
                ${ teamImages }
            </div>
        </div>
    `;
}

/**
 * Gets formatted match (by using the formatMatch() function)
 * @param matches The matches to format
 * @param matchType The match type ("Live", "Next" or "Past")
 * @return { string } - A formatted string of formatted matches
 */
function getFormattedMatch(matches: any[], matchType : string): string {
    if (matches.length > 0) {
        return matches.map(formatMatch).join("");
    }

    if (matchType === "") {
        return "No Matches Found."
    }

    return "No " + matchType + " Matches Found."
}

/**
 * Gets formatted match given the current sort mode combined with HTML string & formatting
 * @return { string } - A HTML string of formatted matches that can be directly called in the UI page.tsx
 */
export function getFormattedMatches(): string {
    let result = "";
    if (getCurrentSortMode() === "status") {
        result +=
            `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline;"> 
        Live Matches: 
    </h2>`

        result += getFormattedMatch(getMatches("live"), "Live");

        result +=
            `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline;">
        Next Matches: 
    <h2>`

        result += getFormattedMatch(getMatches("next"), "Next");

        result +=
            `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline;">
        Past Matches: 
    <h2>`

        result += getFormattedMatch(getMatches("past"), "Past");
    } else if (getCurrentSortMode() === "importance") {
        result += getFormattedMatch(getMatches("importance"), "");
    } else  { // default: sort by date
        result += getFormattedMatch(getMatches("date"), "");
    }

    if (result == "") {
        result = "No matches found. Try choosing different filters.";
    }

    return result;
}
