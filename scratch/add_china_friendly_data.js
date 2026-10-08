const fs = require('fs');
const path = require('path');

// 1. Update teams.json
const teamsPath = path.join(__dirname, '../data/teams.json');
const teams = JSON.parse(fs.readFileSync(teamsPath, 'utf8'));
if (!teams.find(t => t.id === 'china')) {
  teams.push({
    id: "china",
    name: "China PR",
    code: "CHN",
    group: "Friendly",
    flag: "🇨🇳",
    coach: "Branko Ivanković",
    captain: "Wu Xi",
    fifaRanking: 88,
    ratings: {
      attack: 74,
      midfield: 73,
      defense: 75
    },
    averageAge: 28.4,
    squadValue: "€12.5M",
    formation: "4-4-2",
    recentForm: ["W", "D", "L", "W", "D"]
  });
  fs.writeFileSync(teamsPath, JSON.stringify(teams, null, 2), 'utf8');
  console.log('Added China PR to teams.json');
}

// 2. Update venues.json
const venuesPath = path.join(__dirname, '../data/venues.json');
const venues = JSON.parse(fs.readFileSync(venuesPath, 'utf8'));
if (!venues.find(v => v.id === 'stadium-tianhe-guangzhou')) {
  venues.push({
    id: "stadium-tianhe-guangzhou",
    name: "Tianhe Stadium",
    city: "Guangzhou",
    country: "China",
    capacity: 54856,
    image: "/venues/tianhe.png"
  });
  fs.writeFileSync(venuesPath, JSON.stringify(venues, null, 2), 'utf8');
  console.log('Added Tianhe Stadium to venues.json');
}

// 3. Update fixtures.json
const fixturesPath = path.join(__dirname, '../data/fixtures.json');
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));
if (!fixtures.find(f => f.id === 'friendly-chn-mys-01')) {
  fixtures.push({
    id: "friendly-chn-mys-01",
    tournamentId: "tier1-friendly-2026",
    stage: "Tier 1 International Friendly · Match 1",
    matchday: 1,
    group: null,
    homeTeamId: "china",
    awayTeamId: "malaysia",
    homeScore: 0,
    awayScore: 0,
    date: "2026-11-14",
    time: "19:35",
    status: "UPCOMING",
    venueId: "stadium-tianhe-guangzhou",
    referee: "To be appointed (AFC / FIFA)",
    weather: "21°C, Clear"
  });
}
if (!fixtures.find(f => f.id === 'friendly-chn-mys-02')) {
  fixtures.push({
    id: "friendly-chn-mys-02",
    tournamentId: "tier1-friendly-2026",
    stage: "Tier 1 International Friendly · Match 2",
    matchday: 2,
    group: null,
    homeTeamId: "china",
    awayTeamId: "malaysia",
    homeScore: 0,
    awayScore: 0,
    date: "2026-11-17",
    time: "19:35",
    status: "UPCOMING",
    venueId: "stadium-tianhe-guangzhou",
    referee: "To be appointed (AFC / FIFA)",
    weather: "20°C, Clear"
  });
}
fs.writeFileSync(fixturesPath, JSON.stringify(fixtures, null, 2), 'utf8');
console.log('Added China friendly fixtures to fixtures.json');

// 4. Update players.json with isChinaCallUp
const playersPath = path.join(__dirname, '../data/players.json');
const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));

const squad23Ids = new Set([
  // Goalkeepers (3)
  'syihan-hazmi',
  'haziq-nadzli',
  'rahadiazli',
  // Defenders (8)
  'dion-cools',
  'brad-tapp',
  'harith-haikal',
  'ubaidullah-shamsul-fifa',
  'daniel-ting',
  'corbin-ong',
  'quentin-cheng',
  'syahmi-safari',
  // Midfielders (7)
  'nooa-laine',
  'stuart-wilkin',
  'manuel-hidalgo',
  'hong-wan',
  'syahir-bashah',
  'nazmi-faiz',
  'paulo-josue-fifa',
  // Forwards (5)
  'bergson',
  'arif-aiman',
  'fergus-tierney',
  'faisal-halim',
  'g-pavithran-fifa'
]);

let markedCount = 0;
for (const p of players) {
  if (squad23Ids.has(p.id)) {
    p.isChinaCallUp = true;
    p.callUpRole = getRole(p.id);
    markedCount++;
  } else {
    p.isChinaCallUp = false;
  }
}

function getRole(id) {
  const roles = {
    'syihan-hazmi': 'Starting Goalkeeper (Clean Sheet Hero)',
    'haziq-nadzli': 'Backup Goalkeeper (Shot-Stopper)',
    'rahadiazli': 'Third Goalkeeper (High-Reach Shot Stopper)',
    'dion-cools': 'Team Captain & Core Ball-Playing CB',
    'brad-tapp': 'Central Defender (95% Pass Acc)',
    'harith-haikal': 'Right Center-Back / Assist Provider',
    'ubaidullah-shamsul-fifa': 'Defensive Stopper (91% Pass vs Vietnam)',
    'daniel-ting': 'Versatile Left-Back (96% Pass Acc)',
    'corbin-ong': 'Left-Wing Back / Defensive Powerhouse',
    'quentin-cheng': 'Right-Wing Back / Overlapping Engine',
    'syahmi-safari': 'Versatile Full-Back Cover',
    'nooa-laine': 'Central Midfield Conductor (360 mins)',
    'stuart-wilkin': 'Box-to-Box Midfielder (Goal Threat)',
    'manuel-hidalgo': 'Chief Playmaker (3 Assists)',
    'hong-wan': 'Deep Defensive Pivot (2 Assists)',
    'syahir-bashah': 'Attacking Midfield Spark',
    'nazmi-faiz': 'Possession & Tempo Controller',
    'paulo-josue-fifa': 'Set-Piece Specialist & Clutch Sub',
    'bergson': 'Main Striker (4 Tournament Goals)',
    'arif-aiman': 'Star Winger / 1v1 Dribbler (2G 2A)',
    'fergus-tierney': 'High-Press Striker (Vietnam Match-Winner)',
    'faisal-halim': 'Explosive Inside Forward',
    'g-pavithran-fifa': 'Pacey Youth Forward'
  };
  return roles[id] || 'Squad Member';
}

fs.writeFileSync(playersPath, JSON.stringify(players, null, 2), 'utf8');
console.log(`Marked ${markedCount} players as isChinaCallUp in players.json`);
