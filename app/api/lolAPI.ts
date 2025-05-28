import * as dotenv from "dotenv";
import {getLeagues} from "@/app/helper/leagues";

dotenv.config();

const token = process.env.NEXT_PUBLIC_LOL;

let response: any;
let data;
let events: any[] = [];
let liveMatchNames: any[] = [];

export async function updateResponse() {
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

export function getLiveMatches(): any[] {
    const liveMatches = getMatch("inProgress");
    if (Array.isArray(liveMatches) && liveMatches.length > 0) {
        liveMatchNames = liveMatches.map(match => {
            const teams = match.match.teams;
            if (teams.length >= 2) {
                return `${teams[0].name} vs ${teams[1].name}`;
            }
        })
        return liveMatches;
    }
    return [];
}

export function getNextMatches(): any[] {
    const nextMatches = getMatch("unstarted");
    if (Array.isArray(nextMatches)){
        return nextMatches;
    }

    return [];
}

export function getPastMatches(): any[] {
    const pastMatches = getMatch("completed");
    if (Array.isArray(pastMatches)) {
        return pastMatches;
    }

    return [];
}

export function getMatch(matchType : string) {
    if (!response) {
        return "None";
    }

    const matches: any[] = [];

    for (const league of getLeagues()) {
        let latestMatch = null;

        for (const event of events) {
            const slug = event?.league?.slug;
            if (event.state === matchType && slug === league) {
                if (!latestMatch || new Date(event.startTime) > new Date(latestMatch.startTime)) {
                    latestMatch = event;
                }
            }
        }

        if (latestMatch) {
            matches.push(latestMatch);
        }
    }

    return matches;
}

export function getLiveMatchNames(): any[] {
    if (liveMatchNames.length > 0) {
        return liveMatchNames;
    }

    return [];
}

