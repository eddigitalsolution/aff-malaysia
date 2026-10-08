const fs = require('fs');
const path = require('path');

const playersPath = path.join(__dirname, '../data/players.json');
const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));

// The 23 best stat, impactful players who actually played and performed
const best23Ids = new Set([
  // Goalkeepers (3) - All started matches, kept clean sheets, high minutes
  'syihan-hazmi',   // 3 apps, 270 mins, 3 clean sheets, rating 7.4
  'azri-ghani',     // 6 apps, 540 mins, 83% pass acc, rating 7.31
  'haziq-nadzli',   // 1 app, 90 mins, clean sheet vs Bangladesh (3-0), rating 7.2

  // Defenders (8) - Dominant passing & defensive duels
  'dion-cools',              // 3 apps, 270 mins, 93% pass acc, rating 8.2 (Captain & MVP)
  'brad-tapp',               // 3 apps, 270 mins, 95% pass acc, rating 7.45 (0 conceded in group)
  'daniel-ting',             // 2 apps, 180 mins, 91% pass acc (96% vs Vietnam), 1 assist, rating 7.45
  'ubaidullah-shamsul-fifa', // 2 apps, 113 mins in FIFA (91% pass vs Vietnam) + 6 apps (540 mins) in AFF, rating 7.4
  'harith-haikal',           // 2 apps, 109 mins, 1 assist in 1-0 win vs Vietnam, rating 7.2
  'quentin-cheng',           // 4 apps, 296 mins, 12 tackles, 19 recoveries, rating 7.2
  'corbin-ong',              // 3 apps, 270 mins, 88% pass acc, 7 tackles, rating 7.3
  'syahmi-safari',           // 3 apps, 72 mins, 83% pass acc, versatile wing-back cover

  // Midfielders (7) - Top creative engines & high workrate
  'manuel-hidalgo', // 4 apps, 339 mins, 3 assists (tournament top creator), rating 7.45
  'nooa-laine',     // 4 apps, 360 mins (played every single minute), 89% pass acc, rating 7.65
  'stuart-wilkin',  // 4 apps, 335 mins, 1 goal, 1 assist, 10 tackles, 24 recoveries, rating 7.6
  'wan-kuzain',     // 4 apps, 141 mins, 1 goal, 1 assist, 91% pass acc, rating 7.62
  'sergio-aguero',  // 6 apps, 425 mins, 85% pass acc, 18 recoveries, rating 7.56
  'hong-wan',       // 2 apps, 85 mins, 2 assists, 82% pass acc, rating 7.3
  'syahir-bashah',  // 2 apps, 58 mins, 1 goal vs Singapore, 40 mins vs Vietnam, rating 7.2

  // Forwards (5) - High impact finishers & creators
  'bergson',        // 4 apps, 304 mins, 4 goals (hat-trick vs Singapore), 1 assist, rating 7.8
  'arif-aiman',     // 3 apps, 237 mins, 2 goals, 2 assists in FIFA + 4 goals in AFF, rating 7.8
  'paulo-josue',    // 6 apps, 518 mins, 3 goals, set-piece maestro, rating 7.51
  'fergus-tierney', // 4 apps, 169 mins, 1 goal (62' match-winner vs Vietnam), 15 duels, rating 7.25
  'g-pavithran'     // 6 apps, 540 mins, 1 goal, 2 assists, 83% pass acc, rating 7.5
]);

