let leagues = ["lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "pcs"];
const allLeagues = ["lck", "lpl", "lec", "lta_n", "lta_s", "lta_cross", "pcs"];

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