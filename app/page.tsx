"use client";
import { useState } from "react";

export default function Home() {
  const [responseText, setResponseText] = useState("Press Get Match to Load Data");
  const [isLoading, setIsLoading] = useState(false);

  const urlString = "https://api.pandascore.co/lol/matches?filter[status]=running";

  const fetchMatches = async () => {
    setIsLoading(true);

    const response = await fetch(urlString, {
      headers: {
        'Authorization': `Bearer bE5TU4_0fsjBuM04FQ0ukBNEcOgkB2UTf9rC_kl0XBbv0PH5z9k`
        // yes, this is an access token, but it's a public one and not sensitive
        // the authorization header is required for the API to work, but the token is not sensitive
      }
    });

    const data = await response.json();
    setResponseText(JSON.stringify(data, null, 2));
    setIsLoading(false);

  };

  return (() => {
    let buttonText;

    if (isLoading) {
      buttonText = "Loading Match";
    } else {
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