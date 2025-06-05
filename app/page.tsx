"use client";
import { useState, useEffect } from "react";
import React from "react";
import {useColorScheme, colorSchemes, getButtonStyle } from "./helper/colorScheme";
import {updateResponse } from "./api/lolAPI";
import { getFormattedMatches } from "./helper/team";
import Image from "next/image";
import { FilterModes, getCurrentFilterMode, setFilterMode, setSortMode, SortModes } from "@/app/helper/leagues";
import { changeLeagues, getCurrentSortMode, hasLeague } from "@/app/helper/leagues";

import {capitalize} from "@/app/helper/util";

export default function Home() {
    const [responseText, setResponseText] = useState("Press Get Match to Load Data");
    const [sort, setSort] = useState(getCurrentSortMode());
    const [filter, setFilter] = useState(getCurrentFilterMode());
    const { scheme, setScheme } = useColorScheme();

    let fetchMatches = async () => {
        await updateResponse();

        setResponseText(getFormattedMatches());
        console.log("Fetched");
        // console.log(getLiveMatchNames());
        // console.log(getLeagues());
        // console.log(getCurrentSortMode());
    };

    useEffect(() => {
        fetchMatches().then(() => null);

        const interval = setInterval(()=> {
            fetchMatches().then(() => null);
        }, 600000); // in ms, so 600,000 = 600*1000 ms = 600*1 second = 600 seconds = 10 minutes
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
                ${ [hasLeague(league) && "ring-4 scale-105"].filter(Boolean).join(" ") }` }
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
                                Filter By:
                            </label>
                            <select value={ filter } onChange={(event) => {
                                    setFilter(event.target.value);
                                    setFilterMode(event.target.value);
                                    fetchMatches().then(() => {});
                                }}
                                    className="p-2 text sm rounded border shadow w-32"
                                    style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                            >
                                { Object.entries(FilterModes).map(([k, v]) => {
                                    return (<option key={ k } value={ v }>
                                        { v }
                                    </option>);
                                })}
                            </select>

                            <label className="font-semibold">
                                Sort By:
                            </label>
                            <select value={ sort } onChange={(event) => {
                                setSort(event.target.value);
                                setSortMode(event.target.value);
                                fetchMatches().then(() => {});
                            }}
                                    className="p-2 rounded border shadow"
                                    style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                            >
                                { Object.values(SortModes).map(( sortMode) => {
                                    return (<option key={ sortMode } value={ sortMode }>
                                        { capitalize( sortMode) }
                                    </option>);
                                })}
                            </select>

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
                        { getLeagueButton("lcp") }
                    </div>
                </main>
            </div>
        );
    })();
}
