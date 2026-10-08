const fs = require('fs');
const path = require('path');

// 1. Update data/players.json
const playersPath = path.join(__dirname, '../data/players.json');
const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));

// Updates map for players who played in Vietnam match (match-fac-13 on 05 Oct 2026)
const fifaUpdates = {
  'fergus-tierney': {
    appearances: 4,
    minutes: 169, // 129 + 40
    goals: 1, // ⚽ 62' winner
    shots: 5, // 3 + 2
    expectedGoals: 0.90,
    tackles: 6,
    recoveries: 9,
    averageRating: 7.25,
    addStrength: "Clutch 62' match-winner vs Vietnam (Bronze Medal 🥉)"
  },
  'manuel-hidalgo': {
    appearances: 4,
    minutes: 339, // 250 + 89
    assists: 3, // 1 + 2 assists vs Vietnam
    passingAccuracy: 86,
    tackles: 7,
    recoveries: 18,
    averageRating: 7.45,
    addStrength: "Masterful playmaking vs Vietnam (2 assists, 6 duels won)"
  },
  'bergson': {
    appearances: 4,
    minutes: 304, // 242 + 62
    shots: 16,
    passingAccuracy: 78,
    recoveries: 8,
    averageRating: 7.8
  },
  'daniel-ting': {
    appearances: 2,
    minutes: 180, // 90 + 90
    passingAccuracy: 91, // 49/51 (96%) vs Vietnam
    tackles: 6,
    interceptions: 4,
    recoveries: 12,
    averageRating: 7.45,
    addStrength: "96% passing accuracy (49/51) vs Vietnam"
  },
  'ubaidullah-shamsul-fifa': {
    appearances: 2,
    minutes: 113, // 23 + 90
    passingAccuracy: 88, // 71/78 (91%) vs Vietnam
    tackles: 4,
    interceptions: 3,
    recoveries: 11,
    averageRating: 7.4,
    addStrength: "Defensive colossus vs Vietnam: 71/78 passes (91%) & 9 duels won"
  },
  'harith-haikal': {
    appearances: 2,
    minutes: 109, // 29 + 80
    assists: 1, // 1 assist vs Vietnam
    passingAccuracy: 82, // 45/53 (85%) vs Vietnam
    tackles: 4,
    interceptions: 3,
    recoveries: 9,
    averageRating: 7.2,
    addStrength: "Assist and 85% passing accuracy in bronze medal win"
  },
  'hong-wan': {
    appearances: 2,
    minutes: 85, // 23 + 62
    assists: 2, // 1 + 1 assist vs Vietnam
    passingAccuracy: 82, // 37/44 (84%) vs Vietnam
    tackles: 4,
    interceptions: 4,
    recoveries: 8,
    averageRating: 7.3
  },
  'nooa-laine': {
    appearances: 4,
    minutes: 360, // 270 + 90 (all minutes)
    passingAccuracy: 89, // 58/68 (85%) vs Vietnam
    tackles: 8,
    recoveries: 25,
    averageRating: 7.65
  },
  'stuart-wilkin': {
    appearances: 4,
    minutes: 335, // 245 + 90
    passingAccuracy: 88, // 22/27 (81%) vs Vietnam
    tackles: 9,
    recoveries: 24,
    averageRating: 7.6
  },
  'corbin-ong': {
    appearances: 3,
    minutes: 270, // 180 + 90
    passingAccuracy: 88, // 31/38 (82%) vs Vietnam
    tackles: 7,
    recoveries: 16,
    averageRating: 7.3
  },
  'syihan-hazmi': {
    appearances: 3,
    minutes: 270, // 180 + 90
    passingAccuracy: 86, // 33/44 (75%) vs Vietnam
    recoveries: 17,
    averageRating: 7.4,
    addStrength: "Clean sheet in 1-0 Bronze medal playoff vs Vietnam"
  },
  'syahmi-safari': {
    appearances: 3,
    minutes: 72, // 18 + 54
    passingAccuracy: 83, // 15/20 (75%) vs Vietnam
    tackles: 3,
    recoveries: 6,
    averageRating: 6.7
  },
  'syahir-bashah': {
    appearances: 2,
    minutes: 58, // 18 + 40
    passingAccuracy: 68, // 7/10 (70%) vs Vietnam
    averageRating: 7.2
  },
  'quentin-cheng': {
    appearances: 4,
    minutes: 296, // 248 + 48
    passingAccuracy: 82, // 12/19 (63%) vs Vietnam
    tackles: 12,
    recoveries: 19,
    averageRating: 7.2
  },
  'paulo-josue-fifa': {
    appearances: 4,
    minutes: 117, // 103 + 14
    passingAccuracy: 78,
    averageRating: 7.15
  },
  'g-pavithran-fifa': {
    appearances: 2,
    minutes: 41, // 19 + 22
    passingAccuracy: 72,
    averageRating: 6.55
  }
};

