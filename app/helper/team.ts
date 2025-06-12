import { getMatches } from "@/app/api/lolAPI";
import { getCurrentSortMode } from "@/app/helper/leagues";
import { ColorScheme } from "@/app/helper/colorScheme";

// The interface for the Team formatting
interface Team {
    name: string;
    image: string;
    abbreviation: string;
}

/**
 * Formats a match given a match (which I called event because match is a different thing)
 * @param event - The event/match/whatever to format
 * @param scheme - The current color scheme to use for formatting
 * @return { string } - 1formatted string that represents 1 match
 */
function formatMatch(event: any, scheme: ColorScheme): string {
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
 * @param scheme
 * @return { string } - A formatted string of formatted matches
 */
function getFormattedMatch(matches: any[], matchType: string, scheme: ColorScheme): string {
    let formattedMatch = "";

    if (matches.length > 0) {
        formattedMatch = matches.map(event => formatMatch(event, scheme)).join("");
    } else if (matchType === "") {
        formattedMatch = "No Matches Found.";
    } else {
        formattedMatch = "No " + matchType + " Matches Found.";
    }

    return `<div style ="margin: 16px; padding: 16px; border: 1px solid #ccc; border-radius: 8px; background-color: ${ scheme.buttonColor };">
            ${ formattedMatch }
        </div>
       `;

}

/**
 * Gets formatted match given the current sort mode combined with HTML string & formatting
 * @return { string } - A HTML string of formatted matches that can be directly called in the UI page.tsx
 */
export function getFormattedMatches(scheme: ColorScheme): string {
    let result = "";

    const live = getMatches("live");
    const next = getMatches("next");
    const past = getMatches("past");
    const importance = getMatches("importance");
    const date = getMatches("date");

    const sortMode = getCurrentSortMode();

    if (sortMode === "status") {
        result += `<h2>Live Matches:</h2>`;
        result += getFormattedMatch(live, "Live", scheme);

        result += `<h2>Next Matches:</h2>`;
        result += getFormattedMatch(next, "Next", scheme);

        result += `<h2>Past Matches:</h2>`;
        result += getFormattedMatch(past, "Past", scheme);
    } else if (sortMode === "importance") {
        result += getFormattedMatch(importance, "", scheme);
    } else {
        result += getFormattedMatch(date, "", scheme);
    }

    return result || "No matches found.";
}

