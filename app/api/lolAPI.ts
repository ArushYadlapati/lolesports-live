import * as dotenv from "dotenv";
import {getCurrentSortMode, getLeagues, ltaCrossExists} from "@/app/helper/leagues";

dotenv.config();

const token = process.env.NEXT_PUBLIC_LOL;

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

export function getLiveMatches() : any[] {
    const liveMatches = getMatch("inProgress");
    if (Array.isArray(liveMatches) && liveMatches.length > 0) {
        return liveMatches;
    }
    return [];
}

export function getNextMatches() : any[] {
    const nextMatches = getMatch("unstarted");
    if (Array.isArray(nextMatches)){
        return nextMatches;
    }

    return [];
}

export function getPastMatches() : any[] {
    const pastMatches = getMatch("completed");
    if (Array.isArray(pastMatches)) {
        return pastMatches;
    }

    return [];
}

export function getMatchesByDate() : any[] {
    return [];
}

export function getMatch(matchType : string) {
    if (!response) {
        return "None";
    }

    const matches: any[] = [];

    ltaCrossExists();

    for (const league of getLeagues()) {
        let latestMatch = null;

        for (const event of events) {
            const slug = event?.league?.slug;
            if (event.state === matchType && slug === league) {
                if (!latestMatch || new Date(event.startTime) > new Date(latestMatch.startTime)) {
                    latestMatch = event;
                    matches.push(event);
                }
            }
        }

        if (latestMatch) {
            // matches.push(latestMatch);
        }
    }

    return matches;
}


/* gets matches by time (sorted by time)
export function getMatch(matchType: string) {
    if (!response) {
        return "None";
    }

    const matches: any[] = [];
    ltaCrossExists();

    for (const league of getLeagues()) {
        const leagueMatches = events.filter(
            (event) => event.state === matchType && event?.league?.slug === league
        );

        // Sort by startTime ascending within the league
        leagueMatches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

        // Take up to the first 3 per league
        const topThree = leagueMatches.slice(0, 3);

        matches.push(...topThree);
    }

    // After combining, sort the final list by startTime ascending
    matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return matches;
}
*/

export function getLiveMatchNames() {
    if (!response) {
        return "";
    }

    const matches = getLiveMatches();
    let liveMatchNames: any[][] = [];

    for (const matchName of matches) {

        const teams = matchName.match?.teams;

        if (teams && teams.length >= 2) {
            liveMatchNames.push([teams[0].name, teams[1].name])
        }
    }

    return liveMatchNames;
}

