'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlayers, getTeams, Player, Team } from '@/lib/api';
import { Search, UserCheck, ShieldAlert, Award } from 'lucide-react';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('All');
  const [selectedTeam, setSelectedTeam] = useState<string>('malaysia');

  useEffect(() => {
    async function loadData() {
      const p = await getPlayers();
      const t = await getTeams();
      setPlayers(p);
      setTeams(t);
    }
    loadData();
  }, []);

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = activeTab === 'All' || p.position === activeTab;
    const matchesTeam = p.teamId === 'malaysia';
    return matchesSearch && matchesPosition && matchesTeam;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-primary" />
          <span>Malaysia Squad Players</span>
        </h1>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <p className="text-xs text-zinc-400">Search and filter through the complete roster of the Malaysia national team.</p>
          <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            📊 Stats: AFF ASEAN Cup 2026 — Group Stage (3 Matches)
          </span>
        </div>
      </div>

      {/* Match context strip */}
      <div className="grid grid-cols-3 gap-2 text-[10px]">
        {[
          { match: 'MYA vs MYS', result: 'W 2–1', date: 'Jul 25' },
          { match: 'MYS vs LAO', result: 'W 4–0', date: 'Jul 28' },
          { match: 'THA vs MYS', result: 'L 0–2', date: 'Aug 1' },
        ].map((m) => (
          <div key={m.match} className="glass-card rounded-xl border border-zinc-800 px-3 py-2 text-center">
            <div className="font-black text-zinc-200">{m.match}</div>
            <div className={`font-black ${m.result.startsWith('W') ? 'text-emerald-400' : 'text-red-400'}`}>{m.result}</div>
            <div className="text-zinc-600">{m.date}</div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search players by name or club..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Position Filter Tabs */}
      <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80 overflow-x-auto self-start">
        {(['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const).map((pos) => (
          <button
            key={pos}
            onClick={() => setActiveTab(pos)}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === pos ? 'bg-primary text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {pos === 'All' ? 'All Positions' : pos + 's'}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">No players match the filter query.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((p) => {
            const team = teams.find(t => t.id === p.teamId);
            const isFeatured = p.teamId === 'malaysia';
            return (
              <Link
                key={p.id}
                href={`/players/${p.id}`}
                className={`block glass-card rounded-2xl p-5 border border-zinc-800 glass-card-hover ${
                  isFeatured ? 'border-primary/20 bg-primary/2' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative bg-zinc-900 border border-zinc-800 w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-black text-primary text-sm shadow">
                      {p.photo ? (
                        <img 
                          src={p.photo} 
                          alt={p.name} 
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
                      <span className={p.photo ? "fallback-number hidden" : "fallback-number"}>#{p.number}</span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-1.5">
                        <span className="bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded font-black">
                          #{p.number}
                        </span>
                        <span>{p.name}</span>
                        {p.injuryStatus === 'Injured' && (
                          <span className="bg-red-500/20 text-red-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                            🔴 INJURED
                          </span>
                        )}
                        {p.appearances === 0 && (
                          <span className="bg-zinc-800 text-zinc-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                            DNP
                          </span>
                        )}
                        {isFeatured && p.injuryStatus !== 'Injured' && p.appearances > 0 && (
                          <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                            FOCUS
                          </span>
                        )}
                      </h3>
                      <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{p.position} • {team?.flag} {team?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Player Profile Details — AFF 2026 Stats */}
                <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-3.5 text-xs">
                  {/* Left Column: Attacking */}
                  <div className="space-y-1.5 border-r border-zinc-900 pr-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-semibold">Goals</span>
                      <span className="font-extrabold text-primary">{p.appearances > 0 ? p.goals : '—'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-semibold">Assists</span>
                      <span className="font-extrabold text-accent">{p.appearances > 0 ? p.assists : '—'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-semibold">Shots</span>
                      <span className="font-bold text-zinc-300">{p.appearances > 0 ? (p.shots ?? 0) : '—'}</span>
                    </div>
                  </div>

                  {/* Right Column: Performance & Workrate */}
                  <div className="space-y-1.5 pl-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-semibold">Apps</span>
                      <span className="font-bold text-zinc-300">{p.appearances > 0 ? p.appearances : '—'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-semibold">Pass Accuracy</span>
                      <span className="font-bold text-zinc-300">{p.appearances > 0 ? `${p.passingAccuracy}%` : '—'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-semibold">Tackles</span>
                      <span className="font-bold text-zinc-300">{p.appearances > 0 ? (p.tackles ?? 0) : '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Performance Row */}
                <div className="mt-2 flex justify-between items-center text-xs px-1">
                  <span className="text-[10px] text-zinc-500 font-semibold">Minutes Played</span>
                  <span className="font-bold text-zinc-300">{p.appearances > 0 ? `${p.minutes} mins` : '—'}</span>
                </div>

                {/* Rating Footer */}
                <div className="mt-3 border-t border-zinc-900 pt-3 flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">{p.club}</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-zinc-900 border border-zinc-800 text-accent font-extrabold px-2.5 py-1 rounded text-xs">
                      {p.averageRating > 0 ? p.averageRating : '—'}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold">RATING</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
