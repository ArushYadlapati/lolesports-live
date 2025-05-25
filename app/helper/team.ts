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
            <strong>${ matchNames }</strong>
            <br/>
            <em>${ league }</em> — ${ matchTime }
            <br/>
            <div style="margin-top:8px;">
                ${ teamImages }
            </div>
        </div>
    `;
}

export function getFormattedMatches() {
    return `<h2 style="margin-top: 16px;">Live Matches</h2>` +
        (getLiveMatches().length > 0 ? getLiveMatches().map(formatMatch).join('') : "<p>None</p>")
       + `<h2 style="margin-top: 16px;">Next Matches</h2>` +
        (getNextMatches().length > 0 ? getNextMatches().map(formatMatch).join('') : "<p>None</p>")
       + `<h2 style="margin-top: 16px;">Past Matches</h2>` +
        (getPastMatches().length > 0 ? getPastMatches().map(formatMatch).join('') : "<p>None</p>")
    ;
}
