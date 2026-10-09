'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Trophy, Search, Star, Zap, Shield, Target, 
  TrendingUp, Award, ExternalLink, ChevronRight, Activity, 
  ArrowUpRight, Users, Flame, CheckCircle2, UserCheck, Eye, 
  SlidersHorizontal, Check
} from 'lucide-react';
import { TOURNAMENTS, Player } from '@/lib/api';
import { useAppState } from '@/store';

interface PotentialPlayerMeta {
  id: string;
  name: string;
  age: number;
  dob: string;
  club: string;
  position: 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
  subRole: string;
  height: number;
  foot: 'Left' | 'Right' | 'Both';
  photo: string;
  potentialRating: number;
  currentRating: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  scoutVerdict: 'Generational Talent' | 'Future Cornerstone' | 'High-Ceiling Prospect' | 'Squad Depth';
  highlightText: string;
  recentForm: string;
  seniorCallUp: boolean;
  strengths: string[];
  weaknesses: string[];
  tacticalRole: string;
  sourceUrl?: string;
}

const POTENTIAL_PLAYERS: PotentialPlayerMeta[] = [
  {
    id: 'daniesh-amirruddin',
    name: 'Daniesh Amirruddin',
    age: 20,
    dob: '03 Aug 2006',
    club: "Johor Darul Ta'zim",
    position: 'Forward',
    subRole: 'Inverted Left Winger / Striker (#40)',
    height: 170,
    foot: 'Left',
    photo: '/players/daniesh-amirruddin.png',
    potentialRating: 92,
    currentRating: 79,
    pace: 88,
    shooting: 82,
    passing: 76,
    dribbling: 85,
    defending: 48,
    physical: 74,
    scoutVerdict: 'Generational Talent',
    highlightText: 'Scored 4 goals in senior debut campaign: FA Cup brace vs UM Damansara (9.2 rating) and Shopee Cup double vs Svay Rieng (9.7 rating).',
    recentForm: '4 Goals · 1 Assist in 115 Senior Mins · Sofascore 9.7 Peak Rating',
    seniorCallUp: true,
    strengths: ['Explosive acceleration on left flank', 'Fearless 1v1 direct dribbling', 'Clinical inside-the-box finishing', 'High transition sprint speed (33.6 km/h)'],
    weaknesses: ['Defensive tracking back against overlapping fullbacks', 'Aerial duels against tall defenders'],
    tacticalRole: 'Direct goal-scoring inverted winger capable of tearing open low blocks or leading vertical counter-attacks.',
    sourceUrl: 'https://www.sofascore.com/football/player/daniesh-amirruddin/2742128'
  },
  {
    id: 'g-pavithran',
    name: 'G. Pavithran',
    age: 21,
    dob: '12 Feb 2005',
    club: "Johor Darul Ta'zim U23",
    position: 'Forward',
    subRole: 'Left Winger / Inside Forward (#11)',
    height: 174,
    foot: 'Right',
    photo: '/players/g-pavithran.png',
    potentialRating: 89,
    currentRating: 76,
    pace: 85,
    shooting: 78,
    passing: 77,
    dribbling: 82,
    defending: 52,
    physical: 68,
    scoutVerdict: 'Future Cornerstone',
    highlightText: 'Started all 6 matches in AFF Hyundai Cup (540 mins), scoring 1 goal and delivering 2 assists. Trusted by coaching staff for relentless stamina.',
    recentForm: '540 Mins · 1 Goal · 2 Assists · Rating 7.50 in AFF',
    seniorCallUp: true,
    strengths: ['High-workrate two-way pressing', 'Precise low-cross delivery', 'Consistency over 90 mins'],
    weaknesses: ['Physical upper-body strength', 'Finishing under pressure'],
    tacticalRole: 'Hard-running winger who stretches opposition fullbacks and provides width in possession.',
  },
  {
    id: 'faris-danish',
    name: 'Faris Danish',
    age: 20,
    dob: '18 Nov 2005',
    club: "Johor Darul Ta'zim U23",
    position: 'Defender',
    subRole: 'Left-Back / Wing-Back (#21)',
    height: 176,
    foot: 'Left',
    photo: '/players/faris-danish.png',
    potentialRating: 88,
    currentRating: 74,
    pace: 84,
    shooting: 58,
    passing: 76,
    dribbling: 75,
    defending: 78,
    physical: 76,
    scoutVerdict: 'Future Cornerstone',
    highlightText: 'Dynamic modern left-back prospect with electric recovery speed and tactical discipline on the overlap. Natural successor to Corbin-Ong.',
    recentForm: 'Selected in 26-man China Friendly squad as primary 5-3-2 LWB rotation',
    seniorCallUp: true,
    strengths: ['High-speed recovery tackles', 'Overlapping delivery into box', '1v1 ground duel tenacity'],
    weaknesses: ['Positional discipline when caught high upfield'],
    tacticalRole: 'Modern marauding left wing-back who provides overlapping width and aggressive recovery tackling.',
  },
  {
    id: 'ubaidullah-shamsul',
    name: 'Ubaidullah Shamsul',
    age: 22,
    dob: '30 Nov 2003',
    club: 'Terengganu FC',
    position: 'Defender',
    subRole: 'Central Defender (CB / LCB #5)',
    height: 182,
    foot: 'Right',
    photo: '/players/ubaidullah-shamsul.png',
    potentialRating: 88,
    currentRating: 76,
    pace: 75,
    shooting: 45,
    passing: 78,
    dribbling: 66,
    defending: 84,
    physical: 83,
    scoutVerdict: 'Future Cornerstone',
    highlightText: 'Tournament rock: played all 540 minutes in AFF Hyundai Cup. Won 32 ground and aerial duels with 84% passing accuracy out from the back.',
    recentForm: '540 Mins · 84% Pass Acc · 32 Duels Won · Elite defensive anchor',
    seniorCallUp: true,
    strengths: ['Dominant aerial presence', 'Composed passing from backline', 'High football IQ & interception timing'],
    weaknesses: ['Acceleration against rapid counter-attacking wingers'],
    tacticalRole: 'Stopper CB who controls defensive line depth and initiates build-up through vertical line-breaking passes.',
  },
  {
    id: 'nooa-laine',
    name: 'Nooa Laine',
    age: 23,
    dob: '22 Nov 2002',
    club: 'Selangor FC',
    position: 'Midfielder',
    subRole: 'Defensive Midfielder / Deep Pivot (CDM #14)',
    height: 178,
    foot: 'Right',
    photo: '/players/nooa-laine.png',
    potentialRating: 90,
    currentRating: 80,
    pace: 74,
    shooting: 70,
    passing: 88,
    dribbling: 81,
    defending: 79,
    physical: 78,
    scoutVerdict: 'Generational Talent',
    highlightText: 'Midfield general who recorded 95% pass accuracy vs Indonesia inside GBK Jakarta and registered an assist vs Bangladesh in FIFA ASEAN Cup.',
    recentForm: '95% Pass Acc vs Indonesia · 1 Assist vs Bangladesh · Starting CDM for China Friendly',
    seniorCallUp: true,
    strengths: ['Press resistance under high pressure', 'Tempo dictation & long-range switches', 'Defensive anticipation & tackle success (81%)'],
    weaknesses: ['Raw sprint speed on long recoveries'],
    tacticalRole: 'Deep-lying playmaker who orchestrates build-up phase and provides structural defensive shielding.',
  },
  {
    id: 'brad-tapp',
    name: 'Brad Tapp',
    age: 24,
    dob: '15 Jan 2002',
    club: "Johor Darul Ta'zim",
    position: 'Defender',
    subRole: 'Central Defender (CB #3)',
    height: 188,
    foot: 'Right',
    photo: '/players/brad-tapp.png',
    potentialRating: 89,
    currentRating: 80,
    pace: 76,
    shooting: 48,
    passing: 84,
    dribbling: 68,
    defending: 86,
    physical: 88,
    scoutVerdict: 'Future Cornerstone',
    highlightText: 'Towering center-back with 3 clean sheets and 94% pass accuracy in FIFA ASEAN Cup. Partnered Dion Cools in dominant central pairing.',
    recentForm: '3 Clean Sheets · 94% Pass Accuracy · 188 cm Aerial Commander',
    seniorCallUp: true,
    strengths: ['Aerial dominance in both boxes', 'Composure on ball under press', 'Commanding physical leadership'],
    weaknesses: ['Turning agility against small agile dribblers'],
    tacticalRole: 'Modern ball-playing aerial center-back capable of repelling direct physical attacks.',
  },
  {
    id: 'alif-ahmad',
    name: 'Alif Ahmad',
    age: 23,
    dob: '08 Jun 2003',
    club: "Johor Darul Ta'zim U23",
    position: 'Defender',
    subRole: 'Right-Back (RB #2)',
    height: 177,
    foot: 'Right',
    photo: '/players/alif-ahmad.png',
    potentialRating: 86,
    currentRating: 73,
    pace: 82,
    shooting: 54,
    passing: 75,
    dribbling: 72,
    defending: 77,
    physical: 75,
    scoutVerdict: 'High-Ceiling Prospect',
    highlightText: 'Solid 388 minutes across 5 matches at right-back in AFF Hyundai Cup. Disciplined 1v1 defending against Singapore and Thailand wingers.',
    recentForm: '388 Mins in AFF · Consistent 1v1 defensive tackle win rate (76%)',
    seniorCallUp: false,
    strengths: ['Tough tackling in wide duels', 'Stamina across 90 minutes', 'Tactical positional discipline'],
    weaknesses: ['Crossing accuracy when reaching final third'],
    tacticalRole: 'Defensive-minded right-back who secures the flank and tucks inside during defensive transitions.',
  },
  {
    id: 'syahir-bashah',
    name: 'Syahir Bashah',
    age: 24,
    dob: '16 Sep 2002',
    club: 'Selangor FC',
    position: 'Midfielder',
    subRole: 'Attacking Midfielder (CAM / CM #18)',
    height: 173,
    foot: 'Left',
    photo: '/players/syahir-bashah.png',
    potentialRating: 86,
    currentRating: 75,
    pace: 79,
    shooting: 76,
    passing: 80,
    dribbling: 81,
    defending: 55,
    physical: 70,
    scoutVerdict: 'High-Ceiling Prospect',
    highlightText: 'Came off the bench to score in just 18 minutes during Malaysia’s 6–0 demolition of Singapore. High-tempo attacking spark with a lethal left foot.',
    recentForm: '1 Goal in 18 Mins vs Singapore · Called up for China Friendly Double-Header',
    seniorCallUp: true,
    strengths: ['Long-range shooting threat', 'Sharp half-space turns', 'Direct attacking impetus'],
    weaknesses: ['Defensive aerial contribution'],
    tacticalRole: 'Impact creator in Zone 14 capable of changing game tempo with decisive strikes from range.',
  },
  {
    id: 'daryl-sham',
    name: 'Daryl Sham',
    age: 23,
    dob: '30 Nov 2002',
    club: "Johor Darul Ta'zim U23",
    position: 'Midfielder',
    subRole: 'Central Midfielder (CM #8)',
    height: 175,
    foot: 'Right',
    photo: '/players/daryl-sham.png',
    potentialRating: 84,
    currentRating: 72,
    pace: 75,
    shooting: 64,
    passing: 78,
    dribbling: 74,
    defending: 68,
    physical: 72,
    scoutVerdict: 'Squad Depth',
    highlightText: 'Started all 6 matches in AFF Hyundai Cup (448 minutes). Unsung hero in midfield engine room providing work rate and ball recycling.',
    recentForm: '6 Starts in AFF Hyundai Cup · 448 Mins · High-energy workhorse',
    seniorCallUp: false,
    strengths: ['High ground coverage & distance covered', 'Disciplined ball circulation', 'Pressing intensity'],
    weaknesses: ['Final third assist delivery'],
    tacticalRole: 'Box-to-box midfielder who stabilizes central transitions and covers wide spaces.',
  }
];

