'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlayers, getTeams, Player, Team } from '@/lib/api';
import { Search, UserCheck, ShieldAlert, Award, ArrowLeftRight, ChevronDown } from 'lucide-react';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('All');
  
  // Comparison states
  const [isComparing, setIsComparing] = useState(false);
  const [compareId1, setCompareId1] = useState<string>('g-pavithran');
  const [compareId2, setCompareId2] = useState<string>('sergio-aguero');

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

  const malaysiaPlayers = players.filter(p => p.teamId === 'malaysia');
  const player1 = malaysiaPlayers.find(p => p.id === compareId1) || malaysiaPlayers[0];
  const player2 = malaysiaPlayers.find(p => p.id === compareId2) || malaysiaPlayers[1];

  const compareStats = (val1: number, val2: number) => {
    if (val1 > val2) return 'text-emerald-400 font-extrabold';
    if (val2 > val1) return 'text-zinc-500 font-medium';
    return 'text-zinc-300 font-bold';
  };

  const getWinnerBg = (val1: number, val2: number, isPlayer1: boolean) => {
    if (val1 === val2) return '';
    if (isPlayer1 && val1 > val2) return 'bg-emerald-500/5 border-emerald-500/10';
    if (!isPlayer1 && val2 > val1) return 'bg-emerald-500/5 border-emerald-500/10';
    return 'opacity-80';
  };

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
            📊 Stats: AFF ASEAN Cup 2026 — Semifinals Concluded
          </span>
        </div>
      </div>

      {/* Match context strip */}
      <div className="grid grid-cols-5 gap-2 text-[10px]">
        {[
          { match: 'MYS vs LAO', result: 'W 4–0', date: 'Jul 28', upcoming: false },
          { match: 'THA vs MYS', result: 'L 0–2', date: 'Aug 1', upcoming: false },
          { match: 'MYS vs PHI', result: 'W 1–0', date: 'Aug 8', upcoming: false },
          { match: 'MYS vs VIE', result: 'L 0–2', date: 'Aug 16', upcoming: false },
          { match: 'VIE vs MYS', result: 'L 0–2', date: 'Aug 20', upcoming: false },
        ].map((m) => (
          <div key={m.match} className={`glass-card rounded-xl border px-3 py-2 text-center ${m.upcoming ? 'border-primary/30 bg-primary/5' : 'border-zinc-850'}`}>
            <div className="font-black text-zinc-200">{m.match}</div>
            <div className={`font-black ${m.upcoming ? 'text-primary' : m.result.startsWith('W') ? 'text-emerald-400' : 'text-red-400'}`}>{m.result}</div>
            <div className="text-zinc-500">{m.date}</div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search & Compare Toggle */}
        <div className="flex flex-1 items-center gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search players by name or club..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button
            onClick={() => setIsComparing(prev => !prev)}
            className={`flex items-center gap-1.5 border px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              isComparing
                ? 'bg-primary text-zinc-950 border-primary font-black'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            {isComparing ? 'Exit Comparison' : 'Compare Players'}
          </button>
        </div>
      </div>

      {isComparing ? (
        /* COMPARISON DASHBOARD */
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          {/* Selectors Card */}
          <div className="glass-card rounded-2xl border border-zinc-800 p-5">
            <div className="text-xs font-black text-primary uppercase tracking-wider mb-3">🔄 Select Players to Compare</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player 1 Select */}
              <div className="relative">
                <select
                  value={compareId1}
                  onChange={(e) => setCompareId1(e.target.value)}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-200 focus:outline-none focus:border-primary cursor-pointer"
                >
                  {malaysiaPlayers.map(p => (
                    <option key={p.id} value={p.id} disabled={p.id === compareId2}>
                      #{p.number} - {p.name} ({p.position})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>

              {/* Player 2 Select */}
              <div className="relative">
                <select
                  value={compareId2}
                  onChange={(e) => setCompareId2(e.target.value)}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-200 focus:outline-none focus:border-primary cursor-pointer"
                >
                  {malaysiaPlayers.map(p => (
                    <option key={p.id} value={p.id} disabled={p.id === compareId1}>
                      #{p.number} - {p.name} ({p.position})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {player1 && player2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Side-by-side Profile Cards */}
              {[player1, player2].map((p, idx) => {
                const isP1 = idx === 0;
                const other = isP1 ? player2 : player1;
                return (
                  <div key={p.id} className={`glass-card rounded-2xl p-5 border border-zinc-800 transition-all ${getWinnerBg(p.averageRating, other.averageRating, isP1)}`}>
                    <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
                      <div className="relative bg-zinc-900 border border-zinc-800 w-16 h-16 rounded-full overflow-hidden flex items-center justify-center font-black text-primary text-lg shadow shrink-0">
                        {p.photo ? (
                          <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                        ) : null}
                        <span className={p.photo ? "fallback-number hidden" : "fallback-number"}>#{p.number}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base sm:text-lg text-zinc-100 truncate">{p.name}</h3>
                          <span className="bg-primary/10 border border-primary/25 text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase">#{p.number}</span>
                        </div>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{p.position} · {p.club}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-zinc-500 font-bold uppercase">AFF Rating</div>
                        <div className="text-xl font-black text-accent">{p.averageRating > 0 ? p.averageRating : '—'}</div>
                      </div>
                    </div>

                    {/* Stats Comparison Grid */}
                    <div className="py-4 border-b border-zinc-900 space-y-2">
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">📊 Tournament Stats</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-zinc-900/30">
                          <span className="text-zinc-500">Goals</span>
                          <span className={compareStats(p.goals, other.goals)}>{p.appearances > 0 ? p.goals : '0'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-zinc-900/30">
                          <span className="text-zinc-500">Assists</span>
                          <span className={compareStats(p.assists, other.assists)}>{p.appearances > 0 ? p.assists : '0'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-zinc-900/30">
                          <span className="text-zinc-500">Pass Accuracy</span>
                          <span className={compareStats(p.passingAccuracy, other.passingAccuracy)}>{p.appearances > 0 ? `${p.passingAccuracy}%` : '0%'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-zinc-900/30">
                          <span className="text-zinc-500">Tackles</span>
                          <span className={compareStats(p.tackles || 0, other.tackles || 0)}>{p.appearances > 0 ? (p.tackles || 0) : '0'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-zinc-900/30">
                          <span className="text-zinc-500">Appearances</span>
                          <span className={compareStats(p.appearances, other.appearances)}>{p.appearances}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-zinc-900/30">
                          <span className="text-zinc-500">Minutes</span>
                          <span className={compareStats(p.minutes, other.minutes)}>{p.minutes} mins</span>
                        </div>
                      </div>
                    </div>

                    {/* Radar attributes comparison progress bars */}
                    <div className="py-4 border-b border-zinc-900 space-y-3">
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">⚡ Attributes (Radar)</div>
                      <div className="space-y-2.5">
                        {p.radar && other.radar && Object.keys(p.radar).map((attr) => {
                          const val = p.radar![attr as keyof typeof p.radar] || 50;
                          const otherVal = other.radar![attr as keyof typeof other.radar] || 50;
                          const isWinner = val > otherVal;
                          return (
                            <div key={attr} className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="capitalize text-zinc-400">{attr}</span>
                                <span className={isWinner ? 'text-emerald-400 font-extrabold' : 'text-zinc-300'}>{val}</span>
                              </div>
                              <div className="w-full bg-zinc-950 rounded-full h-1.5 border border-zinc-900 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${isWinner ? 'bg-primary' : 'bg-zinc-700'}`}
                                  style={{ width: `${val}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* AI Analysis */}
                    {p.aiAnalysis && (
                      <div className="pt-4 space-y-3">
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">🧠 AI Scout Notes</div>
                        <div className="text-xs space-y-2">
                          <p className="text-zinc-400 leading-normal">
                            <strong className="text-zinc-200">Playing Style:</strong> {p.aiAnalysis.playingStyle}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <strong className="text-[9.5px] text-zinc-500 uppercase tracking-wider w-full mb-0.5">Strengths:</strong>
                            {p.aiAnalysis.strengths.map((str, j) => (
                              <span key={j} className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-md">
                                {str}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <strong className="text-[9.5px] text-zinc-500 uppercase tracking-wider w-full mb-0.5">Weaknesses:</strong>
                            {p.aiAnalysis.weaknesses.map((wk, j) => (
                              <span key={j} className="bg-red-500/10 border border-red-500/25 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded-md">
                                {wk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* STANDARD PLAYERS LIST TAB */
        <>
          {/* Position Filter Tabs */}
          <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80 overflow-x-auto self-start">
            {(['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setActiveTab(pos)}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
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
                            {p.injuryStatus === 'Returned to Club' && (
                              <span className="bg-yellow-500/20 text-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                                🏠 CLUB
                              </span>
                            )}
                            {p.appearances === 0 && (
                              <span className="bg-zinc-800 text-zinc-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                                DNP
                              </span>
                            )}
                            {isFeatured && p.injuryStatus !== 'Injured' && p.injuryStatus !== 'Returned to Club' && p.appearances > 0 && (
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
        </>
      )}
    </div>
  );
}
