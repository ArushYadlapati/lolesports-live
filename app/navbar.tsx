"use client";

import Link from "next/link";
import Image from "next/image";
import {colorSchemes, getCurrentColorScheme, setCurrentColorScheme, useColorScheme} from "@/app/helper/colorScheme";
import React from "react";
import { updatePageScheme } from "@/app/page";

export default function Navbar() {
    const colorScheme = getCurrentColorScheme();
    const { scheme, setScheme } = useColorScheme();

    const handleSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName: string = event.target.value;
        const selectedScheme = colorSchemes.find((s) => s.name === selectedName);
        if (selectedScheme) {
            setScheme(selectedScheme);
            setCurrentColorScheme(selectedScheme);
            updatePageScheme(selectedScheme);
        }
        console.log("Selected Scheme", selectedScheme);
        // setScheme(selectedScheme);
        // setCurrentColorScheme(selectedScheme);
        updatePageScheme(selectedScheme);
    };

    return (
        <nav className="flex justify-between items-center px-6 py-4 w-full z-50"
             style={{ backgroundColor: colorScheme.foreground, color: colorScheme.background,
                      transition: "background-color 0.3s, color 0.3s", boxShadow: `0 6px 20px ${ colorScheme.foreground }`,
                      borderBottom: `2px solid ${ colorScheme.foreground }22`,
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

                <Link href="/betting" className="hover:underline">
                    Betting
                </Link>

                <select value= { scheme.name } className="p-2 rounded border shadow"
                        style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                        onChange={(event) => {
                            handleSchemeChange(event);
                        }}
                >
                    { colorSchemes.map((color) => (
                        <option key={ color.name } value={ color.name }>
                            { color.name }
                        </option>
                    ))}

                </select>

            </div>
        </nav>
    );
}
