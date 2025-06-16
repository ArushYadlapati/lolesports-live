import * as dotenv from "dotenv";

dotenv.config();

let robotId = "097c1e1d-24ce-4217-a942-8e9cf96e1b35";
let taskId = "e671f903-4468-4346-b023-dd874b26f1e1"
let authorization = "Bearer 8f9c5d61-a7ef-4c96-9cbc-44f5fcf7fd0a:75395595-810d-44b2-9b7f-a1aee2d1bc32";

export let gpr = await getGPR();

if (!robotId || !authorization) {
    
}

export async function getGPR() {
    try {
        if (!taskId) {
            const taskListUrl = `https://api.browse.ai/v2/robots/${ robotId }/tasks`;

            const taskListRes = await fetch(taskListUrl, {
                headers: {
                    'Authorization TEST': authorization,
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