const rolesMap = {
  'syihan-hazmi': 'Starting GK · 3 Clean Sheets (100% Save Rate)',
  'azri-ghani': 'Goalkeeper Core · 6 Starts, 540 Mins, 18 Saves',
  'haziq-nadzli': 'Reflex Shot-Stopper · Clean Sheet vs BAN (3–0)',
  'dion-cools': 'Team Captain & MVP · 93% Pass Acc, Aerial Leader',
  'brad-tapp': 'Central Defender · 95% Pass Acc, 0 Goals Conceded',
  'daniel-ting': 'Left-Back · 96% Pass Acc vs Vietnam, 1 Assist',
  'ubaidullah-shamsul-fifa': 'Defensive Stopper · 91% Pass vs Vietnam (9 Duels Won)',
  'harith-haikal': 'Right Center-Back · 1 Assist vs Vietnam, 85% Pass Acc',
  'quentin-cheng': 'Right-Wing Back · 296 Mins, 12 Tackles, 19 Recoveries',
  'corbin-ong': 'Left-Wing Back · 270 Mins, 88% Pass Acc, 7 Tackles',
  'syahmi-safari': 'Wing-Back Utility · 83% Pass Acc across both flanks',
  'manuel-hidalgo': 'Chief Playmaker · 3 Assists (Winner Provider), 10 Duels Won',
  'nooa-laine': 'Midfield Conductor · 360 Mins (Ever-present), 89% Pass Acc',
  'stuart-wilkin': 'Box-to-Box Threat · 1 Goal, 1 Assist, 10 Tackles',
  'wan-kuzain': 'Dynamic Playmaker · 1 Goal, 1 Assist, 91% Pass Acc',
  'sergio-aguero': 'Midfield Engine · 6 Starts, 425 Mins, 85% Pass Acc',
  'hong-wan': 'Ball-Winning Pivot · 2 Assists, 82% Pass Acc',
  'syahir-bashah': 'Attacking Spark · 1 Goal vs SGP, 40 Mins vs Vietnam',
  'bergson': 'Main Striker · 4 Goals (Hat-trick vs SGP), 1 Assist',
  'arif-aiman': 'Star Winger · 2G 2A in FIFA & 4 Goals in AFF, Elite 1v1',
  'paulo-josue': 'Veteran Striker · 3 Goals, 518 Mins, Set-Piece Master',
  'fergus-tierney': 'Pressing Forward · 62m Match-Winner vs Vietnam (Bronze Medal)',
  'g-pavithran': 'Inside Forward · 1 Goal, 2 Assists, 540 Mins'
};

const provenanceMap = {
  'syihan-hazmi': 'Both Tournaments (FIFA & AFF)',
  'azri-ghani': 'ASEAN Hyundai Cup 2026',
  'haziq-nadzli': 'FIFA ASEAN Cup 2026',
  'dion-cools': 'Both Tournaments (FIFA & AFF)',
  'brad-tapp': 'FIFA ASEAN Cup 2026',
  'daniel-ting': 'Both Tournaments (FIFA & AFF)',
  'ubaidullah-shamsul-fifa': 'Both Tournaments (FIFA & AFF)',
  'harith-haikal': 'Both Tournaments (FIFA & AFF)',
  'quentin-cheng': 'Both Tournaments (FIFA & AFF)',
  'corbin-ong': 'Both Tournaments (FIFA & AFF)',
  'syahmi-safari': 'Both Tournaments (FIFA & AFF)',
  'manuel-hidalgo': 'FIFA ASEAN Cup 2026',
  'nooa-laine': 'Both Tournaments (FIFA & AFF)',
  'stuart-wilkin': 'Both Tournaments (FIFA & AFF)',
  'wan-kuzain': 'ASEAN Hyundai Cup 2026',
  'sergio-aguero': 'ASEAN Hyundai Cup 2026',
  'hong-wan': 'FIFA ASEAN Cup 2026',
  'syahir-bashah': 'Both Tournaments (FIFA & AFF)',
  'bergson': 'FIFA ASEAN Cup 2026',
  'arif-aiman': 'Both Tournaments (FIFA & AFF)',
  'paulo-josue': 'ASEAN Hyundai Cup 2026',
  'fergus-tierney': 'FIFA ASEAN Cup 2026',
  'g-pavithran': 'ASEAN Hyundai Cup 2026'
};

