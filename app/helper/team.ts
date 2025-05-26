import {getLiveMatches, getNextMatches, getPastMatches} from "@/app/api/apiGetter";

interface Team {
    name: string;
    image: string;
    abbreviation: string;
}

function formatMatch(event: any): string {
    const matchTime = new Date(event.startTime).toLocaleString("en-US", {
        minute: "2-digit",
        hour: "2-digit",
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    const teams: Team[] = event.match?.teams?.map((team: any) => ({
        name: team?.name,
        image: team?.image,
        abbreviation: team?.code || team?.abbreviation
    }));

    const league = event.league?.name;
    const matchNames = teams.map((team) => team.name).join(" vs ");

    const teamImages = teams.map(team =>
        `<div style="display:inline-block; text-align:center; margin:0 10px;">
            <img src="${ team.image }" alt="${ team.name }" width="40" height="40"/>
            <span>
                ${ team.abbreviation }
            </span>
        </div>`
    ).join('');

    return `
        <div style="margin-bottom:24px;">
            <strong>
                ${ matchNames }
            </strong>
                <br/>
                    <em>
                        ${ league }
                    </em>
                    — ${ matchTime }
                <br/>
            <div style="margin-top:8px;">
                ${ teamImages }
            </div>
        </div>
    `;
}

function getFormattedMatch(matchType: any[]) {
    if (matchType.length > 0) {
        return matchType.map(formatMatch).join("");
    }

    return `<p> 
                None 
            </p>`
}

export function getFormattedMatches() {
    let result = "";

    result += `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline;">
                    Live Matches:
               </h2>`

    result += getFormattedMatch(getLiveMatches());

    result += `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline;">
                    Next Matches:
               <h2>`

    result += getFormattedMatch(getNextMatches());

    result += `<h2 style="margin-top: 16px; font-size: 18px; font-weight: bold; text-decoration: underline;">
                    Past Matches:
               <h2>`

    result += getFormattedMatch(getPastMatches());

    return result;
}
