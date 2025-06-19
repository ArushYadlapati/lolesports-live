# [LoL Esports Live](https://lol.arush.me/)
Get live data for current, past, and future League of Legends pro matches.
This app was built with Next.js and TypeScript, and can be viewed at [https://lol.arush.me/](https://lol.arush.me/).

## API
The API is built from the free LoL esports API, combined with a modified one to get live, real-time data (which normally costs money that I am not spending).
Previously, I used PandaScore for the previous version of this app, but I found the free plan too limiting (so I switched to the modified one).
The main API handling is located in `app/api/lolAPI.ts`. A python version of that API can also be found there.

## Match Betting
The betting system uses an unaffiliated (I don't make commissions or anything) betting website called [bet365](https://www.bet365.com/). Specifically, it uses the [League of Legends section](https://www.co.bet365.com/#/AC/B151/C1/D50/E3/F163/) of their website.
It is a match betting website that allows you to bet with REAL MONEY on that League of Legend match.

I do NOT recommend gambling with REAL MONEY. I added this because adding my own betting system is way harder,
and I don't want to deal with a login system and a database.

## Current Features
- Get live data for current, past, and future League of Legends pro matches.
- Only Tier 1 leagues are supported (LTA North & South, LEC, LCK, LPL), as well as Internationals (First Stand, MSI, & Worlds). 
- Game win % (via Amazon GPR) for each match
- Betting link to bet365 for each match (again, for real money)
- Color scheme selectors (lots of options!)
- Filter matches by type of match (finals, playoffs, regular season)
- Sort modes for matches (by status, by date, and importance)
- League selector buttons

## Future Plans
- Add more leagues (LJL, EMEA Masters, etc.)
- Redesign the UI to be more user-friendly.
- Add more pages (make website more realistic)

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