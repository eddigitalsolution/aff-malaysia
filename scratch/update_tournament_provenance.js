const fs = require('fs');
const path = require('path');

const playersPath = path.join(__dirname, '../data/players.json');
const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));

const provenanceMap = {
  'bergson': 'FIFA ASEAN Cup 2026',
  'brad-tapp': 'FIFA ASEAN Cup 2026',
  'manuel-hidalgo': 'FIFA ASEAN Cup 2026',
  'fergus-tierney': 'FIFA ASEAN Cup 2026',
  'hong-wan': 'FIFA ASEAN Cup 2026',
  'haziq-nadzli': 'FIFA ASEAN Cup 2026',
  'rahadiazli': 'ASEAN Hyundai Cup 2026',
  'syihan-hazmi': 'Both Tournaments (FIFA & AFF)',
  'dion-cools': 'Both Tournaments (FIFA & AFF)',
  'arif-aiman': 'Both Tournaments (FIFA & AFF)',
  'nooa-laine': 'Both Tournaments (FIFA & AFF)',
  'stuart-wilkin': 'Both Tournaments (FIFA & AFF)',
  'daniel-ting': 'Both Tournaments (FIFA & AFF)',
  'ubaidullah-shamsul-fifa': 'Both Tournaments (FIFA & AFF)',
  'harith-haikal': 'Both Tournaments (FIFA & AFF)',
  'quentin-cheng': 'Both Tournaments (FIFA & AFF)',
  'corbin-ong': 'Both Tournaments (FIFA & AFF)',
  'syahmi-safari': 'Both Tournaments (FIFA & AFF)',
  'syahir-bashah': 'Both Tournaments (FIFA & AFF)',
  'nazmi-faiz': 'Both Tournaments (FIFA & AFF)',
  'paulo-josue-fifa': 'Both Tournaments (FIFA & AFF)',
  'faisal-halim': 'Both Tournaments (FIFA & AFF)',
  'g-pavithran-fifa': 'Both Tournaments (FIFA & AFF)',
  // AFF equivalents
  'paulo-josue': 'ASEAN Hyundai Cup 2026',
  'ubaidullah-shamsul': 'ASEAN Hyundai Cup 2026',
  'g-pavithran': 'ASEAN Hyundai Cup 2026'
};

const tournamentStatsHighlight = {
  'bergson': 'FIFA ASEAN Cup: 4 Goals, 1 Assist · Hat-trick vs Singapore · Star Target Forward',
  'brad-tapp': 'FIFA ASEAN Cup: 3 Starts, 270 mins · 95% Pass Acc · 0 Goals Conceded',
  'manuel-hidalgo': 'FIFA ASEAN Cup: 3 Assists · Creator of 62m Winner vs Vietnam · 10 Duels Won',
  'fergus-tierney': 'FIFA ASEAN Cup: 1 Goal · Historic 62m Winner vs Vietnam (Bronze Medal) · 15 Duels',
  'syihan-hazmi': 'Both: 3 Clean Sheets in FIFA ASEAN Cup (100% save rate) · Veteran AFF Starter',
  'dion-cools': 'Both: National Captain · 93% Pass Acc · Aerial & tactical spine across both cups',
  'arif-aiman': 'Both: FIFA 2G 2A | AFF 4 Goals · Elite 1v1 Dribbler & Creator',
  'nooa-laine': 'Both: 360 mins (played every minute) · 89% Pass Acc · Central Pivot in both cups',
  'stuart-wilkin': 'Both: 1 Goal, 1 Assist · 10 Tackles, 24 Recoveries · Box-to-Box Threat',
  'daniel-ting': 'Both: 96% Pass Acc (49/51) vs Vietnam · 1 Assist vs Singapore · Versatile LB',
  'ubaidullah-shamsul-fifa': 'Both: 91% Pass (71/78) & 9 Duels Won vs Vietnam · Breakout Stopper',
  'harith-haikal': 'Both: 1 Assist vs Vietnam · 85% Pass Acc · Resilient Center-Back',
  'hong-wan': 'FIFA ASEAN Cup: 2 Assists · 82% Pass Acc · Deep Ball-Winning Anchor',
  'quentin-cheng': 'Both: 296 mins · 12 Tackles, 19 Recoveries · Tireless Flank Overlap',
  'corbin-ong': 'Both: 270 mins · 88% Pass Acc, 7 Tackles · Physical Left-Wing Back',
  'syahmi-safari': 'Both: Versatile Wing-Back Cover on both flanks (72 mins played)',
  'syahir-bashah': 'Both: 1 Goal vs Singapore (6-0) · 40 mins vs Vietnam · Midfield Spark',
  'nazmi-faiz': 'Both: Composed Possession Tempo & Technical Playmaking',
  'paulo-josue-fifa': 'Both: AFF 3 Goals | FIFA 1G 1A · Clutch Veteran & Set-Piece Specialist',
  'faisal-halim': 'Both: Explosive Winger · High-Tempo Pressing & Transition Threat',
  'haziq-nadzli': 'FIFA ASEAN Cup: Clean Sheet vs Bangladesh (3-0 win) · Reflex Shot-Stopper',
  'rahadiazli': 'ASEAN Hyundai Cup: High-Reach Shot-Stopper · Impressive AFF Cup Record',
  'g-pavithran-fifa': 'Both: 1 Goal in AFF Cup · 41 mins in FIFA ASEAN Cup (Bronze Medal Run)',
  'paulo-josue': 'ASEAN Hyundai Cup: 3 Goals in 6 Matches · Masterful Set-Pieces',
  'ubaidullah-shamsul': 'ASEAN Hyundai Cup: Key Defensive Contributor & FIFA Bronze Medalist',
  'g-pavithran': 'ASEAN Hyundai Cup: 1 Goal in AFF Cup · Direct Young Attacker'
};

let count = 0;
for (const p of players) {
  if (provenanceMap[p.id]) {
    p.isChinaCallUp = true;
    p.tournamentProvenance = provenanceMap[p.id];
    p.tournamentHighlight = tournamentStatsHighlight[p.id];
    count++;
  }
}

fs.writeFileSync(playersPath, JSON.stringify(players, null, 2), 'utf8');
console.log(`Successfully updated ${count} players with tournamentProvenance and tournamentHighlight!`);
