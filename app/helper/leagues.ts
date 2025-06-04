import {capitalize} from "@/app/helper/util";

let leagues = ["lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "lcp"];
const allLeagues = ["lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "lcp"]; // TODO: add internation events (MSI coming up soon!)

export enum SortModes {
    status = "status",
    league = "league",
    date = "date",
    playoffs = "playoffs"
}

export let currentSortMode = SortModes.date;

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

    catch (error ) {
        // uhhhh rip, it got cooked
    }
}

export function getCurrentSortMode() {
    return currentSortMode.toString();
}

export function getSortMode() {
    return Object.values(SortModes).map(( sortMode) => {
        `<option key = { sortMode } value = { sortMode } >`
            { capitalize(sortMode) }
        `</option>`;
    })
}