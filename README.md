# LoL Esports Live
Get live data for current, past, and future League of Legends pro matches. 
It uses Twitch API (coming soon) to detect current polls related to those LoL pro matches, allowing you to bet points where it counts.  
This app was built with Next.js and TypeScript.

## API
The API is built from the free LoL esports API, combined with a modified one to get live, real-time data (which normally costs money that I am not spending).
Previously, I used PandaScore for the previous version of this app, but I found the free plan too limiting (so I switched to the modified one).

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
The API handling is located in `app/api.ts`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.