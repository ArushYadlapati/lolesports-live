import * as dotenv from 'dotenv';

dotenv.config();

const token = process.env.NEXT_PUBLIC_TOKEN;
const leagues = ["lck", "lpl", "lec", "lcs", "cblol-brazil", "lla"];

let response = "";
let data;
let events: any[] = [];

export async function updateResponse() {
    const headers = new Headers();
    if (token) {
        headers.set("x-api-key", token);
    }

    try {
        response = JSON.stringify(await(
            await fetch(
                "https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US",
                {headers}
            )
        ).json());

        data = JSON.parse(response);
        events = data?.data?.schedule?.events || [];
    } catch (e) {
        // uhhhh rip, it got cooked
    }
}

export function matchIsLive() {
    if (!response) {
        return false;
    }
    return getLiveMatch().length > 0;
}

export function getLiveMatch() {
    if (!response) {
        return [];
    }

    const liveMatches: any[] = [];

    for (const event of events) {
        if (
            event.state === "inProgress" &&
            leagues.includes(event.league?.slug)
        ) {
            liveMatches.push(event);
        }
    }

    return liveMatches;
}

export function getNextMatch(league: string) {
    if (!response) {
        return null;
    }

    for (const event of events) {
        const slug = event?.league?.slug;
        if (slug === league && event.state === "unstarted") {
            return event;
        }
    }

    return null;
}
