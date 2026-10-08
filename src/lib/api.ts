import teamsData from '../../data/teams.json';
import playersData from '../../data/players.json';
import fixturesData from '../../data/fixtures.json';
import matchesData from '../../data/matches.json';
import standingsData from '../../data/standings.json';
import predictionsData from '../../data/predictions.json';
import newsData from '../../data/news.json';
import venuesData from '../../data/venues.json';
import statisticsData from '../../data/statistics.json';

export interface Tournament {
  id: string;
  name: string;
  shortName: string;
  division: string;
  host: string;
  dates: string;
  sanction: string;
  featuredFocus: string;
}

export const TOURNAMENTS: Tournament[] = [
  {
    id: 'fifa-asean-cup-2026',
    name: '2026 FIFA ASEAN Cup',
    shortName: 'FIFA ASEAN Cup',
    division: 'Division 1',
    host: 'Indonesia (Jakarta & Bandung)',
    dates: '24 Sep – 05 Oct 2026',
    sanction: 'FIFA Sanctioned (MoU 47th ASEAN Summit)',
    featuredFocus: 'Malaysia (Group A)'
  },
  {
    id: 'aff-cup-2026',
    name: 'ASEAN Hyundai Cup 2026',
    shortName: 'Hyundai Cup',
    division: 'Main Championship',
    host: 'Multi-Nation (Home & Away)',
    dates: '24 July – 26 August 2026',
    sanction: 'AFF Championship',
    featuredFocus: 'Malaysia (Group B)'
  }
];

// Types defining the structure of the data for Type safety and clean API boundary
export interface Team {
  id: string;
  name: string;
  code: string;
  group: string;
  flag: string;
  coach: string;
  captain: string;
  fifaRanking: number;
  ratings: {
    attack: number;
    midfield: number;
    defense: number;
  };
  averageAge: number;
  squadValue: string;
  formation: string;
  recentForm: string[];
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  photo: string;
  club: string;
  age: number;
  height: number;
  weight: number;
  nationality: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  number: number;
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  shots: number;
  expectedGoals: number;
  expectedAssists: number;
  passingAccuracy: number;
  tackles: number;
  interceptions: number;
  recoveries: number;
  averageRating: number;
  sprintSpeed?: number;
  distanceCovered?: number;
  touches?: number;
  radar?: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    playingStyle: string;
  };
  injuryStatus?: 'Injured' | 'Doubtful' | 'Healthy' | 'Returned to Club';
  tournamentId?: string;
  isChinaCallUp?: boolean;
  callUpRole?: string;
  tournamentProvenance?: string;
  tournamentHighlight?: string;
}

export interface Fixture {
  id: string;
  tournamentId?: string;
  stage: string;
  matchday: number;
  group: string | null;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  status: 'COMPLETED' | 'LIVE' | 'UPCOMING';
  venueId: string;
  referee: string;
  weather: string;
}

export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'CARD_YELLOW' | 'CARD_RED' | 'SUBSTITUTION';
  teamId: string;
  playerName: string;
  playerNameIn?: string;
  playerNameOut?: string;
  detail: string;
}

export interface StartingXIPlayer {
  id: string;
  name: string;
  number: number;
  rating: number;
  position: string;
  coords: [number, number]; // pitch visual layout coordinates
}

export interface MatchDetails {
  matchId: string;
  tournamentId?: string;
  status: 'COMPLETED' | 'LIVE' | 'UPCOMING';
  minute?: number;
  homeScore: number;
  awayScore: number;
  homeTeamId: string;
  awayTeamId: string;
  timeline: MatchEvent[];
  statistics: {
    possession: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
    expectedGoals: [number, number];
    passes: [number, number];
    passAccuracy: [number, number];
    corners: [number, number];
    offsides: [number, number];
    crosses?: [number, number];
    tackles?: [number, number];
    recoveries?: [number, number];
  };
  formations: {
    home: string;
    away: string;
    homeStartingXI: StartingXIPlayer[];
    awayStartingXI: StartingXIPlayer[];
  };
  pressureChart: { minute: number; value: number }[];
  aiSummary: string;
  manOfTheMatch?: string;
  referee?: string;
  weather?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  image: string;
  tags: string[];
}

