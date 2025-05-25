let leagues = ["lck", "lpl", "lec", "lcs", "cblol-brazil", "lla"];
const allLeagues = ["lck", "lpl", "lec", "lcs", "cblol-brazil", "lla"];

export function getLeagues() {
    return leagues;
}

export function addLeagues(leagues: []) {
    for (const league of leagues) {
        if (!leagues.includes(league) && allLeagues.includes(league)) {
            leagues.push(league);
        }
    }
}

export function removeLeagues(leagues: []) {
    for (const league of leagues) {
        const index = leagues.indexOf(league);
        if (index > -1) {
            leagues.splice(index, 1);
        }
    }
}