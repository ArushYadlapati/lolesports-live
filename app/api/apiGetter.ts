import * as dotenv from 'dotenv';
import {getLeagues} from "@/app/helper/leagues";

dotenv.config();

const token = process.env.NEXT_PUBLIC_TOKEN;

let response: any;
let data;
let events: any[] = [];

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
    return Array.isArray(liveMatches) ? (liveMatches.length > 0 ? liveMatches : []) : [];
}

export function getNextMatches(): any[] {
    const nextMatches = getMatch("unstarted");
    return Array.isArray(nextMatches) ? nextMatches : [];
}

export function getPastMatches(): any[] {
    const pastMatches = getMatch("completed");
    return Array.isArray(pastMatches) ? pastMatches : [];
}

export function getMatch(matchType : string) {
    if (!response) {
        return "None";
    }

    const pastMatches: any[] = [];

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
            pastMatches.push(latestMatch);
        }
    }

    return pastMatches;
}

