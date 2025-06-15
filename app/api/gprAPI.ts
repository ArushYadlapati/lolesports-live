import * as dotenv from "dotenv";

dotenv.config();

let robotId = process.env.NEXT_PUBLIC_ROBOT_ID || "";
let taskId = "3f486765-9250-4306-8498-9fa1ded7dd10";
let authorization = process.env.NEXT_PUBLIC_BROWSE_AUTH || "";

if (!robotId || !authorization) {
    
}

export async function getTask() {
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

        const data = await response.json();

        const rawTexts = Object.values(data?.result?.capturedTexts ?? {}) as unknown[];

        const textEntries = rawTexts.map(obj => {
            if (typeof obj === "object" && obj !== null) {
                return Object.values(obj)[0];
            }
            return "";
        });

        return textEntries
            .map(entry => {
                if (typeof entry !== "string") return null;

                const match = entry.match(/\n\n(.+?)\n\n[\s\S]*?\n\n\t(\d+ pts)/);
                if (match && match.length >= 3) {
                    const team = match[1].trim();
                    const pts = match[2].trim();
                    return {team, pts};
                }
                return null;
            })
            .filter(Boolean) as { team: string; pts: string }[];

    } catch (error) {

        return [];
    }
}