for (const p of players) {
  if (fifaUpdates[p.id]) {
    const u = fifaUpdates[p.id];
    Object.assign(p, {
      appearances: u.appearances !== undefined ? u.appearances : p.appearances,
      minutes: u.minutes !== undefined ? u.minutes : p.minutes,
      goals: u.goals !== undefined ? u.goals : p.goals,
      assists: u.assists !== undefined ? u.assists : p.assists,
      shots: u.shots !== undefined ? u.shots : p.shots,
      expectedGoals: u.expectedGoals !== undefined ? u.expectedGoals : p.expectedGoals,
      passingAccuracy: u.passingAccuracy !== undefined ? u.passingAccuracy : p.passingAccuracy,
      tackles: u.tackles !== undefined ? u.tackles : p.tackles,
      interceptions: u.interceptions !== undefined ? u.interceptions : p.interceptions,
      recoveries: u.recoveries !== undefined ? u.recoveries : p.recoveries,
      averageRating: u.averageRating !== undefined ? u.averageRating : p.averageRating
    });
    if (u.addStrength && p.aiAnalysis && p.aiAnalysis.strengths) {
      if (!p.aiAnalysis.strengths.includes(u.addStrength)) {
        p.aiAnalysis.strengths.unshift(u.addStrength);
      }
    }
  }
}

fs.writeFileSync(playersPath, JSON.stringify(players, null, 2), 'utf8');
console.log('Successfully updated data/players.json!');

// 2. Update data/statistics.json
const statsPath = path.join(__dirname, '../data/statistics.json');
const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

if (stats['fifa-asean-cup-2026']) {
  const fifa = stats['fifa-asean-cup-2026'];
  
  // Update tournament stats
  fifa.tournamentStats = {
    tournamentName: "2026 FIFA ASEAN Cup (Harimau Malaya Campaign)",
    teamName: "Malaysia",
    totalMatches: 4,
    totalWins: 3,
    totalDraws: 1,
    totalLosses: 0,
    totalGoals: 10,
    goalsConceded: 0,
    goalDifference: 10,
    avgGoalsPerMatch: 2.5,
    cleanSheets: 4,
    cleanSheetRate: "100%",
    points: 10,
    campaignFinish: "Bronze Medal 🥉 (Defeated Vietnam 1-0 in 3rd-Place Playoff)"
  };

  // Top scorers
  // Bergson matches = 4
  const bergsonScorer = fifa.topScorers.find(s => s.playerId === 'bergson');
  if (bergsonScorer) { bergsonScorer.matches = 4; }

  // Stuart Wilkin matches = 4
  const wilkinScorer = fifa.topScorers.find(s => s.playerId === 'stuart-wilkin');
  if (wilkinScorer) { wilkinScorer.matches = 4; }

  // Paulo Josue matches = 4
  const josueScorer = fifa.topScorers.find(s => s.playerId === 'paulo-josue');
  if (josueScorer) { josueScorer.matches = 4; }

  // Syahir Bashah matches = 2
  const bashahScorer = fifa.topScorers.find(s => s.playerId === 'syahir-bashah');
  if (bashahScorer) { bashahScorer.matches = 2; }

  // Add Fergus Tierney
  if (!fifa.topScorers.find(s => s.playerId === 'fergus-tierney')) {
    fifa.topScorers.push({
      playerId: "fergus-tierney",
      name: "Fergus Tierney",
      teamId: "malaysia",
      teamName: "Malaysia",
      club: "Chonburi FC",
      position: "Forward",
      value: 1,
      goals: 1,
      assists: 0,
      matches: 4
    });
  }

  // Top Assists
  const hidalgoAssist = fifa.topAssists.find(a => a.playerId === 'manuel-hidalgo');
  if (hidalgoAssist) { hidalgoAssist.value = 3; }

  const hongWanAssist = fifa.topAssists.find(a => a.playerId === 'hong-wan');
  if (hongWanAssist) { hongWanAssist.value = 2; }

  if (!fifa.topAssists.find(a => a.playerId === 'harith-haikal')) {
    fifa.topAssists.push({
      playerId: "harith-haikal",
      name: "Harith Haikal",
      teamId: "malaysia",
      teamName: "Malaysia",
      club: "Selangor FC",
      position: "Defender",
      value: 1
    });
  }

  // Clean Sheets
  const syihanCS = fifa.cleanSheets.find(c => c.playerId === 'syihan-hazmi');
  if (syihanCS) {
    syihanCS.value = 3;
    syihanCS.matches = 3;
  }

  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');
  console.log('Successfully updated data/statistics.json!');
}

