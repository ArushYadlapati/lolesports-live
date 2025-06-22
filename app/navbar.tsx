"use client";

import Link from "next/link";
import Image from "next/image";
import { useColorScheme } from "@/app/helper/colorScheme";

export default function Navbar() {
    const { scheme, setScheme } = useColorScheme();

    return (
        <nav className="flex justify-between items-center px-6 py-4 shadow-md w-full"
             style={{ backgroundColor: scheme.background, color: scheme.foreground }}
        >
            <div className="flex items-center space-x-3">
                <Image src="/favicon-clearbg.png" alt="Logo" width={ 40 } height={ 40 } />
                <span className="text-lg font-semibold">LoL Esports Live</span>
            </div>

            <div className="flex items-center space-x-6">
                <Link href="/" className="hover:underline">
                    View Matches
                </Link>
                <Link href="/About" className="hover:underline">
                    Page
                </Link>
                <a href="https://github.com/ArushYadlapati/lolesports-live" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Source Code (GitHub)
                </a>
                <Link href="/betting/page" className="hover:underline">
                    Betting
                </Link>

                <Image src="/colorCircleIcon.png" alt="Change Color Scheme" width={ 40 } height={ 40 } />
            </div>
        </nav>
    );
}
