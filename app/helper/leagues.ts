// Controls what leagues are shown on website (and also their sort order as a result of this)
// let leagues = ["lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "lcp"];
let leagues = ["msi", "lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "lcp"];
// const allLeagues = ["lck", "lpl", "lec", "lta_n", "lta_s" "lta_cross", "lcp"];
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

/**
 * Getter method for leagues
 * @return { string[] } - leagues that are currently selected that we want to show
 */
export function getLeagues(): string[] {
    return leagues;
}

/**
 * This is an interesting method. Basically, I was too lazy to have LTA Cross Conference (which is LTA North + LTA South) to be a separate league,
 * so I made it so that the LTA Cross Conference only shows up if both LTA North AND LTA South are selected.
 * Basically, this method checks whether the LTA Cross Conference should exist based off the currently-selected leagues.
 *
 * @return { void } Nothing, because it updates the leagues array directly.
 */
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

/* Old Methods (I might use them later, so I shoved them at the bottom for now):
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

*/