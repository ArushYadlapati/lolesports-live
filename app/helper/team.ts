import { getMatches } from "@/app/api/lolAPI";
import { getCurrentSortMode } from "@/app/helper/leagues";
import {ColorScheme, getCurrentColorScheme} from "@/app/helper/colorScheme";
import {calculateSizeAdjustValues} from "next/dist/server/font-utils";

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
 * @param scheme
 * @return { string } - A formatted string of formatted matches
 */
function getFormattedMatch(matches: any[], matchType: string): string {
    let formattedMatch = "";

    if (matches.length > 0) {
        formattedMatch = matches.map(event => formatMatch(event)).join("");
    } else if (matchType === "") {
        formattedMatch = "No Matches Found.";
    } else {
        formattedMatch = "No " + matchType + " Matches Found.";
    }

    return `<div style ="margin: 16px auto; padding: 16px; border: 1px solid #ccc; border-radius: 8px; background-color: ${ getCurrentColorScheme().buttonColor }; 
                display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; max-width: 800px;width: 100%; ">
                <div style = "width: 100%;">
                    ${ formattedMatch }
                </div>
            </div>`;

}

/**
 * Gets formatted match given the current sort mode combined with HTML string & formatting
 * @return { string } - A HTML string of formatted matches that can be directly called in the UI page.tsx
 */
export async function getFormattedMatches(scheme: ColorScheme): Promise<string> {
    let result = "";


    const sortMode = getCurrentSortMode();

    if (sortMode === "status") {
        result += `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline; align-content: center">
                         Live Matches:
                   </h2>`;
        result += getFormattedMatch(getMatches("live"), "Live");

        result += `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline; align-content: center">
                         Next Matches:
                   </h2>`;
        result += getFormattedMatch(getMatches("next"), "Next");

        result += `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline; align-content: center">
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

