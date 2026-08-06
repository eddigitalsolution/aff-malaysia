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
              { date: 'Aug 4, 2026', home: '🇲🇲 Myanmar', score: '7 – 2', away: '🇱🇦 Laos', homeWin: true },
              { date: 'Aug 4, 2026', home: '🇵🇭 Philippines', score: '0 – 1', away: '🇹🇭 Thailand', homeWin: false },
              { date: 'Aug 1, 2026', home: '🇹🇭 Thailand', score: '2 – 0', away: '🇲🇾 Malaysia', homeWin: true },
              { date: 'Aug 1, 2026', home: '🇱🇦 Laos', score: '1 – 4', away: '🇵🇭 Philippines', homeWin: false },
              { date: 'Jul 28, 2026', home: '🇲🇾 Malaysia', score: '4 – 0', away: '🇱🇦 Laos', homeWin: true },
              { date: 'Jul 25, 2026', home: '🇲🇲 Myanmar', score: '1 – 2', away: '🇲🇾 Malaysia', homeWin: false },
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

        {/* Semifinal Qualification Scenarios */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-4">
          <div>
            <h2 className="text-sm font-black text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Semifinal Qualification Scenarios
            </h2>
            <p className="text-[11px] text-zinc-500 mt-1">Matchday 5 — Aug 8, 2026 · Top 2 teams qualify for semi-finals</p>
          </div>

          {/* Upcoming Matches MD5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { home: '🇲🇾 Malaysia', away: '🇵🇭 Philippines', venue: 'KL City Cheras Stadium' },
              { home: '🇹🇭 Thailand', away: '🇲🇲 Myanmar', venue: 'Bangkok' },
            ].map((m, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-center space-y-1">
                <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{m.venue}</div>
                <div className="text-xs font-black text-zinc-200">{m.home} <span className="text-zinc-600">vs</span> {m.away}</div>
              </div>
            ))}
          </div>

          {/* Scenarios */}
          <div className="space-y-2">
            {[
              {
                team: '🇲🇾 Malaysia',
                pts: '6 pts',
                color: 'primary',
                badge: 'bg-primary/10 border-primary/30 text-primary',
                scenarios: [
                  { result: 'WIN', detail: 'Qualifies if Myanmar draws or loses vs Thailand. 3-way 9-pt tie if Myanmar wins — needs large margin.', color: 'text-emerald-400' },
                  { result: 'DRAW', detail: 'Qualifies ONLY if Myanmar loses to Thailand.', color: 'text-yellow-400' },
                  { result: 'LOSE', detail: 'Virtually eliminated. Would need massive goal swing.', color: 'text-red-400' },
                ],
              },
              {
                team: '🇹🇭 Thailand',
                pts: '9 pts',
                color: 'emerald',
                badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                scenarios: [
                  { result: 'WIN or DRAW', detail: 'Qualifies as Group B winners — already effectively through.', color: 'text-emerald-400' },
                  { result: 'LOSE', detail: 'Stays qualified unless massive 3-way scenario (very unlikely).', color: 'text-yellow-400' },
                ],
              },
              {
                team: '🇲🇲 Myanmar',
                pts: '6 pts',
                color: 'blue',
                badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
                scenarios: [
                  { result: 'WIN vs Thailand', detail: 'Reaches 9 pts. Qualifies if Malaysia doesn\'t win by a large margin.', color: 'text-emerald-400' },
                  { result: 'DRAW', detail: 'Reaches 7 pts. Qualifies ONLY if Malaysia loses.', color: 'text-yellow-400' },
                  { result: 'LOSE', detail: 'Falls to 6 pts, 3rd at best on head-to-head. Eliminated.', color: 'text-red-400' },
                ],
              },
            ].map((team, i) => (
              <div key={i} className={`rounded-xl border p-4 space-y-2 ${team.badge} bg-opacity-10`} style={{ borderColor: undefined }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-zinc-100">{team.team}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${team.badge}`}>{team.pts}</span>
                </div>
                <div className="space-y-1">
                  {team.scenarios.map((s, j) => (
                    <div key={j} className="flex items-start gap-2 text-[11px]">
                      <span className={`font-black shrink-0 w-20 ${s.color}`}>{s.result}</span>
                      <span className="text-zinc-400">{s.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-zinc-600 text-center">* Tie-breaker order: 1. Head-to-Head record · 2. Goal Difference · 3. Goals Scored</p>
        </div>
      </div>
    </div>
  );
}
