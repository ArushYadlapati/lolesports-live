const streams: string[] = ["https://twitch.tv/lck", // lck
                            "https://twitch.tv/LTANorth", // lta_n
                            "https://www.twitch.tv/ltasul", // lta_s
                            "https://twitch.tv/LPL", // lpl
                            "https://twitch.tv/LEC", // lec
                            "https://www.twitch.tv/lolesportstw/"]; // lcp

const polls: any[] = [``, // lck
                      ``, // lta_n
                      ``, // lta_s
                      ``, // lpl
                      ``, // lec
                      ``] // lcp

// Uses web scraper to get the official data:
export async function getTwitchPolls() {
    for (const stream of streams) {
        try {
            // stream.toString()
        } catch (e) {
           // uhhhh rip, it got cooked
        }
    }
}