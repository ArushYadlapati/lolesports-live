import {getLiveMatchNames} from "@/app/api/lolAPI";

const streams: string[] = ["https://twitch.tv/lck", // lck
                            "https://twitch.tv/LTANorth", // lta_n
                            "https://www.twitch.tv/ltasul", // lta_s
                            "https://twitch.tv/LPL", // lpl
                            "https://twitch.tv/LEC", // lec
                            "https://www.twitch.tv/lolesportstw/"]; // lcp

const polls: { [key: string]: string } = {
    "lck": ``,
    "lpl": ``,
    "lec": ``,
    "lta_n": ``,
    "lta_s": ``,
    "lta_cross": ``,
    "lcp": ``
}

// Uses web scraper to get the official data:
export async function getTwitchPolls() {
    const liveMatchNames = getLiveMatchNames();

    if (liveMatchNames.length > 0) {
        return "";
    }

    for (const liveMatch of liveMatchNames) {

    }

    for (const stream of streams) {
        try {
            // code goes here
        } catch (e) {
           // uhhhh rip, it got cooked
        }
    }
}

export function formatPolls() : string {
    return "";
}