"use client";
import { useState, useEffect } from "react";
import React from "react";
import { useColorScheme, colorSchemes, getButtonStyle, getButtonClassName } from "./helper/colorScheme";
import { updateResponse } from "./api/lolAPI";
import { getFormattedMatches } from "./helper/team";
import Image from "next/image";
import { FilterModes, getCurrentFilterMode, setFilterMode, setSortMode, SortModes } from "@/app/helper/leagues";
import { changeLeagues, getCurrentSortMode } from "@/app/helper/leagues";

import { capitalize } from "@/app/helper/util";

export default function Home() {
    const [responseText, setResponseText] = useState("Press Get Match to Load Data");
    const [sort, setSort] = useState(getCurrentSortMode());
    const [filter, setFilter] = useState(getCurrentFilterMode());
    const { scheme, setScheme } = useColorScheme();
    const [button, setButton] = useState<{ [key: string] : boolean }>({ });
    // const [buttonStates, setButtonStates] = useState<{[key: string]: boolean}>( {});

    // The main function that gets the matches, and updates the response text in the big box (runs automatically on refresh/changing filter/sort mode)
    let fetchMatches = async () => {
        await updateResponse();

        setResponseText(getFormattedMatches());

        // console.log() for testing
        console.log("Fetched");
        // console.log(getLiveMatchNames());
        // console.log(getLeagues());
        // console.log(getCurrentSortMode());
    };

    // A useEffect hook that fetches matches automatically after 10 min
    useEffect(() => {
        fetchMatches().then(() => null);

        const interval = setInterval(()=> {
            fetchMatches().then(() => null);
        }, 600000); // in ms, so 600,000 = 600*1000 ms = 600*1 second = 600 seconds = 10 minutes
        return () => clearInterval(interval);
    }, []);

    /**
     * Creates a button for each league in leagues, which controls which leagues are shown
     * @param league - the league for the button to based upon
     * @return {React.JSX.Element} - A button for that league
     */
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

                setButton(button => ({
                    ...button,
                    [league]: !button[league]
                }));
            }}
                className={ getButtonClassName(league) }

                style={getButtonStyle(button[league], scheme)}
            >
                { buttonName }
            </button>
        );
    }

    // As the function name says, this handles the scheme/color change on-click whenever you change the color scheme via dropdown
    const handleSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = event.target.value;
        const selectedScheme = colorSchemes.find((s) => s.name === selectedName);
        if (selectedScheme) {
            setScheme(selectedScheme);
        }
    };

    return (() => {
        return (
            <div className="h-screen flex flex-col items-center px-4 py-3"
                 style={{ backgroundColor: scheme.background, color: scheme.foreground, transition: "background-color 0.3s, color 0.3s" }}
            >
                <div className="flex-shrink-0">
                    {/* Logo: */}
                    <Image src="/logo-v1.svg" alt="Logo" width={150} height={150} />
                </div>
                <main className="w-full max-w-4xl flex flex-col flex-1 min-h-0">
                    <div className="flex justify-center mb-6">
                    </div>
                    <div className="flex flex-col items-center mb-6 flex-shrink-0">
                        <div className="flex items-center space-x-2">
                            {/* Filter By Dropdown: */}
                            <label className="font-semibold">
                                Filter By:
                            </label>
                            <select value={ filter } onChange={(event) => {
                                    setFilter(event.target.value);
                                    setFilterMode(event.target.value);
                                    fetchMatches().then(() => {});
                                }}
                                    className="p-2 text sm rounded border shadow flex"
                                    // className="p-2 text sm rounded border shadow w-44"
                                    style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                            >
                                { Object.entries(FilterModes).map(([key, value]) => {
                                    return (<option key={ key } value={ value }>
                                        { value }
                                    </option>);
                                })}
                            </select>

                            {/* Sort By Dropdown: */}
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

                            {/* Color Scheme Dropdown: */}
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

                    {/* Box that shows all the information of the matches given the constraints (league restrictions + sort/filter modes): */}
                    <div className="flex-1 shadow-md rounded-lg p-6 overflow-auto border mb-6 min-h-0"
                         style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                    >
                        <div className="text-sm font-mono" dangerouslySetInnerHTML={{ __html: responseText }} />
                        <br/>
                    </div>

                    {/* And at the very bottom, the buttons to control what leagues to show: */}
                    <div className="flex justify-center space-x-0 flex-wrap gap-4 flex-shrink-0">
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
