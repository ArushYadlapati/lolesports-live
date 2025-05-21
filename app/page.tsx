"use client";
import { useState } from "react";

const leagues = ['lck', 'lpl', 'lec', 'lcs', 'cblol-brazil', 'lla'];
const token = "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z";

export default function Home() {
  const [responseText, setResponseText] = useState("Press Get Match to Load Data");
  const [isLoading] = useState(false);

  const fetchMatches = async () => {
        try {
            const response = await
                fetch('https://esports-api.lolesports.com/persisted/gw/getLive?hl=en-US',
                {headers: {'x-api-key': token}}
            );

            const live = await response.json();
            let events = live?.data?.schedule?.events;

            const matches = events.filter(
                (majic: any) => // majic
                    majic.state === 'inProgress' && leagues.includes(majic.league?.slug)
            );

            if (matches.length > 0) { // live match!!!
                setResponseText(JSON.stringify(matches, null, 2));
            } else {
                // get next match if no live matches
                let schedule = await fetch(
                    'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US',
                    {
                        headers: {
                            'x-api-key': token,
                        },
                    }
                );

                const scheduleData = await schedule.json();
                const next: Record<string, any> = {};

                events = scheduleData?.data?.schedule?.events;

                let event;
                for (event of events) {
                    // IDK why it's called slug but its really just the league id tags or whatever according to the API docs
                    const slug = event?.league?.slug;
                    if (leagues.includes(slug) && event.state === 'unstarted' && !next[slug]) {
                        next[slug] = event;
                    }
                }

                setResponseText(
                    JSON.stringify(Object.values(next), null, 2)
                );
            }
    } catch (e) {
      // uhhhh rip, it got cooked
    }
  };

  return (() => {
    let buttonText = "Loading Match";
    if (!isLoading) {
      buttonText = "Get Match";
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
            <div className="w-full bg-black/[.05] dark:bg-white/[.06] rounded-lg p-4 h-96 overflow-auto">
          <pre className="text-sm font-[family-name:var(--font-geist-mono)]">
            {responseText}
          </pre>
            </div>
            <div className="flex gap-4 items-center flex-col sm:flex-row self-center">
              <button
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto disabled:opacity-50"
                  onClick={fetchMatches}
                  disabled={isLoading}
              >
                {buttonText}
              </button>
            </div>
          </main>
        </div>
    );
  })();
}