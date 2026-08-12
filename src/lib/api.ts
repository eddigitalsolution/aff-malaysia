import teamsData from '../../data/teams.json';
import playersData from '../../data/players.json';
import fixturesData from '../../data/fixtures.json';
import matchesData from '../../data/matches.json';
import standingsData from '../../data/standings.json';
import predictionsData from '../../data/predictions.json';
import newsData from '../../data/news.json';
import venuesData from '../../data/venues.json';
import statisticsData from '../../data/statistics.json';

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
}

export interface Fixture {
  id: string;
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

// API functions wrapping static data. Can easily be converted to fetch calls.
export async function getTeams(): Promise<Team[]> {
  return teamsData as Team[];
}

export async function getTeam(id: string): Promise<Team | null> {
  const teams = await getTeams();
  return teams.find(t => t.id === id) || null;
}

export async function getPlayers(): Promise<Player[]> {
  return playersData as Player[];
}

export async function getPlayer(id: string): Promise<Player | null> {
  const players = await getPlayers();
  return players.find(p => p.id === id) || null;
}

export async function getFixtures(): Promise<Fixture[]> {
  return fixturesData as Fixture[];
}

export async function getMatches(): Promise<MatchDetails[]> {
  return matchesData as unknown as MatchDetails[];
}

export async function getMatch(id: string): Promise<MatchDetails | null> {
  const matches = await getMatches();
  return matches.find(m => m.matchId === id) || null;
}

export async function getStandings(): Promise<{ A: any[]; B: any[] }> {
  return standingsData;
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

export async function getStatistics(): Promise<any> {
  return statisticsData;
}
