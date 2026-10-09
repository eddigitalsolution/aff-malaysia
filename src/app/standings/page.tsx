'use client';

import React, { useEffect, useState } from 'react';
import { getStandings, getTeams, TOURNAMENTS, Team, TournamentStandings, StandingRow } from '@/lib/api';
import { useAppState } from '@/store';
import { CheckCircle, XCircle, MinusCircle, Trophy, ShieldCheck } from 'lucide-react';

export default function StandingsPage() {
  const { activeTournamentId, setActiveTournamentId } = useAppState();
  const [standings, setStandings] = useState<TournamentStandings | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeGroup, setActiveGroup] = useState<'A' | 'B'>('A');

  const currentTournament = TOURNAMENTS.find(t => t.id === activeTournamentId) || TOURNAMENTS[0];
  const isFifa = activeTournamentId === 'fifa-asean-cup-2026';

  const malaysiaGroup = isFifa ? 'A' : 'B';

  useEffect(() => {
    async function loadData() {
      const s = await getStandings(activeTournamentId);
      const t = await getTeams(activeTournamentId);
      setStandings(s);
      setTeams(t);
      setActiveGroup(activeTournamentId === 'aff-cup-2026' ? 'B' : 'A');
    }
    loadData();
  }, [activeTournamentId]);

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

  const groupData: StandingRow[] = standings[activeGroup] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
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

        <div className="px-3 py-1 flex items-center gap-2 text-xs text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="font-medium text-[11px]">{currentTournament.sanction}</span>
        </div>
      </div>

      {/* Tournament Details Banner */}
      <div className={`p-5 sm:p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden ${
        isFifa 
          ? 'bg-linear-to-r from-amber-500/10 via-zinc-900/90 to-zinc-900/60 border-amber-500/30' 
          : 'bg-linear-to-r from-emerald-500/10 via-zinc-900/90 to-zinc-900/60 border-emerald-500/30'
      }`}>
        <div className="z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
              isFifa ? 'bg-amber-400 text-zinc-950' : 'bg-emerald-400 text-zinc-950'
            }`}>
              {currentTournament.shortName}
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {currentTournament.division}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{currentTournament.name} Standings</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Host: {currentTournament.host} • Dates: {currentTournament.dates}
          </p>
        </div>

        {/* Group Selector Tabs */}
        {!isFifa ? (
          <div className="flex bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl gap-1.5 z-10 self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setActiveGroup('A')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeGroup === 'A'
                  ? 'bg-emerald-400 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Group A</span>
            </button>
            <button
              onClick={() => setActiveGroup('B')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeGroup === 'B'
                  ? 'bg-emerald-400 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Group B (Malaysia 🇲🇾)</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-zinc-950 border border-amber-400/30 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-400 shadow-sm self-stretch sm:self-auto justify-center">
            <span>Group A (Malaysia 🇲🇾)</span>
          </div>
        )}
      </div>

      {/* Standings Table Card */}
      <div className="glass-card rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-bold text-zinc-300">
            {isFifa 
              ? `Jadual Kedudukan Kumpulan A • ${currentTournament.name}`
              : `Jadual Kedudukan Kumpulan ${activeGroup} • ${currentTournament.name}`
            }
          </span>
          <span className="text-[11px] text-zinc-500">
            {isFifa ? 'Top 2 mara ke Peringkat Separuh Akhir' : 'Top 2 mara ke Separuh Akhir (Home & Away)'}
          </span>
        </div>

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
              {groupData.map((row: StandingRow) => {
                const team = teams.find(t => t.id === row.teamId);
                const isFeatured = row.teamId === 'malaysia';
                const isTopTwo = row.position <= 2;
                return (
                  <tr 
                    key={row.teamId}
                    className={`border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-colors whitespace-nowrap ${
                      isFeatured ? 'bg-primary/10 hover:bg-primary/15 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-center font-bold text-zinc-300">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          isTopTwo 
                            ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' 
                            : 'text-zinc-400'
                        }`}>
                          {row.position}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl">{team?.flag}</span>
                        <div className="min-w-0">
                          <div className="font-extrabold text-zinc-100 flex items-center gap-1.5 truncate">
                            {team?.name || row.teamId}
                            {isFeatured && (
                              <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                HARIMAU MALAYA
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-bold uppercase">{team?.code} • FIFA #{team?.fifaRanking}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center text-zinc-300 font-medium">{row.played}</td>
                    <td className="py-4 px-3 text-center text-zinc-400">{row.wins}</td>
                    <td className="py-4 px-3 text-center text-zinc-400">{row.draws}</td>
                    <td className="py-4 px-3 text-center text-zinc-400">{row.losses}</td>
                    <td className="py-4 px-3 text-center text-zinc-500">{row.goalsFor}</td>
                    <td className="py-4 px-3 text-center text-zinc-500 hidden sm:table-cell">{row.goalsAgainst}</td>
                    <td className="py-4 px-3 text-center font-bold text-zinc-300 hidden sm:table-cell">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-4 px-4 text-center font-black text-primary text-base">{row.points}</td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {row.recentForm?.map((f: string, idx: number) => (
                          <React.Fragment key={idx}>{renderFormCircle(f)}</React.Fragment>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center hidden md:table-cell">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        row.qualificationStatus.includes('Semi-Final')
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : row.qualificationStatus === 'Eliminated'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
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
    </div>
  );
}
