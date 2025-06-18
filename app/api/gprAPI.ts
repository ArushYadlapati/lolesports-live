import * as dotenv from "dotenv";
import {getLeagues, leagueMap} from "@/app/helper/leagues";

dotenv.config();


// TODO: use webhook to get latest taskId
let taskId: string = "c9f453f5-e9a4-4f60-93f0-c359d53db332"

// TODO: fix env vars
let robotId: string = "3c9525d6-d42b-4137-b15a-9cf46a7e7d80";
let authorization: string = "Bearer 8f9c5d61-a7ef-4c96-9cbc-44f5fcf7fd0a:75395595-810d-44b2-9b7f-a1aee2d1bc32";

// export let gpr = await getGPR();
export let gpr = await getGPR();

if (!robotId || !authorization) {

}

export async function getGPR() {
    try {
        if (!taskId) {
            const taskListUrl = `https://api.browse.ai/v2/robots/${ robotId }/tasks`;

            const taskListRes = await fetch(taskListUrl, {
                headers: {
                    "Authorization": authorization,
                    "Content-Type": "application/json",
                },
            });

            let taskList = await taskListRes.json();
            if (taskList.results.length === 0) {
                try {
                    taskList = await taskListRes.json();
                } catch (error) {
                    return [];
                }
                return taskList;
            }

            const latestTask = taskList.result?.[0];

            taskId = latestTask.id;
        }

        const taskUrl = `https://api.browse.ai/v2/robots/${ robotId }/tasks/${ taskId }`;
        const response = await fetch(taskUrl, {
            method: "GET",
            headers: {
                "Authorization": authorization,
                "Content-Type": "application/json",
            },
        });

        let task = (await response.json()).result.capturedTexts;

        const leaguePattern = Object.values(leagueMap).join("|");

        const formatted = Object.values(task).map(entry => {
            if (typeof entry !== "string") {
                return null;
            }

            const match = entry.match(
                new RegExp(`\\n\\n([^\\n]+)\\n\\n(${ leaguePattern })\\n\\n\\t(\\d+)\\spts`)

            );
            if (match) {
                const team = match[1].trim();
                const league = match[2].trim();
                const pts = match[3].trim();
                return `${ team }|||${ pts }`;
            }

            return null;
        }).filter(Boolean);

        return formatted.reverse();

    } catch (error) {

        return [];
    }
}

export async function updateGPR() {
    gpr = await getGPR();
}