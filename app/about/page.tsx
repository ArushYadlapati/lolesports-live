"use client";

import Image from "next/image";
import Navbar, {setCurrentPage} from "@/app/navbar";
import { useColorScheme } from "@/app/helper/colorScheme";

export default function About() {
    const { scheme } = useColorScheme();

    setCurrentPage("about");

    return (
        <main className="flex flex-col min-h-screen px-4 py-3" style={{ backgroundColor: scheme.background, color: scheme.foreground }}>
            <Navbar />

            <div className="flex flex-col md:flex-row justify-between items-start mt-12 gap-12 pl-10 pt-7">
                <div className="flex-1">
                    <h1 className="text-5xl font-bold mb-6">
                        About
                    </h1>

                    <p className="text-lg leading-relaxed mb-10 max-w-2xl">
                        This Next.js + TypeScript app gets live data for current, past, and future League of Legends pro matches.
                        It was built for Hack Club’s <a href="https://neighborhood.hackclub.com" className="underline { scheme.foreground }" target="_blank"> Neighborhood Program</a> by
                        lead (and only) developer <a href="https://arush.me" className="underline { scheme.foreground }" target="_blank"> Arush Y</a>.
                    </p>

                    <h2 className="text-3xl font-bold mb-4">
                        Features
                    </h2>

                    <ul className="text-lg list-disc leading-relaxed mb-10 max-w-2xl space-y-2 pl-4">
                        <li>
                            Game win % (via Amazon GPR) for each match + a visual bar
                        </li>
                        <li>
                            Betting button to bet365 for each next match (see Betting page for more info)
                        </li>
                        <li>
                            Color scheme selectors (lots of options!)
                        </li>
                        <li>
                            Filter matches by type of match (finals, playoffs, regular season)
                        </li>
                        <li>
                            Sort modes for matches (by status, by date, and importance)
                        </li>
                        <li>
                            League selector buttons
                        </li>
                    </ul>
                </div>

                <div className="flex justify-center md:justify-end items-center pr-50">
                    <Image src="/logo-v1.svg" alt="LoL Live Logo" width={ 400 } height={ 400 } className="drop-shadow-lg"/>
                </div>
            </div>
        </main>
    );
}
