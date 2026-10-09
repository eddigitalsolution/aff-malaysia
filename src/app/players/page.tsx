'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlayers, getTeams, TOURNAMENTS, Player, Team } from '@/lib/api';
import { useAppState } from '@/store';
import { Search, UserCheck, ShieldAlert, Award, ArrowLeftRight, ChevronDown, Trophy, Globe, Swords, ChevronRight, Star, Sparkles } from 'lucide-react';

export default function PlayersPage() {
  const { activeTournamentId, setActiveTournamentId } = useAppState();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('All');
  const [showOnlyCallUp, setShowOnlyCallUp] = useState(false);
  
  // Comparison states
  const [isComparing, setIsComparing] = useState(false);
  const [compareId1, setCompareId1] = useState<string>('g-pavithran');
  const [compareId2, setCompareId2] = useState<string>('sergio-aguero');

  const currentTournament = TOURNAMENTS.find(t => t.id === activeTournamentId) || TOURNAMENTS[0];
  const isFifa = activeTournamentId === 'fifa-asean-cup-2026';

  useEffect(() => {
    async function loadData() {
      const p = await getPlayers(undefined, activeTournamentId);
      const t = await getTeams(activeTournamentId);
      setPlayers(p);
      setTeams(t);
      if (activeTournamentId === 'fifa-asean-cup-2026') {
        setCompareId1('bergson');
        setCompareId2('arif-aiman');
      } else {
        setCompareId1('g-pavithran');
        setCompareId2('sergio-aguero');
      }
    }
    loadData();
  }, [activeTournamentId]);

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = activeTab === 'All' || p.position === activeTab;
    const matchesTeam = p.teamId === 'malaysia';
    const matchesCallUp = !showOnlyCallUp || p.isChinaCallUp;
    return matchesSearch && matchesPosition && matchesTeam && matchesCallUp;
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
      {/* Tournament Selection Header Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950 rounded-xl flex-1 sm:flex-initial">
          {TOURNAMENTS.map(t => {
            const active = t.id === activeTournamentId;
            const isFifaTournament = t.id === 'fifa-asean-cup-2026';
            return (
              <button
                key={t.id}
                onClick={() => setActiveTournamentId(t.id)}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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

          <Link
            href="/potential-players"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 border border-transparent hover:border-amber-400/30"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Potential Players</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-black uppercase bg-amber-400/20 text-amber-400">
              U23 SCOUTING
            </span>
          </Link>
        </div>

        <div className="px-3 py-1 text-xs text-zinc-400 font-medium">
          {currentTournament.sanction}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-primary" />
          <span>Malaysia Squad Players</span>
        </h1>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <p className="text-xs text-zinc-400">Search and filter through the complete roster of the Malaysia national team.</p>
          <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            📊 Stats Focus: {currentTournament.name}
          </span>
        </div>
      </div>

      {/* Match context strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-[10px]">
        {(isFifa ? [
          { match: 'BAN vs MYS', result: 'W 3–0', date: '25 Sep 2026', type: 'win' },
          { match: 'MYS vs IDN', result: 'D 0–0', date: '28 Sep 2026', type: 'draw' },
          { match: 'MYS vs SGP', result: 'W 6–0', date: '01 Oct 2026', type: 'win' },
          { match: 'VIE vs MYS (3rd)', result: 'W 1–0', date: '05 Oct 2026', type: 'win' },
          { match: 'Campaign Finish', result: 'Bronze Medal 🥉', date: '3W 1D 0L • +10 GD', type: 'medal' },
        ] : [
          { match: 'MYA vs MYS', result: 'W 2–1', date: '25 Jul 2026', type: 'win' },
          { match: 'MYS vs LAO', result: 'W 4–0', date: '28 Jul 2026', type: 'win' },
          { match: 'THA vs MYS', result: 'L 0–2', date: '01 Aug 2026', type: 'loss' },
          { match: 'MYS vs PHI', result: 'W 1–0', date: '08 Aug 2026', type: 'win' },
          { match: 'Semi-Final vs VIE', result: 'L 0–4 agg', date: '16 & 19 Aug 2026', type: 'loss' },
        ]).map((m) => (
          <div key={m.match} className={`glass-card rounded-xl border px-3 py-2 text-center transition-all ${
            m.type === 'win' 
              ? 'border-emerald-500/30 bg-emerald-950/20' 
              : m.type === 'draw' 
              ? 'border-amber-500/30 bg-amber-950/20' 
              : m.type === 'medal'
              ? 'border-amber-400/40 bg-amber-400/10'
              : 'border-zinc-800 bg-zinc-900/40'
          }`}>
            <div className="font-black text-zinc-200">{m.match}</div>
            <div className={`font-black text-xs ${
              m.type === 'win'
                ? 'text-emerald-400'
                : m.type === 'draw'
                ? 'text-amber-400'
                : m.type === 'medal'
                ? 'text-amber-300'
                : 'text-zinc-400'
            }`}>
              {m.result}
            </div>
            <div className="text-zinc-500 text-[9px] mt-0.5">{m.date}</div>
          </div>
        ))}
      </div>

      {/* China Friendly 26-Player Call-Up Announcement Banner */}
      <div className="bg-linear-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
            <Swords className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-400">Official Call-Up</span>
              <span className="text-zinc-500 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-zinc-200 font-bold">China Tier 1 Friendly (14 & 17 Nov 2026, Guangzhou)</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              26-player squad selected based on FIFA ASEAN Cup & AFF performance baseline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setShowOnlyCallUp(prev => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-initial justify-center ${
              showOnlyCallUp
                ? 'bg-amber-400 text-zinc-950 font-black shadow-md'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            <span>{showOnlyCallUp ? '✓ Showing 26 Call-Ups' : 'Filter 26 Call-Ups'}</span>
          </button>
          <Link
            href="/friendly"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-400 text-white transition-all flex items-center gap-1 flex-1 sm:flex-initial justify-center"
          >
            <span>Tactics & H2H</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search & Compare Toggle */}
        <div className="flex flex-1 items-center gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              id="player-search"
              name="playerSearch"
              type="search"
              autoComplete="off"
              aria-label="Search players by name or club"
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
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Attributes (Radar)</div>
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

                    {/* Scouting Report */}
                    {p.aiAnalysis && (
                      <div className="pt-4 space-y-3">
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Tactical Scout Notes</div>
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
          {/* Position Filter Tabs & Call-Up Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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

            <button
              onClick={() => setShowOnlyCallUp(prev => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                showOnlyCallUp
                  ? 'bg-amber-400 border-amber-400 text-zinc-950 font-black shadow-md'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <span>China Friendly Call-Up Squad</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                showOnlyCallUp ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-amber-400'
              }`}>
                {players.filter(p => p.isChinaCallUp).length}
              </span>
            </button>
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
                    className={`block glass-card rounded-2xl p-5 border border-zinc-800 glass-card-hover overflow-hidden ${
                      isFeatured ? 'border-primary/20 bg-primary/2' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3.5">
                      <div className="relative shrink-0 bg-zinc-900 border border-zinc-800 w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-black text-primary text-sm shadow">
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

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded font-black shrink-0">
                            #{p.number}
                          </span>
                          <h3 className="font-extrabold text-sm sm:text-base text-zinc-100 truncate">
                            {p.name}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 mt-1 mb-1">
                          {p.appearances === 0 && (
                            <span className="bg-zinc-800 text-zinc-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">
                              DNP
                            </span>
                          )}
                          {isFeatured && p.appearances > 0 && (
                            <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">
                              FOCUS
                            </span>
                          )}
                          {p.isChinaCallUp && (
                            <span className="bg-red-500/20 border border-red-500/40 text-red-300 text-[8px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">
                              CN 26 CALL-UP
                            </span>
                          )}
                        </div>

                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block truncate">
                          {p.position} • {team?.flag} {team?.name}
                        </span>
                        
                        {p.tournamentProvenance && (
                          <div className="mt-1 flex items-center gap-1 flex-wrap">
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                              p.tournamentProvenance.includes('Both')
                                ? 'bg-linear-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-300'
                                : p.tournamentProvenance.includes('FIFA')
                                ? 'bg-amber-400/15 border border-amber-400/30 text-amber-400'
                                : 'bg-emerald-400/15 border border-emerald-400/30 text-emerald-400'
                            }`}>
                              {p.tournamentProvenance.includes('Both') ? 'Both Tournaments (FIFA & AFF)' : p.tournamentProvenance}
                            </span>
                          </div>
                        )}

                        {p.callUpRole && (
                          <div className="text-[9.5px] text-amber-400 font-semibold leading-snug mt-1 wrap-break-word line-clamp-2">
                            {p.callUpRole}
                          </div>
                        )}
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

                    {/* Tournament Selection Basis Highlight */}
                    {p.tournamentHighlight && (
                      <div className="mt-2.5 text-[9.5px] text-zinc-300 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800 leading-relaxed wrap-break-word">
                        <span className="text-[8.5px] text-amber-400 font-black block uppercase tracking-wider mb-0.5">
                          Selection Basis:
                        </span>
                        {p.tournamentHighlight}
                      </div>
                    )}

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
