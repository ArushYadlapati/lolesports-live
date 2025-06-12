"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { updateResponse } from "./api/lolAPI";
import { capitalize } from "@/app/helper/util";
import { getFormattedMatches } from "./helper/team";
import { changeLeagues, getCurrentSortMode } from "@/app/helper/leagues";
import { FilterModes, getCurrentFilterMode, setFilterMode, setSortMode, SortModes } from "@/app/helper/leagues";
import { useColorScheme, colorSchemes, getButtonStyle, getButtonClassName, setCurrentColorScheme} from "./helper/colorScheme";

export default function Home() {
    const { scheme, setScheme } = useColorScheme();
    const [sort, setSort] = useState(getCurrentSortMode());
    const [filter, setFilter] = useState(getCurrentFilterMode());
    const [button, setButton] = useState<{ [key: string] : boolean }>({ });
    const [responseText, setResponseText] = useState("Loading Matches...");

    setCurrentColorScheme(scheme);

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

    // Updates scheme
    useEffect(() => {
        fetchMatches().then(() => { });
    }, [scheme]);

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

                style={ getButtonStyle(button[league], scheme) }
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
            <div className="h-screen flex flex-col items-center justify-center px-4 py-3"
                 style={{ backgroundColor: scheme.background, color: scheme.foreground, transition: "background-color 0.3s, color 0.3s" }}
            >
                <div className="flex-shrink-0">
                    {/* Logo: */}
                    <Image src="/logo-v1.svg" alt="Logo" width={ 150 } height={ 150 } />
                </div>
                <main className="w-full max-w-4xl flex flex-col flex-1 min-h-0 container mx-2 items-center">
                    <div className="flex justify-center mb-6">
                    </div>
                    <div className="flex flex-col items-center mb-6 flex-shrink-0">
                        <div className="flex items-center space-x-2 mb-3.5">
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
                            <select value={ sort } onChange={ (event) => {
                                setSort(event.target.value);
                                setSortMode(event.target.value);
                                fetchMatches().then(() => { });
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
                            <select value= { scheme.name } className="p-2 rounded border shadow"
                                    style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                                    onChange={(event) => {
                                        handleSchemeChange(event);
                                        fetchMatches().then(() => { });
                                    }}
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
                    <div className="flex-1 shadow-md rounded-lg p-6 overflow-auto border mb-6 w-full max-w-3xl"
                         style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                    >
                        <div className="flex flex-col items-center w-full" style={{ accentColor: scheme.foreground }}>
                            <div className="text-sm font-mono text-center" dangerouslySetInnerHTML={{ __html: responseText }} />
                        </div>

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
