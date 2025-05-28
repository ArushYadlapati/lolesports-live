"use client";
import { useState } from "react";
import React from "react";
import { useColorScheme, colorSchemes } from "./helper/colorScheme";
import { updateResponse, getLiveMatches, getNextMatches, getPastMatches } from "./api/apiGetter";
import { getFormattedMatches } from "./helper/team";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Image from "next/image";

export default function Home() {
    const [responseHtml, setResponseHtml] = useState("Press Get Match to Load Data");
    const { scheme, setScheme } = useColorScheme();

    const fetchMatches = async () => {
        await updateResponse();

        setResponseHtml(getFormattedMatches()
        );
    };

    const handleSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = event.target.value;
        const selectedScheme = colorSchemes.find((s) => s.name === selectedName);
        if (selectedScheme) {
            setScheme(selectedScheme);
        }
    };
    return (() => {
        return (
            <div className="min-h-screen flex flex-col items-center justify-start px-2 py-2"
                 style={{ backgroundColor: scheme.background, color: scheme.foreground, transition: "background-color 0.3s, color 0.3s" }}
            >
                <SpeedInsights />
                    <div className="my-0 p-0">
                        <Image src="/logo-v1.svg" alt="Logo" width={150} height={150} />
                    </div>
                    <main className="w-full max-w-4xl space-y-6">
                        <div className="flex justify-center">
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex items-center space-x-2">
                                <label className="font-semibold">
                                    Color Scheme:
                                </label>

                                <select value= { scheme.name } onChange={ handleSchemeChange } className="p-2 rounded border shadow"
                                        style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                                >
                                { colorSchemes.map((color) => (
                                    <option key={ color.name } value={ color.name }>
                                        { color.name }
                                    </option>
                                ))}

                                </select>
                            </div>
                        </div>

                        <div className="shadow-md rounded-lg p-6 h-96 overflow-auto border"
                             style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground}}
                        >
                        <div className="text-sm font-mono" dangerouslySetInnerHTML={{ __html: responseHtml }} />
                            <br/>
                        </div>

                        <div className="flex justify-center">
                            <button onClick={ fetchMatches } className="px-6 py-3 rounded-full text-sm sm:text-base transition duration-200 shadow-md"
                                    style={{ backgroundColor: scheme.foreground, color: scheme.background }}
                            >
                                Get Match
                            </button>
                        </div>
                    </main>
                <SpeedInsights />
            </div>
        );
    })();
}
