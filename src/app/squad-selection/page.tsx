'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlayers, TOURNAMENTS, Player } from '@/lib/api';
import { useAppState } from '@/store';
import { Users, Award, Calendar, Star, ChevronRight, Activity, ShieldCheck, ArrowRightLeft, UserCheck, Trophy, Globe, Lightbulb } from 'lucide-react';

interface PitchPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  rating: number;
  role: string;
  x: number;
  y: number;
  photo?: string;
}

export default function SquadSelectionPage() {
  const { activeTournamentId, setActiveTournamentId } = useAppState();
  const [players, setPlayers] = useState<Player[]>([]);
  const [bestXI, setBestXI] = useState<PitchPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const currentTournament = TOURNAMENTS.find(t => t.id === activeTournamentId) || TOURNAMENTS[0];
  const isFifa = activeTournamentId === 'fifa-asean-cup-2026';

  useEffect(() => {
    async function loadData() {
      const allPlayers = await getPlayers(undefined, activeTournamentId);
      const malPlayers = allPlayers.filter(p => p.teamId === 'malaysia');
      setPlayers(malPlayers);

      if (isFifa) {
        // FIFA ASEAN Cup 2026 Best XI from the 3 Group A matches
        const fifaRoles: { id: string; role: string; x: number; y: number }[] = [
          { id: 'syihan-hazmi', role: 'GK', x: 50, y: 88 },
          { id: 'corbin-ong', role: 'LB', x: 15, y: 68 },
          { id: 'brad-tapp', role: 'LCB', x: 35, y: 70 },
          { id: 'dion-cools', role: 'RCB', x: 65, y: 70 },
          { id: 'quentin-cheng', role: 'RB', x: 85, y: 68 },
          { id: 'stuart-wilkin', role: 'LCM', x: 30, y: 46 },
          { id: 'nooa-laine', role: 'CM', x: 50, y: 52 },
          { id: 'manuel-hidalgo', role: 'RCM', x: 70, y: 46 },
          { id: 'faisal-halim', role: 'LW', x: 20, y: 22 },
          { id: 'bergson', role: 'ST', x: 50, y: 18 },
          { id: 'arif-aiman', role: 'RW', x: 80, y: 22 },
        ];

        const selection: PitchPlayer[] = fifaRoles.map(r => {
          const found = malPlayers.find(p => p.id === r.id);
          if (found) {
            return {
              id: found.id,
              name: found.name,
              number: found.number,
              position: found.position,
              rating: found.averageRating,
              role: r.role,
              x: r.x,
              y: r.y,
              photo: found.photo
            };
          }
          return {
            id: r.id,
            name: r.id,
            number: 0,
            position: 'Player',
            rating: 7.0,
            role: r.role,
            x: r.x,
            y: r.y
          };
        });

        setBestXI(selection);
        setLoading(false);
        return;
      }

      // AFF Hyundai Cup 2026 Best XI — based on actual AFF tournament ratings & minutes
      const affRoles: { id: string; role: string; x: number; y: number }[] = [
        { id: 'azri-ghani',          role: 'GK',  x: 50, y: 88 },
        { id: 'ruventhiran',         role: 'LB',  x: 15, y: 68 },
        { id: 'rodney-celvin',       role: 'LCB', x: 35, y: 70 },
        { id: 'ubaidullah-shamsul',  role: 'RCB', x: 65, y: 70 },
        { id: 'alif-ahmad',          role: 'RB',  x: 85, y: 68 },
        { id: 'wan-kuzain',          role: 'LCM', x: 30, y: 46 },
        { id: 'sergio-aguero',       role: 'CM',  x: 50, y: 52 },
        { id: 'daryl-sham',          role: 'RCM', x: 70, y: 46 },
        { id: 'sumareh',             role: 'LW',  x: 20, y: 22 },
        { id: 'paulo-josue',         role: 'ST',  x: 50, y: 18 },
        { id: 'g-pavithran',         role: 'RW',  x: 80, y: 22 },
      ];

      const affSelection: PitchPlayer[] = affRoles.map(r => {
        const found = malPlayers.find(p => p.id === r.id);
        if (found) {
          return {
            id: found.id,
            name: found.name,
            number: found.number,
            position: found.position,
            rating: found.averageRating,
            role: r.role,
            x: r.x,
            y: r.y,
            photo: found.photo
          };
        }
        return { id: r.id, name: r.id, number: 0, position: 'Player', rating: 7.0, role: r.role, x: r.x, y: r.y };
      });

      setBestXI(affSelection);
      setLoading(false);
    }
    loadData();
  }, [activeTournamentId, isFifa]);

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center">Loading selection projections...</div>;
  }

  // Full squad call-up analysis per tournament
  const callUpAnalysis = isFifa ? [
    // MUST CALL
    { id: 'bergson',           verdict: 'MUST CALL', reason: '4 goals (hat-trick vs SGP), top scorer — elite clinical finisher', color: 'emerald' },
    { id: 'arif-aiman',        verdict: 'MUST CALL', reason: '2G 2A, 22 duels won vs SGP, talismanic wing creator at age 24', color: 'emerald' },
    { id: 'dion-cools',        verdict: 'MUST CALL', reason: 'Captain & 8.9 MVP vs Indonesia, 94/99 passes completed in Jakarta', color: 'emerald' },
    { id: 'nooa-laine',        verdict: 'MUST CALL', reason: '95% pass accuracy vs IDN, assist vs BAN, age 23 midfield general', color: 'emerald' },
    { id: 'brad-tapp',         verdict: 'MUST CALL', reason: '3 clean sheets, 94% pass accuracy, dominant aerial CB', color: 'emerald' },
    // KEEP
    { id: 'syihan-hazmi',      verdict: 'KEEP', reason: '2 starts, 2 clean sheets (0 conceded), 100% passes in Jakarta', color: 'blue' },
    { id: 'stuart-wilkin',     verdict: 'KEEP', reason: '1G 1A, relentless box-to-box engine, age 28', color: 'blue' },
    { id: 'corbin-ong',        verdict: 'KEEP', reason: 'Assist vs BAN, 15 duels won vs IDN, physical left-back authority', color: 'blue' },
    { id: 'manuel-hidalgo',    verdict: 'KEEP', reason: 'Assist vs SGP, creative half-space line-breaker, age 26', color: 'blue' },
    { id: 'quentin-cheng',     verdict: 'KEEP', reason: 'Started all 3 matches at RB, tireless stamina on right flank', color: 'blue' },
    // FRINGE / TRIAL BASIS
    { id: 'paulo-josue-fifa',  verdict: 'FRINGE', reason: '1G 1A in 29 mins vs SGP, clutch impact sub (age 37)', color: 'amber' },
    { id: 'syahir-bashah',     verdict: 'FRINGE', reason: '1 goal off bench in 18 mins vs SGP, energetic option', color: 'amber' },
    { id: 'daniel-ting',       verdict: 'FRINGE', reason: 'Assist in 90 mins vs SGP, solid defensive LB cover', color: 'amber' },
    { id: 'hong-wan',          verdict: 'FRINGE', reason: 'Assist in 23 mins vs SGP, disciplined pivot cover', color: 'amber' },
    { id: 'haziq-nadzli',      verdict: 'FRINGE', reason: 'Clean sheet in 3-0 win vs BAN, capable backup GK', color: 'amber' },
    { id: 'faisal-halim',      verdict: 'FRINGE', reason: '136 mins across 2 starts, working back to peak sharpness', color: 'amber' },
    // PHASE OUT / DROP
    { id: 'fergus-tierney',    verdict: 'PHASE OUT', reason: '129 mins across 3 games, 0 goals, yellow card risk', color: 'red' },
    { id: 'syahmi-safari',     verdict: 'PHASE OUT', reason: 'Only 18 mins across 2 cameos — fringe depth', color: 'red' },
    { id: 'harith-haikal',     verdict: 'PHASE OUT', reason: 'Limited to 29 mins cameo in closed out game', color: 'red' },
    { id: 'nazmi-faiz',        verdict: 'PHASE OUT', reason: '19 mins cameo, limited tactical upside vs youth', color: 'red' },
  ] : [
    // MUST CALL - young + impact
    { id: 'g-pavithran',       verdict: 'MUST CALL', reason: 'Most minutes (540), 1G 2A, age 21 — future cornerstone', color: 'emerald' },
    { id: 'ubaidullah-shamsul',verdict: 'MUST CALL', reason: 'Played every minute (540) at CB, age 22 — solid foundation', color: 'emerald' },
    { id: 'faris-danish',      verdict: 'MUST CALL', reason: '315 mins, regular LB starter, age 20 — key future left back', color: 'emerald' },
    { id: 'wan-kuzain',        verdict: 'MUST CALL', reason: 'Highest mid rating (7.62), 1G 1A in limited minutes, age 27', color: 'emerald' },
    { id: 'alif-ahmad',        verdict: 'MUST CALL', reason: '388 mins at RB, consistent performer, age 23', color: 'emerald' },
    // KEEP - proven regulars
    { id: 'azri-ghani',        verdict: 'KEEP', reason: 'Only GK to play all 6 matches (540 mins) — no replacement yet', color: 'blue' },
    { id: 'rodney-celvin',     verdict: 'KEEP', reason: '376 mins, experienced CB leadership, age 29 — 2–3 more cycles', color: 'blue' },
    { id: 'sergio-aguero',     verdict: 'KEEP', reason: 'CM engine, 425 mins, age 32 — useful bridge while youth develops', color: 'blue' },
    { id: 'ruventhiran',       verdict: 'KEEP', reason: 'Highest rated DEF (7.57), useful LB/CB cover, age 24', color: 'blue' },
    { id: 'daryl-sham',        verdict: 'KEEP', reason: 'Started all 6 games in midfield, reliable work-rate, age 23', color: 'blue' },
    // FRINGE - limited impact
    { id: 'jimmy-raymond',     verdict: 'FRINGE', reason: 'Only 147 mins (2 apps) at RB, age 30 — trial basis only', color: 'amber' },
    { id: 'aliff-haiqal',      verdict: 'FRINGE', reason: '181 mins, no goals/assists, age 26 — needs stronger showing', color: 'amber' },
    { id: 'ziad-el-basheer',   verdict: 'FRINGE', reason: 'Young (22) but only 100 mins in 2 apps — monitor in league', color: 'amber' },
    { id: 'sumareh',           verdict: 'FRINGE', reason: '429 mins but 0 goals, age 31 declining output — last chance', color: 'amber' },
    // PHASE OUT
    { id: 'paulo-josue',       verdict: 'PHASE OUT', reason: 'Age 37, top scorer but cannot build future around him', color: 'red' },
    { id: 'endrick',           verdict: 'PHASE OUT', reason: 'Age 31, only 145 mins in 2 apps — squad depth not required', color: 'red' },
    { id: 'syafiq-ahmad',      verdict: 'PHASE OUT', reason: 'Age 31, 372 mins but 0 goals or assists — replaced by youth', color: 'red' },
    { id: 'haqimi-azim',       verdict: 'PHASE OUT', reason: 'Age 23 but only 75 mins across 5 apps — never trusted to start', color: 'red' },
    { id: 'engku-nur-shakir',  verdict: 'PHASE OUT', reason: 'Age 27, 49 mins across 4 apps — no clear role in system', color: 'red' },
    { id: 'fazrul-amir',       verdict: 'PHASE OUT', reason: 'Age 26, 10 mins in 1 app — no meaningful contribution', color: 'red' },
  ];


  const mustCallPlayers  = callUpAnalysis.filter(c => c.verdict === 'MUST CALL').map(c => ({ ...c, player: players.find(p => p.id === c.id)! })).filter(c => c.player);
  const keepPlayers      = callUpAnalysis.filter(c => c.verdict === 'KEEP').map(c => ({ ...c, player: players.find(p => p.id === c.id)! })).filter(c => c.player);
  const fringePlayers    = callUpAnalysis.filter(c => c.verdict === 'FRINGE').map(c => ({ ...c, player: players.find(p => p.id === c.id)! })).filter(c => c.player);
  const phaseOutPlayers  = callUpAnalysis.filter(c => c.verdict === 'PHASE OUT').map(c => ({ ...c, player: players.find(p => p.id === c.id)! })).filter(c => c.player);

  // FIFA Calendar Dates 2026/2027
  const calendarWindows = [
    {
      date: 'Sept 21 – Oct 6, 2026',
      title: 'FIFA Matchday Window',
      type: 'International matches across all confederations',
      description: 'Up to 4 matches per national team. Double international window block for friendly fixtures and qualification tournaments.',
      active: true
    },
    {
      date: 'Nov 9 – 17, 2026',
      title: 'FIFA Matchday Window',
      type: 'International matches across all confederations',
      description: 'Up to 2 matches per national team. Concluding international window block of the calendar year.',
      active: false
    },
    {
      date: 'Mar 23 – 31, 2027',
      title: 'FIFA Matchday Window',
      type: 'International matches across all confederations',
      description: 'Up to 2 matches per national team. Opener international window block for the 2027 calendar year.',
      active: false
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Tournament Selection Header Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl flex-1 sm:flex-initial">
          {TOURNAMENTS.map(t => {
            const active = t.id === activeTournamentId;
            const isFifaTournament = t.id === 'fifa-asean-cup-2026';
            return (
              <button
                key={t.id}
                onClick={() => setActiveTournamentId(t.id)}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  active
                    ? isFifaTournament
                      ? 'bg-amber-400 text-zinc-950 shadow-md font-black'
                      : 'bg-emerald-400 text-zinc-950 shadow-md font-black'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>{t.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                  active ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {isFifaTournament ? 'FIFA' : 'AFF'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-3 py-1 text-xs text-zinc-400 font-medium">
          {currentTournament.sanction}
        </div>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black uppercase px-2 py-0.5 rounded tracking-wider ${
            isFifa ? 'bg-amber-400 text-zinc-950' : 'bg-emerald-400 text-zinc-950'
          }`}>
            {currentTournament.shortName}
          </span>
          <span className="bg-primary/20 text-primary text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
            {currentTournament.division} • Squad Projections
          </span>
        </div>
        <h1 className="text-2xl font-black flex items-center gap-2 mt-1">
          <Users className="h-6 w-6 text-primary" />
          <span>Harimau Malaya 23-Man Squad Selection</span>
        </h1>
        <p className="text-xs text-zinc-400">
          {isFifa 
            ? 'Tactical call-ups, Best XI projection, and squad analysis for Division 1 in Jakarta & Bandung (Group A vs Indonesia, Singapore, Bangladesh).'
            : 'Tactical call-ups, Best XI projection, and squad analysis for ASEAN Hyundai Cup Home & Away campaign (Group B vs Myanmar, Laos, Thailand, Philippines).'}
        </p>
      </div>

      {/* ======= TOURNAMENT CONCLUSION / CAMPAIGN FOCUS ======= */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-zinc-200 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            {currentTournament.name.toUpperCase()} — CAMPAIGN PROJECTIONS
          </h2>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            {isFifa
              ? 'Harimau Malaya squad selection under Tan Cheng Hoe · Group A (Indonesia 🇮🇩, Malaysia 🇲🇾, Singapore 🇸🇬, Bangladesh 🇧🇩)'
              : 'Harimau Malaya squad selection under Tan Cheng Hoe · Group B (Thailand 🇹🇭, Malaysia 🇲🇾, Myanmar 🇲🇲, Laos 🇱🇦, Philippines 🇵🇭)'}
          </p>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(isFifa ? [
            { label: 'Campaign Record', value: '3W 1D 0L', sub: 'Undefeated · 4 matches played', color: 'text-zinc-200' },
            { label: 'Goals Scored', value: '10 Goals', sub: 'Bergson 4, Arif 2, Wilkin, Tierney', color: 'text-emerald-400' },
            { label: 'Goals Conceded', value: '0 Goals', sub: '4 Clean Sheets (100% defense)', color: 'text-blue-400' },
            { label: 'Tournament Finish', value: '3rd Place 🥉', sub: 'Bronze Medal · GBK Jakarta', color: 'text-amber-400' },
          ] : [
            { label: 'Record', value: '3W 0D 3L', sub: '6 matches played', color: 'text-zinc-200' },
            { label: 'Goals Scored', value: '7', sub: 'Paulo Josué top scorer (3)', color: 'text-emerald-400' },
            { label: 'Goals Conceded', value: '7', sub: 'GD: 0 overall', color: 'text-red-400' },
            { label: 'Exit Stage', value: 'Semi-Final', sub: 'Agg. 0–4 vs Vietnam', color: 'text-amber-400' },
          ]).map(stat => (
            <div key={stat.label} className="glass-card rounded-xl p-4 border border-zinc-800 text-center">
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] font-black text-zinc-400 uppercase tracking-wide mt-0.5">{stat.label}</div>
              <div className="text-[8px] text-zinc-600 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Match Results Timeline */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider border-b border-zinc-900 pb-2">
            {isFifa ? 'FIFA ASEAN Cup Group Stage Matches & Knockout Path' : 'AFF Championship Campaign Timeline'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {(isFifa ? [
              { stage: 'Group · MD1', opp: 'Bangladesh', result: 'W', score: '3–0', note: '25 Sep · Si Jalak Harupat Bandung · Arif 2, Bergson 1' },
              { stage: 'Group · MD2', opp: 'Indonesia', result: 'D', score: '0–0', note: '28 Sep · GBK Jakarta · Dion Cools 8.9 MVP Shutout' },
              { stage: 'Group · MD3', opp: 'Singapore', result: 'W', score: '6–0', note: '01 Oct · Si Jalak Harupat Bandung · Bergson (3), Wilkin, Josué, Bashah' },
              { stage: '3rd Place Playoff', opp: 'Vietnam', result: 'W', score: '1–0', note: '05 Oct · GBK Jakarta · Fergus Tierney 62\' 🥉 Bronze' },
              { stage: 'Final Decider', opp: 'Indonesia vs Thailand', result: 'D', score: '2–2', note: '05 Oct · GBK Jakarta · Championship Final' },
            ] : [
              { stage: 'Group · MD1', opp: 'Myanmar', result: 'W', score: '2–1', note: 'Away win · Thuwunna Stadium' },
              { stage: 'Group · MD2', opp: 'Laos', result: 'W', score: '4–0', note: 'Home · Bukit Jalil · 4–0 rout' },
              { stage: 'Group · MD3', opp: 'Thailand', result: 'L', score: '0–2', note: 'Away · Rajamangala Stadium' },
              { stage: 'Group · MD4', opp: 'Philippines', result: 'W', score: '1–0', note: 'Crucial home win · Bukit Jalil' },
              { stage: 'SF Leg 1', opp: 'Vietnam', result: 'L', score: '0–2', note: 'Home defeat · Bukit Jalil' },
              { stage: 'SF Leg 2', opp: 'Vietnam', result: 'L', score: '0–2', note: 'Agg. 0–4 · Eliminated in Hanoi' },
            ]).map(m => (
              <div key={m.stage} className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                m.result === 'W' ? 'bg-emerald-500/5 border-emerald-500/15' :
                m.result === 'D' ? 'bg-blue-500/5 border-blue-500/15' :
                m.result === 'L' ? 'bg-red-500/5 border-red-500/15' :
                m.result === 'UP' ? 'bg-amber-500/5 border-amber-500/15' :
                'bg-zinc-900/40 border-zinc-850'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                  m.result === 'W' ? 'bg-emerald-500/20 text-emerald-400' :
                  m.result === 'D' ? 'bg-blue-500/20 text-blue-400' :
                  m.result === 'L' ? 'bg-red-500/20 text-red-400' :
                  m.result === 'UP' ? 'bg-amber-400/20 text-amber-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>{m.result}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-zinc-300 truncate">{m.opp}</span>
                    <span className="text-[9px] font-bold text-zinc-500 shrink-0">{m.score}</span>
                  </div>
                  <span className="text-[8px] text-zinc-600 block truncate">{m.stage} · {m.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths / Weaknesses / Tactical Suggestions / Verdict */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> WHAT WORKED
            </h4>
            <ul className="space-y-2 text-[9px] text-zinc-400 leading-relaxed">
              {isFifa ? (
                <>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Flawless defense: 0 goals conceded across all 4 matches (4 consecutive clean sheets)</li>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Bergson da Silva: 4 goals in 3 games including a 6–0 hat-trick vs Singapore</li>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Arif Aiman: 2 goals + 2 assists, 22 ground duels won on the right flank</li>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Dion Cools: Sofascore 8.9 MVP vs Indonesia with 94/99 (95%) pass completion</li>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Fergus Tierney: Clinical 62&apos; match-winner against Vietnam to clinch Bronze 🥉</li>
                </>
              ) : (
                <>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Group B dominance — 3 wins including a clinical 4–0 rout of Laos at home and a gutsy 2–1 away win over Myanmar</li>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Paulo Josué (518 mins, 3G) — top scorer and most experienced finisher in the squad</li>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Sergio Aguero anchored midfield 425 mins — controlled tempo reliably throughout</li>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Young CB core (Ubaidullah 540 mins, Rodney Celvin 376 mins, Alif Ahmad 388 mins) — consistent defensive platform</li>
                  <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Wan Kuzain: highest mid rating (7.62) despite limited mins — quality when deployed</li>
                </>
              )}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-black text-red-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Activity className="h-3.5 w-3.5" /> AREAS TO FIX
            </h4>
            <ul className="space-y-2 text-[9px] text-zinc-400 leading-relaxed">
              {isFifa ? (
                <>
                  <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Handling intense hostile crowds: Absorbed heavy wave vs Indonesia in 2nd half at GBK</li>
                  <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>First-half deadlock against deep defensive blocks before second-half breakthroughs</li>
                  <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Heavy reliance on Cools, Tapp, and Laine spine for initial vertical ball progression</li>
                  <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Wingback transition fatigue during equatorial heat in back-to-back tournament fixtures</li>
                </>
              ) : (
                <>
                  <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Conceded 4 goals across both SF legs — defensive shape collapsed under Vietnam&apos;s high press</li>
                  <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Over-reliance on Paulo Josué (age 37) for goals — no young clinical finisher to build around</li>
                  <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Sumareh (429 mins, 0G 0A) and Syafiq Ahmad (372 mins, 0G 0A) occupied attacking slots without output</li>
                  <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Zero midfield creativity — Daryl Sham (236 mins) and Aliff Haiqal (181 mins) offered no goals or assists</li>
                  <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Thailand loss (0–2) exposed inability to break compact defenses away from home</li>
                </>
              )}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Lightbulb className="h-3.5 w-3.5" /> SUGGESTION TACTICS
            </h4>
            <ul className="space-y-2 text-[9px] text-zinc-400 leading-relaxed">
              {isFifa ? (
                <>
                  <li className="flex gap-1.5"><span className="text-amber-400 font-black shrink-0">→</span><strong className="text-zinc-200">Double Pivot Progression:</strong> Station Nooa Laine (95% pass rate) with Stuart Wilkin to beat high pressing traps and protect Cools & Tapp.</li>
                  <li className="flex gap-1.5"><span className="text-amber-400 font-black shrink-0">→</span><strong className="text-zinc-200">Isolate Arif Aiman 1v1:</strong> Engineer right-side underlaps via Davies/Safari to isolate Arif (22 duels won) for low cutbacks into Bergson.</li>
                  <li className="flex gap-1.5"><span className="text-amber-400 font-black shrink-0">→</span><strong className="text-zinc-200">Second-Half Super Subs:</strong> Introduce Fergus Tierney (62&apos; winner vs Vietnam) and Paulo Josué at 60&apos; to exploit tiring backlines.</li>
                  <li className="flex gap-1.5"><span className="text-amber-400 font-black shrink-0">→</span><strong className="text-zinc-200">Compact Rest Defense:</strong> Maintain 20–25m spacing between backline and midfield to protect the 4-match 100% clean sheet record.</li>
                </>
              ) : (
                <>
                  <li className="flex gap-1.5"><span className="text-amber-400 font-black shrink-0">→</span><strong className="text-zinc-200">Phase Out Aging Core:</strong> Shift attacking focal points away from Paulo Josué (37) and Sumareh (31) toward younger domestic prospects.</li>
                  <li className="flex gap-1.5"><span className="text-amber-400 font-black shrink-0">→</span><strong className="text-zinc-200">Build Around Wan Kuzain:</strong> Deploy Wan Kuzain (7.62 rating) as primary creative midfield hub with Aguero to break low blocks.</li>
                  <li className="flex gap-1.5"><span className="text-amber-400 font-black shrink-0">→</span><strong className="text-zinc-200">Promote Youth Spine:</strong> Lock in Ubaidullah (540m, 22), Alif Ahmad (388m, 23), and G. Pavithran (540m, 1G 2A) as core starters.</li>
                  <li className="flex gap-1.5"><span className="text-amber-400 font-black shrink-0">→</span><strong className="text-zinc-200">Press-Resistant Shape:</strong> Drill 3-4-2-1 structure to prevent backline disconnect when facing intense opponent counter-pressing away.</li>
                </>
              )}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-black text-primary flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Award className="h-3.5 w-3.5" /> VERDICT
            </h4>
            <div className="space-y-2 text-[9px] text-zinc-400 leading-relaxed">
              {isFifa ? (
                <>
                  <p>Malaysia completed a stellar, <span className="text-zinc-200 font-bold">undefeated FIFA ASEAN Cup campaign (3W 1D 0L)</span>, capturing the <span className="text-amber-400 font-bold">Bronze Medal (3rd Place)</span> with a 1–0 triumph over Vietnam at Gelora Bung Karno.</p>
                  <p>Harimau Malaya maintained a <span className="text-emerald-400 font-bold">flawless defensive shutout</span>: 0 goals conceded across all 4 tournament matches (4 clean sheets), masterfully anchored by <span className="text-zinc-200 font-bold">Dion Cools</span> and <span className="text-zinc-200 font-bold">Brad Tapp</span>.</p>
                  <p>The forward line delivered lethal precision: <span className="text-zinc-200 font-bold">Bergson da Silva (4 goals)</span>, <span className="text-zinc-200 font-bold">Arif Aiman (2G 2A)</span>, and clutch match-winner <span className="text-zinc-200 font-bold">Fergus Tierney</span> proved Malaysia&apos;s elite attacking caliber.</p>
                  <p className="pt-1 border-t border-zinc-900 text-zinc-300 font-bold">Key takeaway: The world-class spine of Cools, Tapp, Laine, Arif, and Bergson establishes the tactical blueprint for AFC Asian Cup qualification.</p>
                </>
              ) : (
                <>
                  <p>Malaysia reached the <span className="text-zinc-200 font-bold">Semifinal</span> with 3 wins in Group B — a decent campaign that exposes deeper structural issues heading into 2027.</p>
                  <p>The team <span className="text-zinc-200 font-bold">lacks a clinical striker under 30</span> and is still dependent on ageing foreign-eligible players like Paulo Josué (37) and Sumareh (31) for attacking output.</p>
                  <p>The silver lining: a <span className="text-emerald-400 font-bold">young defensive core</span> (Ubaidullah 22, Alif Ahmad 23, Rodney Celvin) and productive midfielder <span className="text-emerald-400 font-bold">Wan Kuzain</span> (7.62 avg rating) who should start every game when fit.</p>
                  <p className="pt-1 border-t border-zinc-900 text-zinc-300 font-bold">Next target: Build domestic striker pipeline and reduce dependency on ageing imports ahead of the 2027 AFF cycle.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* ======= END CONCLUSION ======= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pitch View of Best XI */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-primary" />
                <span>{isFifa ? 'FIFA ASEAN CUP BEST XI (MAS)' : 'AFF TOURNAMENT BEST XI (MAS)'}</span>
              </h3>
              <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary font-black px-2.5 py-0.5 rounded-full uppercase">
                4-3-3 Formation
              </span>
            </div>

            {/* Visual Pitch */}
            <div 
              className="relative w-full aspect-3/4 rounded-xl overflow-hidden border border-zinc-855 select-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, #0c311e 0%, #041f15 70%, #020f0a 100%)' }}
            >
              {/* Pitch Markings */}
              <div className="absolute inset-0 border border-zinc-700/20 m-3 pointer-events-none rounded-lg" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1/3 aspect-1/2 border-b border-x border-zinc-700/20" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/3 aspect-1/2 border-t border-x border-zinc-700/20" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 aspect-1/2 border-b border-x border-zinc-700/20" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 aspect-1/2 border-t border-x border-zinc-700/20" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-700/20 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border border-zinc-700/20 -translate-x-1/2 -translate-y-1/2" />

              {/* Render Players */}
              {bestXI.map((player) => (
                <div 
                  key={player.id}
                  className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${player.x}%`, top: `${player.y}%` }}
                >
                  <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                    <div className="w-full h-full rounded-full bg-zinc-950/90 border-2 border-primary flex items-center justify-center font-black text-xs text-primary shadow-lg overflow-hidden">
                      {player.photo ? (
                        <img 
                          src={player.photo} 
                          alt={player.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { 
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = parent.querySelector('.fallback-number');
                              if (fallback) (fallback as HTMLElement).style.display = 'block';
                            }
                          }} 
                        />
                      ) : null}
                      <span 
                        className="fallback-number font-black" 
                        style={{ display: player.photo ? 'none' : 'block' }}
                      >
                        {player.number}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-zinc-900 px-1 py-0.5 rounded border border-zinc-850 text-[6.5px] font-black text-zinc-350 z-10 shadow">
                      {player.rating.toFixed(1)}
                    </div>
                  </div>
                  <span className="bg-zinc-950/80 border border-zinc-850 px-1.5 py-0.5 rounded-md text-[8.5px] font-bold text-zinc-200 mt-1 shadow whitespace-nowrap">
                    {player.name.split(' ').slice(-1)[0]}
                  </span>
                  <span className="text-[6.5px] font-black uppercase text-zinc-550 tracking-wider">
                    {player.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call-Up Analysis Panel */}
        <div className="space-y-4">

          {/* Header */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800">
            <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-1.5 mb-1">
              <UserCheck className="h-4 w-4 text-primary" />
              <span>NEXT CALL-UP ANALYSIS</span>
            </h3>
            <p className="text-[9px] text-zinc-500">Based on impact score: rating (40%) + minutes (40%) + appearances (20%)</p>
          </div>

          {/* Must Call */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="font-bold text-xs text-emerald-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              MUST CALL UP
            </h4>
            <div className="space-y-2">
              {mustCallPlayers.map(({ id, reason, player }) => (
                <div key={id} className="flex items-start gap-2 p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-500/30 shrink-0 bg-zinc-900 flex items-center justify-center">
                    {player.photo
                      ? <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                      : <span className="text-[8px] font-black text-emerald-400">{player.number}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black text-zinc-200 truncate">{player.name}</span>
                      <span className="text-[8px] font-black text-emerald-400 shrink-0">{player.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-[8px] text-zinc-500 leading-tight block">{reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keep */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="font-bold text-xs text-blue-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Star className="h-3.5 w-3.5" />
              KEEP IN SQUAD
            </h4>
            <div className="space-y-2">
              {keepPlayers.map(({ id, reason, player }) => (
                <div key={id} className="flex items-start gap-2 p-2 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-blue-500/30 shrink-0 bg-zinc-900 flex items-center justify-center">
                    {player.photo
                      ? <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                      : <span className="text-[8px] font-black text-blue-400">{player.number}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black text-zinc-200 truncate">{player.name}</span>
                      <span className="text-[8px] font-black text-blue-400 shrink-0">{player.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-[8px] text-zinc-500 leading-tight block">{reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fringe */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="font-bold text-xs text-amber-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Activity className="h-3.5 w-3.5" />
              FRINGE / TRIAL BASIS
            </h4>
            <div className="space-y-2">
              {fringePlayers.map(({ id, reason, player }) => (
                <div key={id} className="flex items-start gap-2 p-2 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-500/30 shrink-0 bg-zinc-900 flex items-center justify-center">
                    {player.photo
                      ? <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                      : <span className="text-[8px] font-black text-amber-400">{player.number}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black text-zinc-400 truncate">{player.name}</span>
                      <span className="text-[8px] font-black text-amber-400 shrink-0">{player.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-[8px] text-zinc-500 leading-tight block">{reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase Out */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="font-bold text-xs text-red-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              PHASE OUT / DROP
            </h4>
            <div className="space-y-2">
              {phaseOutPlayers.map(({ id, reason, player }) => (
                <div key={id} className="flex items-start gap-2 p-2 rounded-xl bg-red-500/5 border border-red-500/15">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-red-500/20 shrink-0 bg-zinc-900 flex items-center justify-center opacity-60">
                    {player.photo
                      ? <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                      : <span className="text-[8px] font-black text-red-400">{player.number}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black text-zinc-500 truncate line-through">{player.name}</span>
                      <span className="text-[8px] font-black text-red-400 shrink-0 no-underline" style={{textDecoration:'none'}}>{player.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-[8px] text-zinc-600 leading-tight block">{reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FIFA Calendar Section */}
      <section className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-4">
        <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2 flex items-center gap-1.5">
          <Calendar className="h-4.5 w-4.5 text-primary" />
          <span>FIFA INTERNATIONAL CALENDAR (ROAD TO 2027)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {calendarWindows.map((win, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-colors ${
                win.active 
                  ? 'bg-primary/5 border-primary/30' 
                  : 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-800'
              }`}
            >
              <div>
                <span className="text-[9px] text-primary font-black uppercase tracking-wider block mb-1">
                  {win.date}
                </span>
                <h4 className="text-sm font-black text-zinc-100">{win.title}</h4>
                <span className="text-[10px] text-zinc-450 font-semibold italic mt-0.5 block">
                  {win.type}
                </span>
                <p className="text-[11px] text-zinc-450 leading-relaxed mt-2">
                  {win.description}
                </p>
              </div>
              
              <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[9px] text-zinc-500">
                <span>FIFA Window</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