const highlightsMap = {
  'syihan-hazmi': 'FIFA ASEAN Cup: 3 Starts, 270 mins, 3 Clean Sheets (100% save rate) · Clean sheets in all matches',
  'azri-ghani': 'ASEAN Hyundai Cup: 6 Starts, 540 mins, 18 Saves, 83% Pass Acc · Starting Goalkeeper core',
  'haziq-nadzli': 'FIFA ASEAN Cup: 1 Start, 90 mins, Clean Sheet vs Bangladesh (3–0 win) · Dependable shot-stopping',
  'dion-cools': 'Both: 3 Starts, 270 mins, 93% Pass Acc, Rating 8.2 · Team Captain & Player of the Tournament spine',
  'brad-tapp': 'FIFA ASEAN Cup: 3 Starts, 270 mins, 95% Pass Acc · 0 Goals Conceded during entire group stage',
  'daniel-ting': 'Both: 2 Starts, 180 mins, 96% Pass Acc (49/51) vs Vietnam, 1 Assist vs Singapore · Flawless LB',
  'ubaidullah-shamsul-fifa': 'Both: 540 mins in AFF (92% pass acc) + 91% pass & 9 duels won in Bronze playoff vs Vietnam',
  'harith-haikal': 'Both: 109 mins, 1 Assist vs Vietnam in 1-0 win, 85% Pass Acc · Aerial & ground duel reliability',
  'quentin-cheng': 'Both: 4 Starts, 296 mins, 12 Tackles, 19 Recoveries · Tireless right-wing high-intensity overlap',
  'corbin-ong': 'Both: 3 Starts, 270 mins, 88% Pass Acc, 7 Tackles · Dominant physical presence on left flank',
  'syahmi-safari': 'Both: 3 Appearances, 72 mins, 83% Pass Acc · Tactical versatility across both fullback roles',
  'manuel-hidalgo': 'FIFA ASEAN Cup: 4 Starts, 339 mins, 3 Assists (Tournament leader), 10 duels won · Created Vietnam winner',
  'nooa-laine': 'Both: 4 Starts, 360 mins (played every single minute), 89% Pass Acc · Unrivalled midfield control',
  'stuart-wilkin': 'Both: 4 Starts, 335 mins, 1 Goal, 1 Assist, 10 Tackles, 24 Recoveries · Complete box-to-box engine',
  'wan-kuzain': 'ASEAN Hyundai Cup: 4 Apps, 141 mins, 1 Goal, 1 Assist, 91% Pass Acc, Rating 7.62 · Progressive maestro',
  'sergio-aguero': 'ASEAN Hyundai Cup: 6 Starts, 425 mins, 85% Pass Acc, 18 Recoveries, Rating 7.56 · Elite midfield workrate',
  'hong-wan': 'FIFA ASEAN Cup: 2 Appearances, 85 mins, 2 Assists, 82% Pass Acc · Deep ball-winning defensive pivot',
  'syahir-bashah': 'Both: 2 Appearances, 58 mins, 1 Goal vs Singapore (6–0), 40 mins vs Vietnam · High-tempo spark',
  'bergson': 'FIFA ASEAN Cup: 4 Starts, 304 mins, 4 Goals (Hat-trick vs Singapore), 1 Assist · Clinical target forward',
  'arif-aiman': 'Both: 2 Goals, 2 Assists in FIFA + 4 Goals in AFF · Elite 1v1 dribbler and creative threat',
  'paulo-josue': 'ASEAN Hyundai Cup: 6 Starts, 518 mins, 3 Goals, 8 set-piece deliveries · Clutch second striker',
  'fergus-tierney': 'FIFA ASEAN Cup: 4 Apps, 169 mins, 1 Goal (Historic 62m winner vs Vietnam), 15 Duels · Impact forward',
  'g-pavithran': 'ASEAN Hyundai Cup: 6 Starts, 540 mins, 1 Goal, 2 Assists, 83% Pass Acc, Rating 7.50 · Dynamic inside forward'
};

let markedCount = 0;
for (const p of players) {
  if (best23Ids.has(p.id)) {
    p.isChinaCallUp = true;
    p.callUpRole = rolesMap[p.id];
    p.tournamentProvenance = provenanceMap[p.id];
    p.tournamentHighlight = highlightsMap[p.id];
    markedCount++;
  } else {
    p.isChinaCallUp = false;
    delete p.callUpRole;
    delete p.tournamentProvenance;
    delete p.tournamentHighlight;
  }
}

fs.writeFileSync(playersPath, JSON.stringify(players, null, 2), 'utf8');
console.log(`Successfully updated players.json! Tagged exactly ${markedCount} players as isChinaCallUp.`);
