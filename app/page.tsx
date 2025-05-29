"use client";
import { useState } from "react";
import { useEffect } from "react";
import React from "react";
import {useColorScheme, colorSchemes, getButtonColor, getButtonStyle} from "./helper/colorScheme";
import {updateResponse, getLiveMatches, getNextMatches, getPastMatches, getLiveMatchNames} from "./api/lolAPI";
import { getFormattedMatches } from "./helper/team";
import Image from "next/image";
import {changeLeagues, getLeagues, hasLeague, ltaCrossExists} from "@/app/helper/leagues";

export default function Home() {
    const [responseText, setResponseText] = useState("Press Get Match to Load Data");
    const { scheme, setScheme } = useColorScheme();

    let fetchMatches = async () => {
        await updateResponse();

        setResponseText(getFormattedMatches());
        console.log("Fetched");
        console.log(getLiveMatchNames());
        console.log(getLeagues());
    };

    useEffect(() => {
        fetchMatches().then(() => null);

        const interval = setInterval(()=> {
            fetchMatches().then(() => null);
        }, 6000000); // in ms, so 600,000 = 600*1000 ms = 600*1 second = 600 seconds = 10 minutes
        return () => clearInterval(interval);
    }, []);

    function getLeagueButton(league: string): React.JSX.Element {
        let buttonName = league.toUpperCase();

        if (league === "lta_n") {
            buttonName = "LTA North";
        } else if (league === "lta_s") {
            buttonName = "LTA South";
        }

        return (
            <button key = { league } onClick={() => {
                changeLeagues(league);
                fetchMatches().then(() => null);
            }}
                    className={`px-6 py-3 rounded-full text-sm sm:text-base transition duration-200 shadow-md
                ${ hasLeague(league) ? "ring-4 scale-105" : "" }` }
                    style={getButtonStyle(league, scheme)}
            >
                { buttonName }
            </button>
        );
    }

    const handleSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = event.target.value;
        const selectedScheme = colorSchemes.find((s) => s.name === selectedName);
        if (selectedScheme) {
            setScheme(selectedScheme);
        }
    };

    return (() => {
        return (
            <div className="min-h-screen flex flex-col items-center justify-start px-4 py-3"
                 style={{ backgroundColor: scheme.background, color: scheme.foreground, transition: "background-color 0.3s, color 0.3s" }}
            >
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
                         style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                    >
                        <div className="text-sm font-mono" dangerouslySetInnerHTML={{ __html: responseText }} />
                        <br/>
                    </div>
                    <div className="flex justify-center space-x-0 flex-wrap gap-4">
                        { getLeagueButton("lck") }
                        { getLeagueButton("lpl") }
                        { getLeagueButton("lec") }
                        { getLeagueButton("lta_n") }
                        { getLeagueButton("lta_s") }
                        { getLeagueButton("pcs") }
                    </div>
                </main>
            </div>
        );
    })();
}
