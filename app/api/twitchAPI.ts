import * as dotenv from "dotenv";

dotenv.config();

const token = process.env.NEXT_PUBLIC_TWITCH;

// using Twitch API to show live polls (not the streams themselves) for each relevant match
// so basically we need to save the match result and from each match result we need to get the poll, and then show everything all at once
// nevermind, Twitch API can't get polls from other channels, only your own channel. So it's cooked.