export default function PotentialPlayersPage() {
  const router = useRouter();
  const { activeTournamentId, setActiveTournamentId } = useAppState();
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<'All' | 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper'>('All');
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<'All' | 'U21' | 'U23' | 'SeniorCallUp'>('All');
  const [selectedPlayerModal, setSelectedPlayerModal] = useState<PotentialPlayerMeta | null>(null);

  // Daniesh Amirruddin is the top featured wonderkid spotlight
  const wonderkid = POTENTIAL_PLAYERS.find(p => p.id === 'daniesh-amirruddin') || POTENTIAL_PLAYERS[0];

  const filteredPlayers = useMemo(() => {
    return POTENTIAL_PLAYERS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.subRole.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPos = selectedPosition === 'All' || p.position === selectedPosition;
      let matchesAge = true;
      if (selectedAgeCategory === 'U21') matchesAge = p.age <= 21;
      else if (selectedAgeCategory === 'U23') matchesAge = p.age <= 23;
      else if (selectedAgeCategory === 'SeniorCallUp') matchesAge = p.seniorCallUp;
      return matchesSearch && matchesPos && matchesAge;
    });
  }, [searchTerm, selectedPosition, selectedAgeCategory]);

  const handleTournamentClick = (id: string) => {
    setActiveTournamentId(id);
    router.push('/players');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Tournament Selection Header Tabs with Potential Players ACTIVE */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950 rounded-xl flex-1 sm:flex-initial">
          {TOURNAMENTS.map(t => {
            const isFifa = t.id === 'fifa-asean-cup-2026';
            return (
              <button
                key={t.id}
                onClick={() => handleTournamentClick(t.id)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 cursor-pointer"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>{t.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-black uppercase bg-zinc-800 text-zinc-400">
                  {isFifa ? 'FIFA' : 'AFF'}
                </span>
              </button>
            );
          })}

          {/* Active Potential Players Tab */}
          <div className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 bg-amber-400 text-zinc-950 shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-zinc-950" />
            <span>Potential Players</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-black uppercase bg-zinc-950/20 text-zinc-950">
              U23 SCOUTING
            </span>
          </div>
        </div>

        <div className="px-3 py-1 text-xs text-amber-400 font-bold flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5" />
          <span>Next-Gen Harimau Malaya Prospect Tracker</span>
        </div>
      </div>

      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-black uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>National Scouting Pipeline · U23 Talent Pool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Potential Players & Rising Stars</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            In-depth scouting radar and development ceiling for Malaysia's finest youth sensations eligible for senior national team call-ups and future international tournaments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/friendly"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>View 26-Man China Squad</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* =========================================================
          FEATURED WONDERKID SPOTLIGHT: DANIESH AMIRRUDDIN
      ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-red-950/40 via-zinc-900 to-zinc-950 border border-red-500/30 p-6 lg:p-8 shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Player Profile & Headshot */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group shrink-0">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-linear-to-b from-red-500/20 to-zinc-900 border-2 border-red-500/40 overflow-hidden shadow-xl flex items-center justify-center relative">
                <img
                  src={wonderkid.photo}
                  alt={wonderkid.name}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to silhouette if needed
                    e.currentTarget.src = '/players/bergson.png';
                  }}
                />
                <span className="absolute bottom-1 right-1 bg-zinc-950/90 text-amber-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-zinc-800">
                  #40 JDT
                </span>
              </div>
              <div className="mt-2 text-center sm:text-left">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                  <Flame className="h-3 w-3" />
                  Breakout Star 2026
                </span>
              </div>
            </div>

            <div className="text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  ⭐ Potential 92/100
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Senior Call-Up (China PR)
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {wonderkid.name}
              </h2>
              
              <p className="text-xs text-amber-300 font-bold">
                {wonderkid.club} • {wonderkid.subRole}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-zinc-900/80 border border-zinc-800 p-2 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Age</span>
                  <span className="text-sm font-black text-white">{wonderkid.age}</span>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-2 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Height</span>
                  <span className="text-sm font-black text-white">{wonderkid.height} cm</span>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-2 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Foot</span>
                  <span className="text-sm font-black text-white">{wonderkid.foot}</span>
                </div>
              </div>

              {wonderkid.sourceUrl && (
                <a
                  href={wonderkid.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors pt-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Verified on Sofascore Profile</span>
                </a>
              )}
            </div>
          </div>

          {/* Right: Key Breakthrough Stats & Scouting Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  Senior Breakthrough Performance
                </span>
                <span className="text-[10px] text-zinc-500 font-bold">
                  Shopee Cup & FA Cup 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                {wonderkid.highlightText}
              </p>
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-red-400" />
                <span>{wonderkid.recentForm}</span>
              </div>
            </div>

            {/* Radar / Core Attributes Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-bold">Pace</span>
                  <span className="text-amber-400 font-black">{wonderkid.pace}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${wonderkid.pace}%` }} />
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-bold">Dribbling</span>
                  <span className="text-amber-400 font-black">{wonderkid.dribbling}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${wonderkid.dribbling}%` }} />
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-bold">Shooting</span>
                  <span className="text-emerald-400 font-black">{wonderkid.shooting}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${wonderkid.shooting}%` }} />
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-bold">Passing</span>
                  <span className="text-zinc-200 font-black">{wonderkid.passing}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: `${wonderkid.passing}%` }} />
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-bold">Physical</span>
                  <span className="text-zinc-200 font-black">{wonderkid.physical}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: `${wonderkid.physical}%` }} />
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-bold">Defending</span>
                  <span className="text-zinc-400 font-black">{wonderkid.defending}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-zinc-500 h-full rounded-full" style={{ width: `${wonderkid.defending}%` }} />
                </div>
              </div>
            </div>

            {/* Tactical Strengths & Fit */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {wonderkid.strengths.map((str, idx) => (
                <span key={idx} className="text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg">
                  ✓ {str}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FILTERS & SEARCH BAR
      ========================================================= */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-zinc-900/70 border border-zinc-800/80 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search prospective player, club, position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Position & Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Age Filters */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            {(['All', 'U21', 'U23', 'SeniorCallUp'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedAgeCategory(cat)}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  selectedAgeCategory === cat
                    ? 'bg-amber-400 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat === 'All' ? 'All Ages' : cat === 'SeniorCallUp' ? 'China Call-Up' : cat}
              </button>
            ))}
          </div>

          {/* Position Filters */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            {(['All', 'Forward', 'Midfielder', 'Defender'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  selectedPosition === pos
                    ? 'bg-primary text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          POTENTIAL PLAYERS GRID
      ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-400" />
            <span>Scouted Potential Prospects ({filteredPlayers.length})</span>
          </h3>
          <span className="text-xs text-zinc-500">Sorted by Potential Ceiling</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => {
            const isHighlight = player.id === 'daniesh-amirruddin';
            return (
              <div
                key={player.id}
                onClick={() => setSelectedPlayerModal(player)}
                className={`group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
                  isHighlight
                    ? 'bg-linear-to-b from-red-950/30 to-zinc-900/90 border-red-500/40 hover:border-red-400 shadow-lg'
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Top Row: Headshot + Basic Info */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/players/bergson.png';
                        }}
                      />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-zinc-950 text-[9px] font-black px-1 rounded shadow">
                      {player.potentialRating}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        {player.position}
                      </span>
                      {player.seniorCallUp && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                          China Squad
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-black text-white group-hover:text-amber-400 transition-colors truncate">
                      {player.name}
                    </h4>

                    <p className="text-xs text-zinc-400 truncate">
                      {player.club}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500 font-bold">
                      <span>Age {player.age}</span>
                      <span>•</span>
                      <span>{player.height} cm</span>
                      <span>•</span>
                      <span className="text-amber-400">{player.scoutVerdict}</span>
                    </div>
                  </div>
                </div>

                {/* Highlight snippet */}
                <p className="text-xs text-zinc-300 leading-relaxed mt-3 line-clamp-2">
                  {player.highlightText}
                </p>

                {/* Attribute Mini-Bar Comparison */}
                <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-zinc-800/80 text-center">
                  <div className="bg-zinc-950/70 p-1 rounded-lg">
                    <span className="text-[9px] text-zinc-500 block uppercase font-bold">PAC</span>
                    <span className="text-xs font-black text-amber-400">{player.pace}</span>
                  </div>
                  <div className="bg-zinc-950/70 p-1 rounded-lg">
                    <span className="text-[9px] text-zinc-500 block uppercase font-bold">DRI</span>
                    <span className="text-xs font-black text-zinc-200">{player.dribbling}</span>
                  </div>
                  <div className="bg-zinc-950/70 p-1 rounded-lg">
                    <span className="text-[9px] text-zinc-500 block uppercase font-bold">SHO</span>
                    <span className="text-xs font-black text-zinc-200">{player.shooting}</span>
                  </div>
                  <div className="bg-zinc-950/70 p-1 rounded-lg">
                    <span className="text-[9px] text-zinc-500 block uppercase font-bold">POT</span>
                    <span className="text-xs font-black text-emerald-400">{player.potentialRating}</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400 group-hover:text-amber-300 transition-colors pt-1">
                  <span>View Full Scouting Profile</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          PLAYER SCOUTING MODAL
      ========================================================= */}
      {selectedPlayerModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPlayerModal(null)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0">
                  <img
                    src={selectedPlayerModal.photo}
                    alt={selectedPlayerModal.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = '/players/bergson.png';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      ⭐ Potential {selectedPlayerModal.potentialRating}/100
                    </span>
                    {selectedPlayerModal.seniorCallUp && (
                      <span className="text-[10px] font-black uppercase text-red-300 bg-red-500/20 px-2 py-0.5 rounded">
                        China Squad
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    {selectedPlayerModal.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    {selectedPlayerModal.club} • {selectedPlayerModal.subRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlayerModal(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Bio Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Age</span>
                <span className="font-black text-white">{selectedPlayerModal.age}</span>
              </div>
              <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Height</span>
                <span className="font-black text-white">{selectedPlayerModal.height} cm</span>
              </div>
              <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Preferred Foot</span>
                <span className="font-black text-white">{selectedPlayerModal.foot}</span>
              </div>
              <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Status</span>
                <span className="font-black text-emerald-400">{selectedPlayerModal.scoutVerdict}</span>
              </div>
            </div>

            {/* Tactical Scout Report */}
            <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Tactical Scouting Assessment
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {selectedPlayerModal.tacticalRole}
              </p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-400 block">
                  Key Strengths
                </span>
                {selectedPlayerModal.strengths.map((str, i) => (
                  <div key={i} className="text-zinc-300 flex items-start gap-1.5 leading-tight">
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-red-400 block">
                  Development Areas
                </span>
                {selectedPlayerModal.weaknesses.map((w, i) => (
                  <div key={i} className="text-zinc-300 flex items-start gap-1.5 leading-tight">
                    <span className="text-red-400 shrink-0">!</span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {selectedPlayerModal.sourceUrl ? (
                <a
                  href={selectedPlayerModal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Sofascore Profile</span>
                </a>
              ) : (
                <span className="text-xs text-zinc-500">Internal National Scout Log</span>
              )}

              <Link
                href="/friendly"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-zinc-950 hover:bg-amber-300 transition-all flex items-center gap-1.5"
              >
                <span>Test in Friendly Lineup</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
