"use client";
import { useState } from "react";
import { updateResponse, getLiveMatches, getNextMatches, getPastMatches } from "./api";

export default function Home() {
    const [responseText, setResponseText] = useState(
        "Press Get Match to Load Data"
    );

    const fetchMatches = async () => {
        await updateResponse();
        setResponseText("Live Matches\n____________\n" + getLiveMatches() +
            "\n\nNext Matches\n____________\n" + getNextMatches() +
            "\n\nPast Matches\n____________\n" + getPastMatches());
    };

    return (() => {
        return (
            <div
                className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center px-6 py-12">
                <main className="w-full max-w-4xl space-y-8">
                    <div
                        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 h-96 overflow-auto border border-gray-200 dark:border-gray-700">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                            { responseText }
                        </pre>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={fetchMatches}
                            className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm sm:text-base hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-200 shadow-md"
                        >
                            Get Match
                        </button>
                    </div>
                </main>
            </div>
        );
    })();
}
