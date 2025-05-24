import * as dotenv from 'dotenv';
import { getLeagues } from "@/app/helper/leagues";

dotenv.config();

const token = process.env.NEXT_PUBLIC_TOKEN;

let response = "";
let data;
let events: any[] = [];

export async function updateResponse() {
    const headers = new Headers();
    if (token) {
        headers.set("x-api-key", token);
    }

    try {
        response = JSON.stringify(
            await(
                await fetch(
                    "https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US",
                    { headers }
                )
            ).json()
        );

        data = JSON.parse(response);
        events = data?.data?.schedule?.events || [];
    } catch (e) {
        // uhhhh rip, it got cooked
    }
}

export function getLiveMatches() {
    const liveMatches = getMatch("inProgress");
    if (liveMatches.length <= 0 || liveMatches === "[]" || liveMatches === "None") {
        return "None";
    }
    return liveMatches;
}

export function getNextMatches() {
    return getMatch("unstarted");
}

export function getPastMatches() {
    return getMatch("completed");
}

export function getMatch(matchType : String) {
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

    return JSON.stringify(pastMatches, null, 2);
}

