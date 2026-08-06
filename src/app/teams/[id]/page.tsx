'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getTeam, getPlayers, Team, Player } from '@/lib/api';
import { Shield, ArrowLeft, Users, Trophy, Award, Zap } from 'lucide-react';

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const teamId = resolvedParams.id;
  
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const t = await getTeam(teamId);
      const allPlayers = await getPlayers();
      setTeam(t);
      setPlayers(allPlayers.filter(p => p.teamId === teamId));
      setLoading(false);
    }
    loadData();
  }, [teamId]);

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center">Loading team details...</div>;
  }

  if (!team) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-zinc-500">Team not found</div>
        <Link href="/teams" className="text-primary hover:underline flex items-center gap-1 justify-center">
          <ArrowLeft className="h-4 w-4" /> Back to Teams
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/teams" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Teams
      </Link>

      {/* Header */}
      <section className="glass-card rounded-2xl p-6 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{team.flag}</span>
          <div>
            <h1 className="text-2xl font-black">{team.name} ({team.code})</h1>
            <p className="text-xs text-zinc-400">AFF Cup 2026 • Group {team.group} • FIFA Ranking: #{team.fifaRanking}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-zinc-300 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 w-full md:w-auto">
          <div>
            <span className="text-zinc-500 block uppercase font-bold text-[9px]">Coach</span>
            <span className="font-extrabold text-sm">{team.coach}</span>
          </div>
          <div className="border-l border-zinc-800 pl-4">
            <span className="text-zinc-500 block uppercase font-bold text-[9px]">Captain</span>
            <span className="font-extrabold text-sm">{team.captain}</span>
          </div>
          <div className="border-l border-zinc-800 pl-4">
            <span className="text-zinc-500 block uppercase font-bold text-[9px]">Formation</span>
            <span className="font-extrabold text-sm">{team.formation}</span>
          </div>
        </div>
      </section>

      {/* Ratings & Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating bars */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2">TACTICAL RATINGS</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Attack</span>
                <span className="font-bold text-primary">{team.ratings.attack}</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${team.ratings.attack}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Midfield</span>
                <span className="font-bold text-accent">{team.ratings.midfield}</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: `${team.ratings.midfield}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Defense</span>
                <span className="font-bold text-emerald-400">{team.ratings.defense}</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${team.ratings.defense}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Squad Metrics */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
          <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2">SQUAD SUMMARY</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">Average Age</span>
              <div className="text-lg font-black text-zinc-200 mt-1">{team.averageAge} years</div>
            </div>
            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">Squad Value</span>
              <div className="text-lg font-black text-zinc-200 mt-1">{team.squadValue}</div>
            </div>
          </div>
        </div>

        {/* Form and Status */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
          <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2">RECENT CUP FORM</h3>
          <div className="flex justify-start gap-2 pt-2">
            {team.recentForm.map((outcome, idx) => (
              <span 
                key={idx}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black uppercase border ${
                  outcome === 'W'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : outcome === 'L'
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-zinc-850 border-zinc-700 text-zinc-300'
                }`}
              >
                {outcome}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Squad list */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-zinc-400" />
          <span>Squad List</span>
        </h2>
        
        {players.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 border border-zinc-800 text-center text-zinc-500 text-sm">
            Roster data currently being updated for this team.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map(p => (
              <Link 
                key={p.id}
                href={`/players/${p.id}`}
                className="glass-card rounded-xl p-4 border border-zinc-850 flex items-center justify-between glass-card-hover"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-900 border border-zinc-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary">
                    #{p.number}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200 text-sm">{p.name}</h4>
                    <span className="text-[10px] text-zinc-500 uppercase">{p.position} • {p.club}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-accent">{p.averageRating}</div>
                  <span className="text-[9px] text-zinc-500 font-semibold">RATING</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
