// Flags and crests for ScorePulse teams, keyed by team name.
//   International / state sides: Cricbuzz's flag images
//   IPL franchises: the official iplt20.com logos, served by the frontend from
//   public/logos/ipl (iplt20.com refuses some hotlinked requests)
import { imageUrl } from "./cricbuzz.js";

const CRICBUZZ_IMAGES = {
  India: 776162,
  Australia: 776202,
  England: 776237,
  Pakistan: 776308,
  "South Africa": 776287,
  "New Zealand": 776333,
  "Sri Lanka": 776254,
  "West Indies": 776191,
  Bangladesh: 776210,
  Afghanistan: 776177,
  Ireland: 839366,
  "United Arab Emirates": 776242,
  Zimbabwe: 776198,
  Queensland: 172233,
  Victoria: 172153,
};

const IPL_CODES = {
  "Chennai Super Kings": "CSK",
  "Mumbai Indians": "MI",
  "Royal Challengers Bengaluru": "RCB",
  "Kolkata Knight Riders": "KKR",
  "Delhi Capitals": "DC",
  "Rajasthan Royals": "RR",
  "Sunrisers Hyderabad": "SRH",
  "Punjab Kings": "PBKS",
  "Lucknow Super Giants": "LSG",
  "Gujarat Titans": "GT",
};

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const logoFor = (name) => {
  if (IPL_CODES[name]) return `/logos/ipl/${IPL_CODES[name]}.png`;
  if (CRICBUZZ_IMAGES[name]) return imageUrl(CRICBUZZ_IMAGES[name], slug(name), "144x108");
  return null;
};
