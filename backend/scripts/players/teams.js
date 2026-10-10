// How ScorePulse teams (by name, as in the `teams` table) map to Cricbuzz.
// `squad: true` sides have a maintained current-squad page on Cricbuzz; the
// rest get their squads from the players in imported matches.
export const TEAMS = [
  { name: "India", cricbuzzId: 2, squad: true, statsguru: "IND" },
  { name: "Australia", cricbuzzId: 4, squad: true, statsguru: "AUS" },
  { name: "England", cricbuzzId: 9, squad: true, statsguru: "ENG" },
  { name: "Pakistan", cricbuzzId: 3, squad: true, statsguru: "PAK" },
  { name: "South Africa", cricbuzzId: 11, squad: true, statsguru: "SA" },
  { name: "New Zealand", cricbuzzId: 13, squad: true, statsguru: "NZ" },
  { name: "Sri Lanka", cricbuzzId: 5, squad: true, statsguru: "SL" },
  { name: "West Indies", cricbuzzId: 10, squad: true, statsguru: "WI" },
  { name: "Bangladesh", cricbuzzId: 6, squad: true, statsguru: "BAN" },
  { name: "Afghanistan", cricbuzzId: 96, squad: true, statsguru: "AFG" },
  { name: "Ireland", cricbuzzId: 27, squad: true, statsguru: "IRE" },
  { name: "United Arab Emirates", cricbuzzId: 7, squad: true, statsguru: "UAE" },

  { name: "Chennai Super Kings", cricbuzzId: 58, squad: true },
  { name: "Mumbai Indians", cricbuzzId: 62, squad: true },
  { name: "Royal Challengers Bengaluru", cricbuzzId: 59, squad: true },
  { name: "Kolkata Knight Riders", cricbuzzId: 63, squad: true },
  { name: "Delhi Capitals", cricbuzzId: 61, squad: true },
  { name: "Rajasthan Royals", cricbuzzId: 64, squad: true },
  { name: "Sunrisers Hyderabad", cricbuzzId: 255, squad: true },
  { name: "Punjab Kings", cricbuzzId: 65, squad: true },
  { name: "Lucknow Super Giants", cricbuzzId: 966, squad: true },
  { name: "Gujarat Titans", cricbuzzId: 971, squad: true },

  { name: "Queensland", cricbuzzId: 164, country: "Australia" },
  { name: "Victoria", cricbuzzId: 52, country: "Australia" },
  { name: "Canterbury", cricbuzzId: 312, country: "New Zealand" },
  { name: "Northern Districts", cricbuzzId: 294, country: "New Zealand" },
  { name: "Panadura Sports Club", country: "Sri Lanka" },
  { name: "Tamil Union Cricket and Athletic Club", country: "Sri Lanka" },
  { name: "Kurunegala Youth Cricket Club", country: "Sri Lanka" },
  { name: "Nugegoda Sports Welfare Club", country: "Sri Lanka" },
  { name: "Chilaw Marians Cricket Club", country: "Sri Lanka" },
  { name: "Badureliya Sports Club", country: "Sri Lanka" },
];

// Statsguru's country codes, for telling namesakes apart.
export const STATSGURU_COUNTRY = {
  ...Object.fromEntries(TEAMS.filter((t) => t.statsguru).map((t) => [t.name, t.statsguru])),
  Zimbabwe: "ZIM",
  Netherlands: "NL",
  Scotland: "SCOT",
  Nepal: "NEPAL",
  Namibia: "NAM",
  Oman: "OMAN",
  "United States of America": "USA",
  Canada: "CAN",
};

// Franchise leagues, recognised by team name (Cricbuzz tags them only as "league").
const LEAGUES = [
  ["IPL", /^(Chennai Super Kings|Mumbai Indians|Royal Challengers Bengaluru|Royal Challengers Bangalore|Kolkata Knight Riders|Delhi Capitals|Delhi Daredevils|Rajasthan Royals|Sunrisers Hyderabad|Punjab Kings|Kings XI Punjab|Lucknow Super Giants|Gujarat Titans|Deccan Chargers|Pune Warriors|Rising Pune Supergiants?|Gujarat Lions|Kochi Tuskers Kerala)$/],
  ["BBL", /^(Adelaide Strikers|Brisbane Heat|Hobart Hurricanes|Melbourne Renegades|Melbourne Stars|Perth Scorchers|Sydney Sixers|Sydney Thunder)$/],
  ["PSL", /^(Islamabad United|Karachi Kings|Lahore Qalandars|Multan Sultans|Peshawar Zalmi|Quetta Gladiators|Hyderabad Kingsmen|Rawalpindiz)$/],
  ["CPL", /^(Barbados (Royals|Tridents)|Guyana Amazon Warriors|Jamaica Tallawahs|St Kitts and Nevis Patriots|Saint Lucia (Kings|Zouks|Stars)|St Lucia (Kings|Zouks|Stars)|Trinbago Knight Riders|Trinidad and Tobago Red Steel|Antigua (and Barbuda Falcons|Hawksbills))$/],
  ["SA20", /^(Durban'?s Super Giants|Joburg Super Kings|MI Cape Town|Paarl Royals|Pretoria Capitals|Sunrisers Eastern Cape)$/],
  ["The Hundred", /^(Birmingham Phoenix|London Spirit|Manchester (Originals|Super Giants)|Northern Superchargers|Sunrisers Leeds|Oval Invincibles|MI London|Southern Brave|Trent Rockets|Welsh Fire)$/],
  ["ILT20", /^(Abu Dhabi Knight Riders|Desert Vipers|Dubai Capitals|Gulf Giants|MI Emirates|Sharjah Warriorz?)$/],
  ["MLC", /^(Los Angeles Knight Riders|MI New York|San Francisco Unicorns|Seattle Orcas|Texas Super Kings|Washington Freedom)$/],
  ["BPL", /(Barishal|Barisal|Rangpur|Comilla|Cumilla|Sylhet|Khulna|Dhaka|Chattogram|Chittagong|Rajshahi|Noakhali)/],
  ["LPL", /(Colombo|Jaffna|Kandy|Galle|Dambulla|Hambantota|Nuwara Eliya)/],
  ["Global T20 Canada", /(Toronto Nationals|Montreal Tigers|Vancouver Knights|Brampton Wolves|Edmonton Royals|Winnipeg Hawks|Surrey Jaguars|Mississauga)/],
];

export const leagueOf = (name) => LEAGUES.find(([, re]) => re.test(name))?.[0] || null;
