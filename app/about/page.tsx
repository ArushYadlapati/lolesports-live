"use client";

import Image from "next/image";
import { useColorScheme } from "@/app/helper/colorScheme";
import {JSX, useState} from "react";
import Menu, {dimClass, safeIsMobile} from "@/app/menu/menu";

/**
 * About page for the LoL Live app.
 * Provides information about the app, its features, and me.
 *
 * @returns { JSX.Element } The About page component.
 */
export default function About(): JSX.Element {
    const { scheme } = useColorScheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const divCN = safeIsMobile()
        ?{ backgroundColor: scheme.background, color: scheme.foreground, overflow: "hidden", height: "100vh" }
        :{ backgroundColor: scheme.background, color: scheme.foreground };

    return (
        <main className="flex flex-col min-h-screen px-4 py-3" style={ divCN }>
            <Menu isOpen={ isSidebarOpen } setIsOpen={ setIsSidebarOpen } />
            <div className={ dimClass(isSidebarOpen) }>
                <div className="flex flex-col md:flex-row justify-between items-start mt-12 gap-12 pl-10">
                    <div className="flex-1">
                        <h1 className="text-5xl font-bold mb-6">
                            About
                        </h1>

                        <a href="https://neighborhood.hackclub.com/" target="_blank" rel="noopener noreferrer">
                            <img
                                src="https://img.shields.io/badge/made%20for%20neighborhood-bf8f73?style=for-the-badge&logo=hackclub&logoColor=ffffff"
                                className="pt-2 pb-7"
                                alt="Made for Neighborhood"
                            />
                        </a>

                        <p className="text-lg leading-relaxed mb-10 max-w-2xl">
                            This Next.js + TypeScript app gets live data for current, past, and future League of Legends pro matches.
                            It was built for Hack Club’s <a href="https://neighborhood.hackclub.com" className="underline { scheme.foreground }" target="_blank"> Neighborhood Program</a> by
                            lead (and only) developer <a href="https://arush.me" className="underline { scheme.foreground }" target="_blank"> Arush Y</a>.
                            See the Betting page for more information about the betting.
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
            </div>
        </main>
    );
}
