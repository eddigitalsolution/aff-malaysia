'use client';

import React, { useEffect, useState } from 'react';
import { getStatistics, getTeams, TOURNAMENTS, Team } from '@/lib/api';
import { useAppState } from '@/store';
import { BarChart2, Star, TrendingUp, ShieldAlert, Award, Trophy, Globe, Activity } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';

export default function StatisticsPage() {
  const { activeTournamentId, setActiveTournamentId } = useAppState();
  const [stats, setStats] = useState<any>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  const currentTournament = TOURNAMENTS.find(t => t.id === activeTournamentId) || TOURNAMENTS[0];
  const isFifa = activeTournamentId === 'fifa-asean-cup-2026';

  useEffect(() => {
    async function loadData() {
      const s = await getStatistics(activeTournamentId);
      const t = await getTeams(activeTournamentId);
      setStats(s);
      setTeams(t);
    }
    loadData();
  }, [activeTournamentId]);

  if (!stats) {
    return <div className="text-zinc-500 py-12 text-center">Loading statistics...</div>;
  }

  // Format charts data
  const scorersData = (stats.topScorers || []).map((s: any) => ({
    name: s.name.split(' ')[0],
    Goals: s.goals,
    Assists: s.assists
  }));

  const assistsData = (stats.topAssists || []).map((a: any) => ({
    name: a.name.split(' ')[0],
    Assists: a.value
  }));

  const tStats = stats.tournamentStats || {};

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

      {/* Header Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative overflow-hidden ${
        isFifa 
          ? 'bg-linear-to-r from-amber-500/10 via-zinc-900/90 to-zinc-900/60 border-amber-500/30' 
          : 'bg-linear-to-r from-emerald-500/10 via-zinc-900/90 to-zinc-900/60 border-emerald-500/30'
      }`}>
        <div className="flex items-center gap-3.5 z-10">
          <div className={`p-3 rounded-xl border ${
            isFifa 
              ? 'bg-amber-400/10 border-amber-400/30 text-amber-400' 
              : 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
          }`}>
            <BarChart2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                isFifa ? 'bg-amber-400 text-zinc-950' : 'bg-emerald-400 text-zinc-950'
              }`}>
                {currentTournament.shortName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700/60">
                🇲🇾 HARIMAU MALAYA SQUAD FOCUS
              </span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                {currentTournament.division}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>Malaysia</span>
              <span className="text-zinc-500">•</span>
              <span>{currentTournament.name} Analytics</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Individual player contributions, squad pass accuracy & campaign records for Harimau Malaya
            </p>
          </div>
        </div>

        {/* Quick tournament stats pill */}
        <div className="flex items-center gap-1 sm:gap-2 bg-zinc-950/80 border border-zinc-800 p-2 rounded-xl text-xs flex-wrap">
          <div className="text-center px-2.5 border-r border-zinc-800">
            <div className="font-black text-white">{tStats.totalMatches || 0}</div>
            <div className="text-[9px] text-zinc-500 uppercase">Matches</div>
          </div>
          <div className="text-center px-2.5 border-r border-zinc-800">
            <div className="font-black text-white">
              {tStats.totalWins ?? 0}W-{tStats.totalDraws ?? 0}D-{tStats.totalLosses ?? 0}L
            </div>
            <div className="text-[9px] text-zinc-500 uppercase">Record</div>
          </div>
          <div className="text-center px-2.5 border-r border-zinc-800">
            <div className="font-black text-primary">
              {tStats.totalGoals || 0} <span className="text-[10px] text-zinc-500 font-normal">({tStats.goalsConceded ?? 0} conceded)</span>
            </div>
            <div className="text-[9px] text-zinc-500 uppercase">Goals (GD: {tStats.goalDifference > 0 ? `+${tStats.goalDifference}` : tStats.goalDifference || 0})</div>
          </div>
          <div className="text-center px-2.5">
            <div className="font-black text-accent">{tStats.cleanSheets || 0} <span className="text-[10px] text-zinc-500 font-normal">({tStats.cleanSheetRate || '0%'})</span></div>
            <div className="text-[9px] text-zinc-500 uppercase">Clean Sheets</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Scorers Chart */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-primary" />
              <span>MALAYSIA TOP SCORERS</span>
            </h3>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Goals & Assists</span>
          </div>
          <div className="h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scorersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                <Legend />
                <Bar dataKey="Goals" fill="#facc15" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Assists" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Assists Chart */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-accent" />
              <span>MALAYSIA TOP ASSISTS</span>
            </h3>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Key Chances Created</span>
          </div>
          <div className="h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assistsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                <Legend />
                <Bar dataKey="Assists" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Leaderboard Lists */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pass Accuracy */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <h3 className="font-bold text-sm text-zinc-300">MALAYSIA PASS ACCURACY (%)</h3>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Min. 45 Mins</span>
          </div>
          <div className="space-y-3 text-xs">
            {stats.passAccuracy.map((p: any, idx: number) => {
              return (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-zinc-900/40">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-bold w-4">{idx + 1}</span>
                    <span className="font-semibold text-zinc-200">{p.name}</span>
                    <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                      {p.club || 'Malaysia'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.position && (
                      <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">{p.position}</span>
                    )}
                    <span className="font-bold text-primary font-mono">{p.value}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clean Sheets */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <h3 className="font-bold text-sm text-zinc-300">MALAYSIA GOALKEEPERS & CLEAN SHEETS</h3>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Tournament Campaign</span>
          </div>
          <div className="space-y-3 text-xs">
            {stats.cleanSheets.map((c: any, idx: number) => {
              return (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-zinc-900/40">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-bold w-4">{idx + 1}</span>
                    <span className="font-semibold text-zinc-200">{c.name}</span>
                    <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                      {c.club || 'Malaysia'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-500">
                      Conceded: <span className="text-zinc-300 font-medium">{c.goalsConceded ?? 0}</span>
                    </span>
                    {c.saveRate && (
                      <span className="text-[10px] text-zinc-500">
                        Saves: <span className="text-zinc-300 font-medium">{c.saveRate}</span>
                      </span>
                    )}
                    <span className="font-bold text-accent font-mono">
                      {c.value} {c.value === 1 ? 'sheet' : 'sheets'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
