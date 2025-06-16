import * as dotenv from "dotenv";

dotenv.config();

let robotId = process.env.ROBOT_ID || "";
let taskId = "3f486765-9250-4306-8498-9fa1ded7dd10";
let authorization = process.env.BROWSE_AUTH || "";

export let gpr = await getGPR();

if (!robotId || !authorization) {
    
}

export async function getGPR() {
    try {
        if (!taskId) {
            const taskListUrl = `https://api.browse.ai/v2/robots/${robotId}/tasks`;

            const taskListRes = await fetch(taskListUrl, {
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json',
                },
            });

            const taskList = await taskListRes.json();
            const latestTask = taskList.result?.[0];


            taskId = latestTask.id;
        }

        const taskUrl = `https://api.browse.ai/v2/robots/${robotId}/tasks/${taskId}`;
        const response = await fetch(taskUrl, {
            method: 'GET',
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json',
            },
        });

        let task = (await response.json()).result.capturedTexts;

        const formatted = Object.values(task).map(entry => {
            if (typeof entry !== "string") return null;

            // Match pattern: [team name] followed by \n\nLCK\n\n and then \t[pts] pts
            const match = entry.match(/\n\n([^\n]+)\n\nLCK\n\n\t(\d+)\spts/);
            if (match) {
                const team = match[1].trim();
                const pts = match[2].trim();
                return `${team} ${pts}`;
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