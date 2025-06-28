"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { updateResponse } from "./api/lolAPI";
import {capitalize, getTooltip, getTooltipHTML, getTooltipString} from "@/app/helper/util";
import {getFormattedMatches } from "./helper/team";
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

    function safeIsMobile() {
        try {
            return isMobile();
        } catch (e) {
            return false;
        }
    }

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
        try {
            if (isMobile()) {
                return (
                    <div className="content-center w-full flex flex-col items-center p-6 space-y-4">
                        <div className="w-full flex justify-center gap-4 items-center">
                            <div className="flex items-center space-x-1">
                                <label className="font-semibold text-sm text-left">
                                    Filter Mode:
                                </label>
                                <select value={ filter }
                                        onChange={ (event) => {
                                            setFilter(event.target.value);
                                            setFilterMode(event.target.value);
                                        }}
                                        className="p-2 text-sm rounded border shadow w-25"
                                        style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                                >
                                    { Object.entries(FilterModes).map(([key, value]) => (
                                        <option key={ key } value={ value }>
                                            { value }
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-1">
                                <label className="font-semibold text-sm text-left">
                                    Sort Mode:
                                </label>
                                <select value={ sort } className="p-2 text-sm rounded border shadow w-25"
                                        onChange={ (event) => {
                                            setSort(event.target.value);
                                            setSortMode(event.target.value);
                                            fetchMatches().then(() => { });
                                        }}
                                        style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                                >
                                    { Object.values(SortModes).map((sortMode) => (
                                        <option key={ sortMode } value={ sortMode }>
                                            { capitalize(sortMode) }
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

        catch (e) {
            return null;
        }
    }

    function leftBar() {
        if (!safeIsMobile()) {
            return (
                <div className="w-[200px] flex flex-col items-center flex-shrink-0 pt-20">
                    <Image src="/logo-v1.svg" alt="Logo" width={200} height={200} />

                    <div className="flex flex-col w-full">
                        <div className="flex flex-col space-y-2">
                            <label className="font-semibold text-3xl text-center flex items-center justify-center gap-1">
                                Filter Mode:
                                {getTooltip("Choose what type of match level/importance to filter by (playoffs, finals, etc.)", scheme)}
                            </label>

                            <select
                                value={filter}
                                className="p-3 text-sm rounded border shadow w-full"
                                onChange={(event) => {
                                    setFilter(event.target.value);
                                    setFilterMode(event.target.value);
                                    fetchMatches();
                                }}
                                style={{
                                    backgroundColor: scheme.background,
                                    color: scheme.foreground,
                                    borderColor: scheme.foreground,
                                }}
                            >
                                {Object.entries(FilterModes).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="font-semibold text-3xl text-center flex items-center justify-center gap-1 pt-10">
                                Sort Mode:
                                {getTooltip("Choose how to sort the filtered results (date, status of match, how important the matches are)", scheme)}
                            </label>

                            <select
                                value={sort}
                                className="p-3 text-sm rounded border shadow w-full"
                                onChange={(event) => {
                                    setSort(event.target.value);
                                    setSortMode(event.target.value);
                                    fetchMatches();
                                }}
                                style={{
                                    backgroundColor: scheme.background,
                                    color: scheme.foreground,
                                    borderColor: scheme.foreground,
                                }}
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


    function rightBar() {
        if (!safeIsMobile()) {
            return (
                <div className="w-[200px] flex flex-col items-center space-y-4 flex-shrink-0 pr-5">
                    <h1 className="text-3xl font-bold text-center pt-13 pb-6 flex items-center justify-center gap-2">
                        Select Leagues:
                        {getTooltipHTML(
                        "Choose which leagues or tournaments to include in the View Matches section (click on a league button to toggle its visibility)",
                        scheme,
                        'left'
                    )}
                    </h1>

                    {getLeagueButton("msi")}
                    {getLeagueButton("lck")}
                    {getLeagueButton("lpl")}
                    {getLeagueButton("lec")}
                    {getLeagueButton("lcp")}
                    {getLeagueButton("lta_n")}
                    {getLeagueButton("lta_s")}
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

    try {
        return (() => {
            return (
                <div
                    className="h-screen flex flex-col px-4 py-3"
                    style={{
                        backgroundColor: scheme.background,
                        color: scheme.foreground,
                        transition: "background-color 0.3s, color 0.3s",
                        overflow: "hidden",
                    }}
                >
                    <Menu isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                    <div className={dimClass(isSidebarOpen)}>
                        <div className="flex flex-1 min-h-0 justify-center gap-8 px-2">
                            {leftBar()}

                            <div
                                className="flex flex-col items-center justify-center flex-grow max-w-[90rem] overflow-hidden"
                                style={{
                                    flexGrow: 1,
                                    maxHeight: "100vh",
                                    minWidth: "640px",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <main className="w-full flex flex-col flex-1 min-h-0 items-center">
                                    {viewMatchesText()}
                                    {selectModes()}

                                    <div
                                        className="flex-1 shadow-md rounded-2xl p-6 overflow-y-auto border mb-6 w-full min-h-0 themed-scrollbar"
                                        style={{
                                            backgroundColor: scheme.background,
                                            color: scheme.foreground,
                                            borderColor: scheme.foreground,
                                            maxHeight: "calc(100vh - 100px)",
                                            paddingRight: "1rem",
                                            // @ts-ignore
                                            "--scrollbar-thumb": scheme.buttonColor,
                                            "--scrollbar-track": scheme.background,
                                            "--scrollbar-thumb-hover": scheme.foreground,
                                        }}
                                    >
                                        <div
                                            className="items-center h-full max-w-full"
                                            style={{ overflowY: "auto" }}
                                        >
                                            <div
                                                className="text-sm font-mono text-center"
                                                dangerouslySetInnerHTML={{ __html: responseText }}
                                            />
                                        </div>
                                    </div>
                                </main>
                            </div>

                            {rightBar()}
                        </div>
                    </div>
                </div>
            );
        })();
    }

    catch (e) {
        return (
            <div>
            </div>
        );
    }
}
