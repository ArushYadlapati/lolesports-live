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
    const liveMatches = getMatches("inProgress");
    if (Array.isArray(liveMatches) && liveMatches.length > 0) {
        return liveMatches;
    }
    return [];
}

export function getNextMatches() : any[] {
    const nextMatches = getMatches("unstarted");
    if (Array.isArray(nextMatches)){
        return nextMatches;
    }

    return [];
}

export function getPastMatches() : any[] {
    const pastMatches = getMatches("completed");
    if (Array.isArray(pastMatches)) {
        return pastMatches;
    }

    return [];
}

export function getMatchesByDate() {
    if (!response) {
        return [];
    }

    const matches: any[] = [];

    ltaCrossExists()

    for (const match of events) {
        if (getLeagues().includes(match?.league?.slug)) {
            matches.push(match);
        }
    }

    return matches;
}

export function getMatches(matchType : string) {
    if (!response) {
        return "None";
    }

    const matches: any[] = [];

    ltaCrossExists();

    for (const league of getLeagues()) {
        let latestMatch = null;

        for (const event of events) {
            if (event.state === matchType && event?.league?.slug === league) {
                if (!latestMatch || new Date(event.startTime) > new Date(latestMatch.startTime)) {
                    latestMatch = event;
                    matches.push(event);
                }
            }
        }
    }

    return matches;
}

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

