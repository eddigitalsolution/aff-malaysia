'use client';

import React, { useEffect, useState } from 'react';
import { getStandings, getTeams, Team } from '@/lib/api';
import { Trophy, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

export default function StandingsPage() {
  const [standings, setStandings] = useState<any>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function loadData() {
      const s = await getStandings();
      const t = await getTeams();
      setStandings(s);
      setTeams(t);
    }
    loadData();
  }, []);

  if (!standings) {
    return <div className="text-zinc-500 py-12 text-center">Loading standings...</div>;
  }

  const renderFormCircle = (outcome: string) => {
    switch (outcome) {
      case 'W':
        return <span title="Win"><CheckCircle className="h-4.5 w-4.5 text-emerald-400 fill-emerald-950" /></span>;
      case 'L':
        return <span title="Loss"><XCircle className="h-4.5 w-4.5 text-red-400 fill-red-950" /></span>;
      default:
        return <span title="Draw"><MinusCircle className="h-4.5 w-4.5 text-zinc-400 fill-zinc-900" /></span>;
    }
  };

  const groupData = standings.B;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span>Group B Standings</span>
          </h1>
          <p className="text-xs text-zinc-400">Current standings and qualification status for Group B.</p>
        </div>
      </div>

      {/* Standings Table Card */}
      <div className="glass-card rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/40 border-b border-zinc-800/80 text-zinc-400 text-xs font-bold uppercase whitespace-nowrap">
                <th className="py-4 px-4 text-center w-12">Pos</th>
                <th className="py-4 px-4">Team</th>
                <th className="py-4 px-3 text-center">P</th>
                <th className="py-4 px-3 text-center">W</th>
                <th className="py-4 px-3 text-center">D</th>
                <th className="py-4 px-3 text-center">L</th>
                <th className="py-4 px-3 text-center">GF</th>
                <th className="py-4 px-3 text-center hidden sm:table-cell">GA</th>
                <th className="py-4 px-3 text-center hidden sm:table-cell">GD</th>
                <th className="py-4 px-4 text-center">Pts</th>
                <th className="py-4 px-4 text-center w-36 hidden md:table-cell">Form</th>
                <th className="py-4 px-4 text-center hidden md:table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {groupData.map((row: any) => {
                const team = teams.find(t => t.id === row.teamId);
                const isFeatured = row.teamId === 'malaysia';
                return (
                  <tr 
                    key={row.teamId}
                    className={`border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-colors whitespace-nowrap ${
                      isFeatured ? 'bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-center font-bold text-zinc-300">{row.position}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="min-w-0">
                          <div className="font-extrabold text-zinc-100 flex items-center gap-1.5 truncate">
                            {team?.name}
                            {isFeatured && (
                              <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                FOCUS
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center text-zinc-300 font-medium">{row.played}</td>
                    <td className="py-4 px-3 text-center text-zinc-400">{row.wins}</td>
                    <td className="py-4 px-3 text-center text-zinc-400">{row.draws}</td>
                    <td className="py-4 px-3 text-center text-zinc-400">{row.losses}</td>
                    <td className="py-4 px-3 text-center text-zinc-500">{row.goalsFor}</td>
                    <td className="py-4 px-3 text-center text-zinc-500 hidden sm:table-cell">{row.goalsAgainst}</td>
                    <td className="py-4 px-3 text-center text-zinc-300 font-bold hidden sm:table-cell">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                    <td className="py-4 px-4 text-center font-black text-primary text-base">{row.points}</td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex justify-center items-center gap-1.5">
                        {row.recentForm.map((outcome: string, idx: number) => (
                          <span key={idx}>{renderFormCircle(outcome)}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center hidden md:table-cell">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        row.qualificationStatus === 'Qualified'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : row.qualificationStatus === 'Eliminated'
                            ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                            : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                      }`}>
                        {row.qualificationStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Below standings: Last Matches + Semifinal Scenarios */}
      <div className="space-y-4">
 
        {/* Last Match Results */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-4 sm:p-5 space-y-3">
          <h2 className="text-sm font-black text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 inline-block" /> Last Matchday Results
          </h2>
          <div className="space-y-2">
            {[
              { date: 'Aug 20, 2026', home: '🇻🇳 Vietnam', score: '2 – 0', away: '🇲🇾 Malaysia', homeWin: true },
              { date: 'Aug 19, 2026', home: '🇹🇭 Thailand', score: '1 – 2', away: '🇸🇬 Singapore', homeWin: false },
              { date: 'Aug 16, 2026', home: '🇲🇾 Malaysia', score: '0 – 2', away: '🇻🇳 Vietnam', homeWin: false },
              { date: 'Aug 15, 2026', home: '🇸🇬 Singapore', score: '1 – 3', away: '🇹🇭 Thailand', homeWin: false },
              { date: 'Aug 8, 2026', home: '🇲🇾 Malaysia', score: '1 – 0', away: '🇵🇭 Philippines', homeWin: true },
              { date: 'Aug 8, 2026', home: '🇹🇭 Thailand', score: '2 – 0', away: '🇲🇲 Myanmar', homeWin: true },
              { date: 'Aug 4, 2026', home: '🇲🇲 Myanmar', score: '7 – 2', away: '🇱🇦 Laos', homeWin: true },
              { date: 'Aug 4, 2026', home: '🇵🇭 Philippines', score: '0 – 1', away: '🇹🇭 Thailand', homeWin: false },
              { date: 'Aug 1, 2026', home: '🇹🇭 Thailand', score: '2 – 0', away: '🇲🇾 Malaysia', homeWin: true },
              { date: 'Aug 1, 2026', home: '🇱🇦 Laos', score: '1 – 4', away: '🇵🇭 Philippines', homeWin: false },
            ].map((m, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between text-xs bg-zinc-900/40 rounded-xl px-4 py-2.5 border border-zinc-800/60 gap-2">
                <span className="text-zinc-500 w-28 shrink-0 text-center sm:text-left">{m.date}</span>
                <div className="flex items-center justify-between flex-1 gap-2">
                  <span className={`font-bold flex-1 text-right truncate ${m.homeWin ? 'text-zinc-100' : 'text-zinc-400'}`}>{m.home}</span>
                  <span className="font-black text-primary bg-zinc-950 border border-zinc-800 px-3 py-0.5 rounded-lg shrink-0 tabular-nums">{m.score}</span>
                  <span className={`font-bold flex-1 text-left truncate ${!m.homeWin ? 'text-zinc-100' : 'text-zinc-400'}`}>{m.away}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semifinal Qualification Summary */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-4">
          <div>
            <h2 className="text-sm font-black text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" /> Semifinals Concluded
            </h2>
            <p className="text-[11px] text-zinc-500 mt-1">Semifinals Concluded · Vietnam and Thailand advance to the final</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-zinc-100">🇹🇭 Thailand</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Advanced · Agg: 4-3</span>
              </div>
              <p className="text-[11.5px] text-zinc-400 leading-normal">
                Defeated Singapore 4-3 on aggregate (3-1 away, 1-2 home) to secure their spot in the final.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-zinc-100">🇻🇳 Vietnam</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Advanced · Agg: 4-0</span>
              </div>
              <p className="text-[11.5px] text-zinc-400 leading-normal">
                Defeated Malaysia 2-0 in both legs to secure a spot in the final.
              </p>
            </div>
          </div>

          {/* Semifinal Matchups */}
          <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2.5">
            <div className="text-[9px] font-black text-primary uppercase tracking-wider">🗓️ Semifinals — Leg 1 Results</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl px-4 py-3 text-center space-y-1">
                <div className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Aug 15, 2026 · Singapore National Stadium</div>
                <div className="text-xs font-black text-zinc-200">🇸🇬 Singapore <span className="text-primary font-black mx-1.5">1 – 3</span> 🇹🇭 Thailand</div>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl px-4 py-3 text-center space-y-1">
                <div className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Aug 16, 2026 · KL City Cheras Stadium</div>
                <div className="text-xs font-black text-zinc-200">🇲🇾 Malaysia <span className="text-primary font-black mx-1.5">0 – 2</span> 🇻🇳 Vietnam</div>
              </div>
            </div>
            
            <div className="text-[9px] font-black text-primary uppercase tracking-wider pt-2">🗓️ Semifinals — Leg 2 Results</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl px-4 py-3 text-center space-y-1">
                <div className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Aug 19, 2026 · Rajamangala Stadium</div>
                <div className="text-xs font-black text-zinc-200">🇹🇭 Thailand <span className="text-primary font-black mx-1.5">1 – 2</span> 🇸🇬 Singapore</div>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl px-4 py-3 text-center space-y-1">
                <div className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Aug 20, 2026 · My Dinh National Stadium</div>
                <div className="text-xs font-black text-zinc-200">🇻🇳 Vietnam <span className="text-primary font-black mx-1.5">2 – 0</span> 🇲🇾 Malaysia</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 rounded-xl p-3 border border-zinc-800/60 text-center">
            <p className="text-xs text-zinc-400">
              ❌ <strong className="text-zinc-300">Eliminated:</strong> Myanmar (6 pts), Philippines (3 pts), Laos (0 pts)
            </p>
          </div>

          <p className="text-[10px] text-zinc-600 text-center">* Tie-breaker order: 1. Head-to-Head record · 2. Goal Difference · 3. Goals Scored</p>
        </div>
      </div>
    </div>
  );
}
