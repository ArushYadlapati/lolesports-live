import {capitalize} from "@/app/helper/util";

let leagues = ["lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "lcp"];
const allLeagues = ["lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "lcp"]; // TODO: add internation events (MSI coming up soon!)

export enum SortModes {
    status = "status",
    importance = "importance",
    date = "date",
}

export enum FilterModes {
    none = "None",
    playoffs = "Playoffs",
    regional = "Regional Qualifier",
    finals = "Finals",
    week = "Regular Season"
}

export let currentSortMode = SortModes.date;
export let currentFilterMode = FilterModes.none;

export function getLeagues() {
    return leagues;
}

export function ltaCrossExists() {
    if (leagues.includes("lta_n") && leagues.includes("lta_s")) {
        addLeagues("lta_cross");
    } else {
        removeLeagues("lta_cross");
    }
}

export function hasLeague(league: string) {
    return (leagues.includes(league));
}

export function changeLeagues(league : string) {
    if (hasLeague(league)) {
        removeLeagues(league);
    } else {
        addLeagues(league);
    }
}

function addLeagues(league: string) {
    if (!leagues.includes(league) && allLeagues.includes(league)) {
        leagues.splice(allLeagues.indexOf(league), 0, league)
    }

    leagues.sort((league1, league2) => allLeagues.indexOf(league1) - allLeagues.indexOf(league2))
}

function removeLeagues(league: string) {
    if (leagues.includes(league)) {
        leagues = leagues.filter((l) => l !== league);
    }
}

export function setSortMode(newSortMode : string) {
    try {
        if (Object.values(SortModes).includes(newSortMode as SortModes)) {
            currentSortMode = newSortMode as SortModes;
        }
    }

    catch (e) {
        // uhhhh rip, it got cooked
    }
}

export function setFilterMode(newFilterMode : string) {
    try {
        if (Object.values(FilterModes).includes(newFilterMode as FilterModes)) {
            currentFilterMode = newFilterMode as FilterModes
        }
    } catch (e) {
        // uhhhh rip, it got cooked
    }
}

export function filterMatch(match : any) : boolean {
    let blockName = match.blockName;
    let filterMode = getCurrentFilterMode();

    if (getCurrentFilterMode() === FilterModes.none) {
        return true;
    } else if (getCurrentFilterMode() === FilterModes.week) {
        blockName = blockName.toLowerCase().split(" ")[0];
        filterMode = "week";
        console.log(blockName, getCurrentFilterMode());
    }

    return blockName === filterMode;
}

export function getCurrentSortMode() {
    return currentSortMode.toString();
}

export function getCurrentFilterMode() {
    return currentFilterMode.toString();
}

export function getCurrentFilterKey() : string {
    // returns the key in the currentFilterMode of FilterModes
    const key = Object.entries(FilterModes).find(([key, value]) => value === currentFilterMode);
    if (key) {
        return key[0];
    }
    return "None"
}

export function getSortMode() {
    return Object.values(SortModes).map((sortMode) => {
        `<option key = { sortMode } value = { sortMode } >`
            { capitalize(sortMode) }
        `</option>`;
    })
}

export function getFilterMode() {
    return Object.values(FilterModes).map((filterMode) => {
        `<option key = { filterMode } value = { filterMode } >`
        { capitalize(filterMode) }
        `</option>`;
    })
}