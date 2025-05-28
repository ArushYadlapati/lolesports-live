# [LoL Esports Live](https://lol.arush.me/)
Get live data for current, past, and future League of Legends pro matches. 
It uses Twitch API (coming soon) to detect current polls related to those LoL pro matches, allowing you to bet points where it counts.  
This app was built with Next.js and TypeScript, and can be viewed at [https://lol.arush.me/](https://lol.arush.me/).

## API
The API is built from the free LoL esports API, combined with a modified one to get live, real-time data (which normally costs money that I am not spending).
Previously, I used PandaScore for the previous version of this app, but I found the free plan too limiting (so I switched to the modified one).
The main API handling is located in `app/api/lolAPI.ts`. A python version of that API can also be found there.
Additionally, the twitch API handling is located in `app/api/twitchAPI.ts`, and gets the relevant polls.

## Current Features
- Get live data for current, past, and future League of Legends pro matches.
- Only Tier 1 leagues are supported (LTA North & South, LEC, LCK, LPL).
    - The API is old, so LTAN is actually LCS still, and LTA South is actually CBLOL + LLA.

## Future Plans
- Add Twitch API to get current polls for live LoL matches.
- Redesign the UI to be more user-friendly (because right now it's just 1 giant text box).
- Add league selector (shows highlighted leagues, and then you can select or unselect what leagues you want to see).
    - Currently, it shows all leagues by default, but this will be customizable.
- Show the next 3 matches for each league by default, but have this number be customizable
  - Currently only shows next 1 match for each league.
- Add login system to allow users to save their settings (like league selector, color scheme, etc.)
    - Login will be done via Twitch (I still need to figure out how to do this.)
- Get data automatically (auto-refresh every 10 minutes or so to prevent killing the API rates)

## Running Locally

First, run `npm install` in the project root. 
Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.