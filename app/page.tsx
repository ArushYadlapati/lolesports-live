"use client";
import { useState } from "react";
import { updateResponse, getLiveMatch, getNextMatch } from "./api";

const leagues = ["lck", "lpl", "lec", "lcs", "cblol-brazil", "lla"];

export default function Home() {
    const [responseText, setResponseText] = useState(
        "Press Get Match to Load Data"
    );
    const [isLoading] = useState(false);

    const fetchMatches = async () => {
        try {
            await updateResponse();
            const liveMatches = getLiveMatch();

            if (liveMatches.length > 0) {
                setResponseText(JSON.stringify(liveMatches, null, 2));
            } else {
                const nextMatches: any[] = []

                for (const league of leagues) {
                    const match = getNextMatch(league);
                    if (match) {
                        nextMatches.push(match);
                    }
                }

                setResponseText(JSON.stringify(nextMatches, null, 2));
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