// 3. Add match-fac-13 to data/matches.json
const matchesPath = path.join(__dirname, '../data/matches.json');
const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

if (!matches.find(m => m.matchId === 'match-fac-13')) {
  matches.push({
    matchId: "match-fac-13",
    tournamentId: "fifa-asean-cup-2026",
    status: "COMPLETED",
    minute: 90,
    homeScore: 0,
    awayScore: 1,
    homeTeamId: "vietnam",
    awayTeamId: "malaysia",
    timeline: [
      {
        minute: 40,
        type: "SUBSTITUTION",
        teamId: "malaysia",
        playerNameIn: "Syahir Bashah",
        playerNameOut: "Pavithran Gunalan",
        detail: "Tactical change"
      },
      {
        minute: 50,
        type: "SUBSTITUTION",
        teamId: "malaysia",
        playerNameIn: "Fergus Tierney",
        playerNameOut: "Syahmi Safari",
        detail: "Tactical change to inject attacking power"
      },
      {
        minute: 62,
        type: "GOAL",
        teamId: "malaysia",
        playerName: "Fergus Tierney",
        detail: "Goal! Clinical turn and finish into the bottom corner. Assisted by Manuel Hidalgo"
      },
      {
        minute: 62,
        type: "SUBSTITUTION",
        teamId: "malaysia",
        playerNameIn: "Quentin Cheng",
        playerNameOut: "Hong Wan",
        detail: "Tactical change"
      },
      {
        minute: 62,
        type: "SUBSTITUTION",
        teamId: "malaysia",
        playerNameIn: "Paulo Josué",
        playerNameOut: "Bergson da Silva",
        detail: "Tactical change"
      },
      {
        minute: 80,
        type: "SUBSTITUTION",
        teamId: "malaysia",
        playerNameIn: "Pavithran Gunalan",
        playerNameOut: "Harith Haikal",
        detail: "Tactical change"
      },
      {
        minute: 89,
        type: "SUBSTITUTION",
        teamId: "malaysia",
        playerNameIn: "Nazmi Faiz Mansor",
        playerNameOut: "Manuel Hidalgo",
        detail: "Late game management"
      }
    ],
    statistics: {
      possession: [46, 54],
      shots: [8, 11],
      shotsOnTarget: [2, 5],
      expectedGoals: [0.62, 1.48],
      passes: [356, 438],
      passAccuracy: [77, 85],
      corners: [3, 6],
      offsides: [2, 1],
      crosses: [11, 17],
      tackles: [14, 19],
      recoveries: [42, 53]
    },
    formations: {
      home: "4-3-3",
      away: "3-4-3",
      homeStartingXI: [],
      awayStartingXI: []
    },
    pressureChart: [
      { minute: 15, value: 45 },
      { minute: 30, value: 50 },
      { minute: 45, value: 55 },
      { minute: 60, value: 65 },
      { minute: 62, value: 85 },
      { minute: 75, value: 60 },
      { minute: 90, value: 70 }
    ],
    aiSummary: "In the 3rd-Place Playoff of the 2026 FIFA ASEAN Cup at Gelora Bung Karno Stadium, Malaysia claimed a historic 1-0 victory over Vietnam to take home the Bronze Medal. Fergus Tierney scored the decisive goal in the 62nd minute off a pinpoint Manuel Hidalgo setup, sealing Malaysia's first victory over Vietnam in 12 years. Ahmad Syihan Hazmi and the backline kept a resilient clean sheet.",
    manOfTheMatch: "Fergus Tierney",
    referee: "Kim Hee-gon (South Korea)",
    weather: "28°C, Clear"
  });

  fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2), 'utf8');
  console.log('Successfully added match-fac-13 to data/matches.json!');
}
