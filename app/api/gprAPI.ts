import * as dotenv from "dotenv";

dotenv.config();

let robotId = "097c1e1d-24ce-4217-a942-8e9cf96e1b35";
let taskId = "7a2a8581-7556-42dc-92d0-a9630af660d7"
let authorization = "Bearer 8f9c5d61-a7ef-4c96-9cbc-44f5fcf7fd0a:75395595-810d-44b2-9b7f-a1aee2d1bc32";

// yoinked w/o API
let localGpr: string[] = [
    "Gen.G Esports 1599",
    "Hanwha Life Esports 1570",
    "Bilibili Gaming 1530",
    "T1 1488",
    "Anyone's Legend 1450",
    "Top Esports 1432",
    "FlyQuest 1409",
    "KT Rolster 1397",
    "G2 Esports 1392",
    "Dplus KIA 1384",
    "Weibo Gaming 1369",
    "Karmine Corp 1368",
    "Team Flash 1368",
    "JD Gaming 1367",
    "CTBC Flying Oyster 1366",
    "Cloud9 1357",
    "MAD Lions KOI 1350",
    "Fnatic 1345",
    "Nongshim RedForce 1345",
    "Invictus Gaming 1345",
    "Team Liquid 1333",
    "GAM Esports 1332",
    "Ninjas in Pyjamas 1322",
    "Team WE 1313",
    "ThunderTalk Gaming 1294",
    "LNG Esports 1289",
    "Movistar R7 1275",
    "Team BDS 1262",
    "FunPlus Phoenix 1261",
    "LGD Gaming 1258",
    "Brion Blade 1251",
    "100 Thieves 1249",
    "Team Secret 1242",
    "DRX 1238",
    "Infinity Esports 1237",
    "Six Karma 1237",
    "Oh My God 1236",
    "Edward Gaming 1234",
    "Gentle Mates 1229",
    "Fredit BRION 1225",
    "Team Vitality 1222",
    "Team Heretics 1208",
    "paiN Gaming 1204",
    "Sengoku Gaming 1198",
    "Despegar Esports 1198",
    "Disguised 1195",
    "Royal Never Give Up 1189",
    "Ultra Prime 1180",
    "SK Gaming 1178",
    "Dignitas 1177",
    "Isurus 1175",
    "DetonatioN FocusMe 1151",
    "Rogue 1151",
    "LOUD 1147",
    "Chiefs Esports Club 1147",
    "RED Canids 1133",
    "Vivo Keyd Stars 1133",
    "FURIA Esports 1118",
    "Furious Gaming 1070",
    "Leviatán 1051"
];

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
                    'Authorization': authorization,
                    'Content-Type': 'application/json',
                },
            });

            const taskList = await taskListRes.json();
            const latestTask = taskList.result?.[0];

            taskId = latestTask.id;
        }

        const taskUrl = `https://api.browse.ai/v2/robots/${ robotId }/tasks/${ taskId }`;
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

            const match = entry.match(/\n\n([^\n]+)\n\nLCK\n\n\t(\d+)\spts/);
            if (match) {
                const team = match[1].trim();
                const pts = match[2].trim();
                return `${ team } ${ pts }`;
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