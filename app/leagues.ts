let leagues = ["lck", "lpl", "lec", "lcs", "cblol-brazil", "lla"];

export function getLeagues() {
    return leagues;
}

export function removeLeagues(leagues: []) {
    for (const league of leagues) {
        const index = leagues.indexOf(league);
        if (index > -1) {
            leagues.splice(index, 1);
        }
    }
}