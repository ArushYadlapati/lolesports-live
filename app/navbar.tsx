"use client";

import Link from "next/link";
import Image from "next/image";
import { useColorScheme } from "@/app/helper/colorScheme";

export default function Navbar() {
    const { scheme } = useColorScheme();

    return (
        <nav className="flex justify-between items-center px-6 py-4 w-full z-50"
             style={{ backgroundColor: scheme.foreground, color: scheme.background,
                      transition: "background-color 0.3s, color 0.3s", boxShadow: `0 6px 20px ${ scheme.foreground }`,
                      borderBottom: `2px solid ${ scheme.foreground }22`,
            }}
        >
            <div className="flex items-center space-x-3">
                <Image src="/favicon-clearbg.png" alt="Logo" width={ 40 } height={ 40 } />
                <span className="text-lg font-semibold">
                    LoL Esports Live
                </span>
            </div>

            <div className="flex items-center space-x-6">
                <Link href="/" className="hover:underline">
                    View Matches
                </Link>

                <Link href="/about" className="hover:underline">
                    About
                </Link>

                <a href="https://github.com/ArushYadlapati/lolesports-live" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Source Code (GitHub)
                </a>

                <Link href="/betting" className="hover:underline">Betting</Link>

                <Image src="/colorCircleIcon.png" alt="Change Color Scheme" width={ 40 } height={ 40 } style={{ cursor: "pointer" }}/>
            </div>
        </nav>
    );
}
