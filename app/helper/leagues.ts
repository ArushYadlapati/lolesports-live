/**
 * Controls Leagues and matches shown
 * Filters only show matches that fit a certain selectable criteria
 * Sort modes sort the matches by a certain mode
 */
let leagues = ["msi", "lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "lcp"];
const allLeagues = ["msi", "lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "lcp"];

export const leagueNameMap: { [key: string]: string } = {
    lck: "LCK",
    lpl: "LPL",
    lec: "LEC",
    lta_n: "LTA North",
    lta_s: "LTA South",
    lta_cross: "LTA Cross",
    lcp: "LCP",
};

// SortModes: Sort (does not hide) the matches by a certain mode
export enum SortModes {
    status = "status",
    importance = "importance",
    date = "date",
}

// FilterModes: Filter (hides) matches that do not fix a certain criteria
export enum FilterModes {
    none = "None",
    playoffs = "Playoffs",
    regional = "Regional Qualifier",
    finals = "Finals",
    week = "Regular Season"
}

export let currentSortMode = SortModes.status;
export let currentFilterMode = FilterModes.none;

export function getLeagues(): string[] {
    return leagues;
}

export function ltaCrossExists(): void {
    if (leagues.includes("lta_n") && leagues.includes("lta_s")) {
        addLeagues("lta_cross");
    } else {
        removeLeagues("lta_cross");
    }
}

export function hasLeague(league: string) {
    return (leagues.includes(league));
}

export function changeLeagues(league: string) {
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

export function setSortMode(newSortMode: string) {
    try {
        if (Object.values(SortModes).includes(newSortMode as SortModes)) {
            currentSortMode = newSortMode as SortModes;
        }
    } catch (e) {
        // uhhhh rip, it got cooked
    }
}

export function setFilterMode(newFilterMode: string) {
    try {
        if (Object.values(FilterModes).includes(newFilterMode as FilterModes)) {
            currentFilterMode = newFilterMode as FilterModes
        }
    } catch (e) {
        // uhhhh rip, it got cooked
    }
}

export function filterMatch(match: any) : boolean {
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

