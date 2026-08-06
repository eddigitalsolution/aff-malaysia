'use client';

import React, { useEffect, useState } from 'react';
import { getStatistics, getTeams, Team } from '@/lib/api';
import { BarChart2, Star, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function loadData() {
      const s = await getStatistics();
      const t = await getTeams();
      setStats(s);
      setTeams(t);
    }
    loadData();
  }, []);

  if (!stats) {
    return <div className="text-zinc-500 py-12 text-center">Loading statistics...</div>;
  }

  // Format charts data
  const scorersData = stats.topScorers.map((s: any) => ({
    name: s.name.split(' ')[0],
    Goals: s.goals,
    Assists: s.assists
  }));

  const assistsData = stats.topAssists.map((a: any) => ({
    name: a.name.split(' ')[0],
    Assists: a.value
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-primary" />
          <span>Tournament Leaderboards</span>
        </h1>
        <p className="text-xs text-zinc-400">Leaders and player metrics across the ASEAN Hyundai Cup 2026.</p>
      </div>

      {/* Leaderboard Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Scorers Chart */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <h3 className="font-bold text-sm text-zinc-300 mb-4 flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 text-primary" />
            <span>TOP SCORERS</span>
          </h3>
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
          <h3 className="font-bold text-sm text-zinc-300 mb-4 flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-accent" />
            <span>TOP ASSISTS</span>
          </h3>
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
          <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2">PASS ACCURACY (%)</h3>
          <div className="space-y-3 text-xs">
            {stats.passAccuracy.map((p: any, idx: number) => {
              const team = teams.find(t => t.id === p.teamId);
              return (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-zinc-900/40">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-bold">{idx + 1}</span>
                    <span className="font-semibold text-zinc-200">{p.name}</span>
                    <span className="text-[10px] text-zinc-500">({team?.name})</span>
                  </div>
                  <span className="font-bold text-primary">{p.value}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clean Sheets */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
          <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2">MOST CLEAN SHEETS</h3>
          <div className="space-y-3 text-xs">
            {stats.cleanSheets.map((c: any, idx: number) => {
              const team = teams.find(t => t.id === c.teamId);
              return (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-zinc-900/40">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-bold">{idx + 1}</span>
                    <span className="font-semibold text-zinc-200">{c.name}</span>
                    <span className="text-[10px] text-zinc-500">({team?.name})</span>
                  </div>
                  <span className="font-bold text-accent">{c.value} sheets</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
