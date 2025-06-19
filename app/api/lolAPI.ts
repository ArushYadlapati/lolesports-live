import * as dotenv from "dotenv";
import { filterMatch, getLeagues, ltaCrossExists } from "@/app/helper/leagues";

dotenv.config();


const token = "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z";

let response: any;
let events: any[] = [];

export async function updateResponse() : Promise<void> {
    const headers = new Headers();
    if (token) {
        headers.set("x-api-key", token);
    }

    try {
        response =
            await(
                await fetch(
                    "https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US",
                    { headers }
                )
            ).json();

        const data: any = response;
        events = data?.data?.schedule?.events || [];
    } catch (e) {
        // uhhhh rip, it got cooked
    }
}

export function getMatches(match : string) : any[] {
    let matches: any[] | "None" = "None";

    if (!response) {
        return [];
    }

    if (match === "live") {
        matches = availableMatches("inProgress");
    } else if (match === "next") {
        matches = availableMatches("unstarted");
    } else if (match === "past") {
        matches = availableMatches("completed");
    }

    else if (match === "importance") {
        const matchImportance = ["Finals", "Playoffs", "Regional Qualifier", "Regular Season"];
        // const matchImportance = ["Grand Finals", "Playoffs", "Regional Qualifier", "Regular Season"];


        matches = [];
        ltaCrossExists()

        for (const match of events) {
            if (getLeagues().includes(match?.league?.slug) && filterMatch(match)) {
                matches.push(match);
            }
        }

        matches.sort((match1, match2) => {
            let m1 = matchImportance.length;
            let m2 = matchImportance.length;
            if (matchImportance.indexOf(match1.blockName) !== -1) {
                m1 = matchImportance.indexOf(match1.blockName);
            }

            if (matchImportance.indexOf(match2.blockName) !== -1) {
                m2 = matchImportance.indexOf(match2.blockName);
            }

            return m1 - m2;
        });
    }

    else { // default: sort by date
        matches = [];
        ltaCrossExists()

        for (const match of events) {
            if (getLeagues().includes(match?.league?.slug) && filterMatch(match)) {
                matches.push(match);
            }
        }
    }

    if (matches !== "None" && Array.isArray(matches) && matches.length > 0) {
        return matches;
    }

    return [];
}

function availableMatches(match: string) {
    if (!response) {
        return "None";
    }

    const matches: any[] = [];

    ltaCrossExists();

    for (const league of getLeagues()) {
        for (const event of events) {
            if (event.state === match && event?.league?.slug === league && filterMatch(event)) {
                matches.push(event);
            }
        }
    }

    matches.sort((match1, match2) => new Date(match1.startTime).getTime() - new Date(match2.startTime).getTime())
    return matches;
}
