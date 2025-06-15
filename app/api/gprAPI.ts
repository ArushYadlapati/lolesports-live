import * as dotenv from "dotenv";

dotenv.config();

let robotId = process.env.NEXT_PUBLIC_ROBOT_ID;
let authorization = "Bearer 8f9c5d61-a7ef-4c96-9cbc-44f5fcf7fd0a:75395595-810d-44b2-9b7f-a1aee2d1bc32";

if (!robotId) {
    robotId = "";
}
if (!authorization) {
    authorization = "";
}

export async function getTask() {
    if (!robotId || !authorization) {
        throw new Error("Missing robotId or authorization.");
    }
    
    const taskListUrl = `https://api.browse.ai/v2/robots/${robotId}/tasks`;
    const taskListRes = await fetch(taskListUrl, {
        headers: {
            Authorization: authorization,
            'Content-Type': 'application/json',
        },
    });

    if (!taskListRes.ok) {
        throw new Error(`Failed to list tasks: ${await taskListRes.text()}`);
    }

    const taskList = await taskListRes.json();
    const latestTask = taskList.result?.[0];

    if (!latestTask) {
        throw new Error("No tasks found.");
    }

    const taskId = latestTask.id;

    const taskUrl = `https://api.browse.ai/v2/robots/${robotId}/tasks/${taskId}`;
    const taskRes = await fetch(taskUrl, {
        headers: {
            Authorization: authorization,
            'Content-Type': 'application/json',
        },
    });

    if (!taskRes.ok) {
        throw new Error(`Failed to get task: ${await taskRes.text()}`);
    }

    return await taskRes.json();
}