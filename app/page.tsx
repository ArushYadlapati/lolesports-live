"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { updateResponse } from "./api/lolAPI";
import { capitalize } from "@/app/helper/util";
import { getFormattedMatches } from "./helper/team";
import { changeLeagues, getCurrentSortMode } from "@/app/helper/leagues";
import { FilterModes, getCurrentFilterMode, setFilterMode, setSortMode, SortModes } from "@/app/helper/leagues";
import { useColorScheme, getButtonStyle, getButtonClassName } from "./helper/colorScheme";
import { updateGPR } from "@/app/api/gprAPI";
import * as dotenv from "dotenv";
import Menu, {dimClass, isMobile, viewMatchesText} from "@/app/menu/menu";

dotenv.config();

/**
 * Home component that displays the main page of the application.
 * You can view matches, filter them, sort them, and toggle the visibility of different leagues.
 *
 * @returns { React.JSX.Element } - The main page of the application.
 */
export default function Home(): React.JSX.Element {
    const { scheme, setScheme } = useColorScheme();
    const [sort, setSort] = useState(getCurrentSortMode());
    const [filter, setFilter] = useState(getCurrentFilterMode());
    const [button, setButton] = useState<{ [key: string]: boolean }>({ });
    const [responseText, setResponseText] = useState("Loading Matches (just for you!)...");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    let fetchMatches = async () => {
        await updateResponse();
        setResponseText(getFormattedMatches());

        console.log("Fetched");

        await updateGPR();
    };

    useEffect(() => {
        fetchMatches().then(() => null);

        const interval = setInterval(() => {
            fetchMatches().then(() => null);
        }, 600000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchMatches().then(() => { });
    }, [scheme]);

    function getLeagueButton(league: string): React.JSX.Element {
        let buttonName = league.toUpperCase();

        if (league === "lta_n") {
            buttonName = "LTA NORTH";
        } else if (league === "lta_s") {
            buttonName = "LTA SOUTH";
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

    function selectModes() {
        if (isMobile()) {
            return (
                <div className="content-center w-full flex flex-col items-center p-6 space-y-4">
                    <div className="w-full flex justify-center gap-4 items-center">
                        <div className="flex items-center space-x-1">
                            <label className="font-semibold text-sm text-left">Filter Mode:</label>
                            <select
                                value={filter}
                                onChange={(event) => {
                                    setFilter(event.target.value);
                                    setFilterMode(event.target.value);
                                }}
                                className="p-2 text-sm rounded border shadow w-25"
                                style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                            >
                                { Object.entries(FilterModes).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Mode */}
                        <div className="flex items-center space-x-1">
                            <label className="font-semibold text-sm text-left">Sort Mode:</label>
                            <select
                                value={sort}
                                onChange={(event) => {
                                    setSort(event.target.value);
                                    setSortMode(event.target.value);
                                    fetchMatches().then(() => {});
                                }}
                                className="p-2 text-sm rounded border shadow w-25"
                                style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                            >
                                {Object.values(SortModes).map((sortMode) => (
                                    <option key={sortMode} value={sortMode}>
                                        {capitalize(sortMode)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    function leagueModes() {
        if (window.innerWidth < 768) {
            return (
                <div className="w-64 flex flex-col items-center justify-center space-y-4 flex-shrink-0 pt-20">
                    { getLeagueButton("msi") }
                    { getLeagueButton("lck") }
                    { getLeagueButton("lpl") }
                    { getLeagueButton("lec") }
                    { getLeagueButton("lcp") }
                    { getLeagueButton("lta_n") }
                    { getLeagueButton("lta_s") }
                </div>
            );
        }
        return null;
    }

    return (() => {
        return (
            <div className="h-screen flex flex-col px-4 py-3"
                 style={{ backgroundColor: scheme.background, color: scheme.foreground, transition: "background-color 0.3s, color 0.3s", overflow: "hidden" }}
            >
                <Menu isOpen={ isSidebarOpen } setIsOpen={ setIsSidebarOpen } />

                <div className={ dimClass(isSidebarOpen) }>
                    <div className="flex flex-1 min-h-0 justify-center gap-20">
                        <div className="w-64 flex flex-col items-center space-y-6 flex-shrink-0 pt-30 pl-20">
                            <Image src="/logo-v1.svg" alt="Logo" width={ 200 } height={ 200 } />

                            <div className="flex flex-col space-y-4 w-full">
                                <div className="flex flex-col space-y-2">
                                    <label className="font-semibold text-lg text-center">
                                        Filter Mode:
                                    </label>
                                    <select value={ filter }
                                            onChange={ (event) => {
                                                setFilter(event.target.value);
                                                setFilterMode(event.target.value);
                                                fetchMatches().then(() => { });
                                            }}
                                            className="p-3 text-sm rounded border shadow w-full"
                                            style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                                    >
                                        { Object.entries(FilterModes).map(([key, value]) => (
                                            <option key={ key } value={ value }>
                                                { value }
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label className="font-semibold text-lg text-center">
                                        Sort Mode:
                                    </label>
                                    <select value={ sort }
                                            onChange={ (event) => {
                                                setSort(event.target.value);
                                                setSortMode(event.target.value);
                                                fetchMatches().then(() => { });
                                            }}
                                            className="p-3 text-sm rounded border shadow w-full"
                                            style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                                    >
                                        { Object.values(SortModes).map((sortMode) => (
                                            <option key={ sortMode } value={ sortMode }>
                                                { capitalize(sortMode) }
                                            </option>
                                        )) }
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center max-w-3xl overflow-hidden min-w-xl"
                             style={{ flexGrow: 1, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
                        >
                            <main className="w-full flex flex-col flex-1 min-h-0 items-center">
                                { viewMatchesText() }
                                { selectModes() }
                                <div className="flex-1 shadow-md rounded-2xl p-6 overflow-y-auto border mb-6 w-full min-h-0"
                                    style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground, maxHeight: "calc(100vh - 100px)" }}
                                >
                                    <div
                                        className="flex flex-col items-center w-full h-full"
                                        style={{ accentColor: scheme.foreground, overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
                                    >
                                        <div className="text-sm font-mono text-center" dangerouslySetInnerHTML={{ __html: responseText }}/>
                                    </div>
                                </div>
                            </main>
                        </div>

                        <div className="w-64 flex flex-col items-center space-y-4 flex-shrink-0 pt-20">
                            { getLeagueButton("msi") }
                            { getLeagueButton("lck") }
                            { getLeagueButton("lpl") }
                            { getLeagueButton("lec") }
                            { getLeagueButton("lcp") }
                            { getLeagueButton("lta_n") }
                            { getLeagueButton("lta_s") }
                        </div>
                    </div>
                </div>
            </div>
        );
    })();
}