export interface Prediction {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  winnerProbabilityHome: number;
  winnerProbabilityAway: number;
  drawProbability: number;
  scorePrediction: string;
  firstGoalScorer: string;
  mostLikelyAssist: string;
  expectedGoalsHome: number;
  expectedGoalsAway: number;
  confidenceScore: number;
  aiExplanation: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  image: string;
}

export const TOURNAMENT_TEAMS: Record<string, { A: string[]; B: string[] }> = {
  'fifa-asean-cup-2026': {
    A: ['malaysia', 'indonesia', 'singapore', 'bangladesh'],
    B: []
  },
  'aff-cup-2026': {
    A: ['vietnam', 'indonesia', 'singapore', 'cambodia', 'timor-leste'],
    B: ['thailand', 'malaysia', 'myanmar', 'philippines', 'laos']
  }
};

// API functions wrapping static data.
export async function getTeams(tournamentId?: string): Promise<Team[]> {
  const allTeams = teamsData as Team[];
  if (!tournamentId || !TOURNAMENT_TEAMS[tournamentId]) {
    return allTeams;
  }
  const tournamentConfig = TOURNAMENT_TEAMS[tournamentId];
  const groupAMap = new Set(tournamentConfig.A);
  const groupBMap = new Set(tournamentConfig.B);

  return allTeams
    .filter(t => groupAMap.has(t.id) || groupBMap.has(t.id))
    .map(t => ({
      ...t,
      group: groupAMap.has(t.id) ? 'A' : 'B'
    }));
}

export async function getTeam(id: string, tournamentId?: string): Promise<Team | null> {
  const teams = await getTeams(tournamentId);
  return teams.find(t => t.id === id) || (teamsData as Team[]).find(t => t.id === id) || null;
}

export async function getPlayers(teamId?: string, tournamentId?: string): Promise<Player[]> {
  let allPlayers = playersData as Player[];
  if (tournamentId) {
    allPlayers = allPlayers.filter(p => !p.tournamentId || p.tournamentId === tournamentId);
  }
  if (teamId) {
    allPlayers = allPlayers.filter(p => p.teamId === teamId);
  }
  return allPlayers;
}

export async function getPlayer(id: string, tournamentId?: string): Promise<Player | null> {
  const players = await getPlayers(undefined, tournamentId);
  return players.find(p => p.id === id) || (playersData as Player[]).find(p => p.id === id) || null;
}

export async function getFixtures(tournamentId?: string): Promise<Fixture[]> {
  const allFixtures = fixturesData as Fixture[];
  if (!tournamentId) {
    return allFixtures;
  }
  return allFixtures.filter(f => f.tournamentId === tournamentId);
}

export async function getMatches(): Promise<MatchDetails[]> {
  return matchesData as unknown as MatchDetails[];
}

export async function getMatch(id: string): Promise<MatchDetails | null> {
  const matches = await getMatches();
  return matches.find(m => m.matchId === id) || null;
}

export interface StandingRow {
  position: number;
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  recentForm: string[];
  qualificationStatus: string;
}

export interface TournamentStandings {
  A: StandingRow[];
  B?: StandingRow[];
}

export async function getStandings(tournamentId: string = 'fifa-asean-cup-2026'): Promise<TournamentStandings> {
  const data = standingsData as Record<string, TournamentStandings>;
  if (data[tournamentId]) {
    return data[tournamentId];
  }
  return data['fifa-asean-cup-2026'] || (standingsData as unknown as TournamentStandings);
}

export async function getPredictions(): Promise<Prediction[]> {
  return predictionsData as Prediction[];
}

export async function getPrediction(matchId: string): Promise<Prediction | null> {
  const preds = await getPredictions();
  return preds.find(p => p.matchId === matchId) || null;
}

export async function getNews(): Promise<NewsItem[]> {
  return newsData as NewsItem[];
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const news = await getNews();
  return news.find(n => n.id === id) || null;
}

export async function getVenues(): Promise<Venue[]> {
  return venuesData as Venue[];
}

export async function getStatistics(tournamentId: string = 'fifa-asean-cup-2026'): Promise<any> {
  const data = statisticsData as any;
  if (data[tournamentId]) {
    return data[tournamentId];
  }
  return data['fifa-asean-cup-2026'] || data;
}
