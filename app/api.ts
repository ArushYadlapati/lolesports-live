import * as dotenv from 'dotenv';

dotenv.config();

const token = process.env.NEXT_PUBLIC_TOKEN;
const leagues = ["lck", "lpl", "lec", "lcs", "cblol-brazil", "lla"];

let response = "";

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
    } catch (error) {
        console.error("Failed to fetch schedule data:", error);
    }
}
export function getLiveMatch() {
    if (!response) return [];

    const data = JSON.parse(response);
    const events = data?.data?.schedule?.events || [];

    return events.filter(
        (event: any) =>
            event.state === "inProgress" &&
            leagues.includes(event.league?.slug)
    );
}

export function getNextMatch(league: string) {
    if (!response) return null;

    const data = JSON.parse(response);
    const events = data?.data?.schedule?.events || [];

    for (const event of events) {
        const slug = event?.league?.slug;
        if (slug === league && event.state === "unstarted") {
            return event;
        }
    }

    return null;
}
