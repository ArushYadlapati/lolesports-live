"use client";

import Link from "next/link";
import Image from "next/image";
import {colorSchemes, useColorScheme } from "@/app/helper/colorScheme";
import React from "react";

let appBold = "";
let aboutBold = "";
let bettingBold = "";

export function setCurrentPage(name: string) {
    switch (name) {
        case "app":
            appBold = "font-bold";
            aboutBold = "";
            bettingBold = "";
            break;
        case "about":
            appBold = "";
            aboutBold = "font-bold";
            bettingBold = "";
            break;
        case "betting":
            appBold = "";
            aboutBold = "";
            bettingBold = "font-bold";
            break;
        default:
            appBold = "";
            aboutBold = "";
            bettingBold = "";
    }
}

export default function Navbar() {
    const { scheme, setScheme } = useColorScheme();

    const handleSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName: string = event.target.value;
        const selectedScheme = colorSchemes.find((s) => s.name === selectedName);
        if (selectedScheme) {
            setScheme(selectedScheme);
        }
    };
    console.log(appBold);
    return (
        <nav className="flex justify-between items-center px-6 py-4 w-full z-50"
             style={{ backgroundColor: scheme.foreground, color: scheme.background,
                 transition: "background-color 0.3s, color 0.3s", boxShadow: `0 0px 1000px ${ scheme.foreground }`,
             }}
        >
            <div className="flex items-center space-x-3">
                <Image src="/favicon-clearbg.png" alt="Logo" width={ 40 } height={ 40 } />
                <span className="text-lg font-semibold">
                    LoL Esports Live
                </span>
            </div>

            <div className="flex items-center space-x-6">
                <Link href="/" className="hover:underline { appBold }">
                    View Matches
                </Link>

                <Link href="/about" className="hover:underline { aboutBold }">
                    About
                </Link>

                <a href="https://github.com/ArushYadlapati/lolesports-live" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Source Code (GitHub)
                </a>

                <Link href="/betting" className="hover:underline { bettingBold }">
                    Betting
                </Link>

                <select value= { scheme.name } className="p-2 rounded border shadow"
                        style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                        onChange={ handleSchemeChange }
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
