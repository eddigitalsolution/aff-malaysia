'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlayers, Player } from '@/lib/api';
import { Users, Award, Calendar, Sparkles, Star, ChevronRight, Activity, ShieldCheck, ArrowRightLeft, UserCheck } from 'lucide-react';

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
  const [players, setPlayers] = useState<Player[]>([]);
  const [bestXI, setBestXI] = useState<PitchPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const allPlayers = await getPlayers();
      const malPlayers = allPlayers.filter(p => p.teamId === 'malaysia');
      setPlayers(malPlayers);

      // Generate best XI dynamically based on rating and position
      // Simple custom selection logic for 4-3-3 formation:
      // GK: 1, DEF: 4, MID: 3, FWD: 3
      // Filter players who contributed significantly (appearances >= 3) to represent the core tournament squad
      const activePlayers = malPlayers.filter(p => (p.appearances || 0) >= 3);

      const gks = activePlayers.filter(p => p.position === 'Goalkeeper').sort((a, b) => b.averageRating - a.averageRating);
      const defs = activePlayers.filter(p => p.position === 'Defender');
      const mids = activePlayers.filter(p => p.position === 'Midfielder').sort((a, b) => {
        // Composite: 50% rating + 25% mins + 15% apps + 10% goal contributions (G+A)
        const gcA = ((a.goals || 0) + (a.assists || 0)) * 6;
        const gcB = ((b.goals || 0) + (b.assists || 0)) * 6;
        const scoreA = (a.averageRating * 0.5) + ((a.minutes || 0) / 10 * 0.25) + ((a.appearances || 0) * 2 * 0.15) + (gcA * 0.1);
        const scoreB = (b.averageRating * 0.5) + ((b.minutes || 0) / 10 * 0.25) + ((b.appearances || 0) * 2 * 0.15) + (gcB * 0.1);
        return scoreB - scoreA;
      });
      const fwds = activePlayers.filter(p => p.position === 'Forward').sort((a, b) => b.averageRating - a.averageRating);

      // Define role-specific defender arrays to ensure players play in their actual positions
      const lbs = defs.filter(p => p.id === 'ruventhiran' || p.id === 'faris-danish');
      const rbs = defs.filter(p => p.id === 'jimmy-raymond' || p.id === 'alif-ahmad');
      const cbs = defs.filter(p => p.id === 'rodney-celvin' || p.id === 'aysar-hadi' || p.id === 'ubaidullah-shamsul');

      lbs.sort((a, b) => (b.minutes || 0) - (a.minutes || 0));
      rbs.sort((a, b) => b.averageRating - a.averageRating);
      cbs.sort((a, b) => b.averageRating - a.averageRating);

      const selection: PitchPlayer[] = [];

      // 1 GK
      if (gks[0]) selection.push({ ...gks[0], role: 'GK', x: 50, y: 88, rating: gks[0].averageRating });

      // 4 DEFs placed correctly by their positions
      if (lbs[0]) selection.push({ ...lbs[0], role: 'LB', x: 15, y: 68, rating: lbs[0].averageRating });
      if (cbs[0]) selection.push({ ...cbs[0], role: 'LCB', x: 35, y: 70, rating: cbs[0].averageRating });
      if (cbs[1]) selection.push({ ...cbs[1], role: 'RCB', x: 65, y: 70, rating: cbs[1].averageRating });
      if (rbs[0]) selection.push({ ...rbs[0], role: 'RB', x: 85, y: 68, rating: rbs[0].averageRating });

      // 3 MIDs
      if (mids[0]) selection.push({ ...mids[0], role: 'LCM', x: 30, y: 46, rating: mids[0].averageRating });
      if (mids[1]) selection.push({ ...mids[1], role: 'CM', x: 50, y: 52, rating: mids[1].averageRating });
      if (mids[2]) selection.push({ ...mids[2], role: 'RCM', x: 70, y: 46, rating: mids[2].averageRating });

      // 3 FWDs
      if (fwds[0]) selection.push({ ...fwds[0], role: 'ST', x: 50, y: 18, rating: fwds[0].averageRating });
      if (fwds[1]) selection.push({ ...fwds[1], role: 'LW', x: 20, y: 22, rating: fwds[1].averageRating });
      if (fwds[2]) selection.push({ ...fwds[2], role: 'RW', x: 80, y: 22, rating: fwds[2].averageRating });

      setBestXI(selection);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center">Loading selection projections...</div>;
  }

  // Full squad call-up analysis
  const callUpAnalysis = [
    // MUST CALL - young + impact
    { id: 'g-pavithran',       verdict: 'MUST CALL', reason: 'Most minutes (540), 1G 2A, age 21 — future cornerstone', color: 'emerald' },
    { id: 'ubaidullah-shamsul',verdict: 'MUST CALL', reason: 'Played every minute (540) at CB, age 22 — solid foundation', color: 'emerald' },
    { id: 'faris-danish',      verdict: 'MUST CALL', reason: '315 mins, regular LB starter, age 20 — key future left back', color: 'emerald' },
    { id: 'aysar-hadi',        verdict: 'MUST CALL', reason: 'High-rated CB cover (7.3), age 22 — ready for starting role', color: 'emerald' },
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

  const callUpMap = new Map(callUpAnalysis.map(c => [c.id, c]));

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <span>Squad Selection & Projections</span>
        </h1>
        <p className="text-xs text-zinc-400">Post-AFF tournament review, Best XI statistics, future squad recommendations, and FIFA Calendar schedules.</p>
      </div>
      {/* ======= TOURNAMENT CONCLUSION ======= */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-zinc-200 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AFF ASEAN CUP 2026 — TOURNAMENT CONCLUSION
          </h2>
          <p className="text-[10px] text-zinc-500 mt-0.5">Harimau Malaya full campaign post-mortem · Group B → Semifinal exit</p>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Record', value: '3W 0D 3L', sub: '6 matches played', color: 'text-zinc-200' },
            { label: 'Goals Scored', value: '7', sub: 'Paulo Josué top scorer (3)', color: 'text-emerald-400' },
            { label: 'Goals Conceded', value: '7', sub: 'GD: 0 overall', color: 'text-red-400' },
            { label: 'Exit Stage', value: 'Semifinal', sub: 'Agg. 0–4 vs Vietnam', color: 'text-amber-400' },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-xl p-4 border border-zinc-800 text-center">
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] font-black text-zinc-400 uppercase tracking-wide mt-0.5">{stat.label}</div>
              <div className="text-[8px] text-zinc-600 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Match Results Timeline */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider border-b border-zinc-900 pb-2">Campaign Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { stage: 'Group · MD1', opp: 'Myanmar', result: 'W', score: '2–1', note: 'Away win — Paulo Josué brace' },
              { stage: 'Group · MD2', opp: 'Laos', result: 'W', score: '4–0', note: 'Dominant home performance' },
              { stage: 'Group · MD3', opp: 'Thailand', result: 'L', score: '0–2', note: 'Shut out by Chanathip-led side' },
              { stage: 'Group · MD4', opp: 'Philippines', result: 'W', score: '1–0', note: 'Narrow but crucial win to advance' },
              { stage: 'SF Leg 1', opp: 'Vietnam', result: 'L', score: '0–2', note: 'Defensive collapse at home' },
              { stage: 'SF Leg 2', opp: 'Vietnam', result: 'L', score: '0–2', note: 'Agg. 0–4. Eliminated in Hanoi' },
            ].map(m => (
              <div key={m.stage} className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                m.result === 'W' ? 'bg-emerald-500/5 border-emerald-500/15' :
                m.result === 'L' ? 'bg-red-500/5 border-red-500/15' :
                'bg-zinc-900/40 border-zinc-850'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                  m.result === 'W' ? 'bg-emerald-500/20 text-emerald-400' :
                  m.result === 'L' ? 'bg-red-500/20 text-red-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>{m.result}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-zinc-300">{m.opp}</span>
                    <span className="text-[9px] font-bold text-zinc-500">{m.score}</span>
                  </div>
                  <span className="text-[8px] text-zinc-600 block truncate">{m.stage} · {m.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths / Weaknesses / Verdict */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> WHAT WORKED
            </h4>
            <ul className="space-y-2 text-[9px] text-zinc-400 leading-relaxed">
              <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Group stage dominance — 3 wins including a 4–0 thrashing of Laos</li>
              <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>G. Pavithran (540 mins, 1G 2A) — best forward in the squad, played every minute</li>
              <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Sergio Aguero anchored midfield 425 mins — controlled tempo reliably</li>
              <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Young CB core (Ubaidullah, Faris Danish, Aysar Hadi) showed clear potential</li>
              <li className="flex gap-1.5"><span className="text-emerald-400 font-black shrink-0">→</span>Wan Kuzain: highest rating (7.62) despite limited mins — quality when fit</li>
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-black text-red-400 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Activity className="h-3.5 w-3.5" /> AREAS TO FIX
            </h4>
            <ul className="space-y-2 text-[9px] text-zinc-400 leading-relaxed">
              <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Conceded 4 goals in both SF legs — defensive shape collapsed vs high press</li>
              <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Over-reliance on Paulo Josué (age 37) for goals — no backup striker depth</li>
              <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Zero creative output from midfield in group stage — CM/DM positions barren</li>
              <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>No Plan B when Rodney Celvin was injured — Aysar Hadi thrown in cold</li>
              <li className="flex gap-1.5"><span className="text-red-400 font-black shrink-0">→</span>Sumareh (429 mins, 0G 0A) occupied winger slot without offensive returns</li>
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-black text-primary flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Award className="h-3.5 w-3.5" /> VERDICT
            </h4>
            <div className="space-y-2 text-[9px] text-zinc-400 leading-relaxed">
              <p>Malaysia reached the <span className="text-zinc-200 font-bold">Semifinal</span> for the second consecutive edition — a positive result that masks deeper structural issues.</p>
              <p>The team <span className="text-zinc-200 font-bold">lacks a clinical striker under 30</span> and is too dependent on ageing foreign-eligible players for goals.</p>
              <p>The silver lining: a <span className="text-emerald-400 font-bold">clear young defensive spine</span> (Faris Danish, Ubaidullah, Aysar Hadi) and a world-class prospect in <span className="text-emerald-400 font-bold">G. Pavithran</span> aged just 21.</p>
              <p className="pt-1 border-t border-zinc-900 text-zinc-300 font-bold">Next target: Blood in youth through the Sept–Nov 2026 FIFA windows and build toward AFC Asian Cup qualification.</p>
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
                <span>AFF TOURNAMENT BEST XI (MAS)</span>
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
