'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFixtures, getTeams, getVenues, TOURNAMENTS, Fixture, Team, Venue } from '@/lib/api';
import { useAppState } from '@/store';
import { Calendar, MapPin, Compass, AlertCircle, Clock, CloudRain, Trophy, CheckCircle2, Award } from 'lucide-react';

const MATCH_NOTES: Record<string, { scorers?: string; note?: string }> = {
  'match-fac-01': { scorers: '⚽ Arif Aiman (18\', 37\'), Bergson (52\')', note: 'Group Stage MD1 Victory in Bandung' },
  'match-fac-06': { scorers: '🛡️ Clean sheet against hosts Indonesia', note: 'Group Stage MD2 Rivalry Draw at GBK' },
  'match-fac-10': { scorers: '⚽ Bergson (8\' pen, 62\', 90\'+3), S. Wilkin (26\'), P. Josué (76\'), S. Bashah (87\')', note: 'Historic 6-0 Group Stage MD3 Derby Win' },
  'match-fac-13': { scorers: '⚽ Fergus Tierney (62\')', note: '🥉 Bronze Medal Victory • Match for 3rd Place' },
  'match-aff-01': { scorers: '⚽ Paulo Josué (52\', 57\' pen)', note: 'Group B MD1 Away Win in Yangon (Myanmar 1-2 Malaysia)' },
  'match-aff-05': { scorers: '⚽ Paulo Josué (45\'), Endrick (57\'), Wan Kuzain (84\') • 2 Assists: P. Gunalan', note: 'Group B MD2 Dominant 4-0 Home Win' },
  'match-aff-09': { scorers: 'Group B match in Bangkok', note: 'Group B MD3 (Thailand 2-0 Malaysia)' },
  'match-aff-13': { scorers: '⚽ Pavithran Gunalan (16\') • Assist: Wan Kuzain (16\')', note: 'Group B MD4 1-0 Win to Seal Semi-Final Spot' },
  'match-aff-15': { scorers: 'Semi-Final Leg 1 deficit', note: 'Semi-Final Leg 1 at KL Stadium (0-2 vs Vietnam)' },
  'match-aff-16': { scorers: 'Semi-Final Leg 2 conclusion', note: 'Semi-Final Leg 2 at My Dinh, Hanoi (Agg 0-4)' },
};

export default function FixturesPage() {
  const { activeTournamentId, setActiveTournamentId } = useAppState();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Group Stage' | 'Knockout'>('ALL');
  const [focusMalaysiaOnly, setFocusMalaysiaOnly] = useState<boolean>(true);

  const currentTournament = TOURNAMENTS.find(t => t.id === activeTournamentId) || TOURNAMENTS[0];
  const isFifa = activeTournamentId === 'fifa-asean-cup-2026';

  useEffect(() => {
    async function loadData() {
      const f = await getFixtures(activeTournamentId);
      const t = await getTeams(activeTournamentId);
      const v = await getVenues();
      setFixtures(f);
      setTeams(t);
      setVenues(v);
    }
    loadData();
  }, [activeTournamentId]);

  // Filter fixtures: default focuses on Malaysia matches only
  const displayedFixtures = fixtures.filter(f => {
    if (focusMalaysiaOnly) {
      const isMal = f.homeTeamId === 'malaysia' || f.awayTeamId === 'malaysia';
      if (!isMal) return false;
    }
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'Group Stage') return f.stage === 'Group Stage';
    if (activeFilter === 'Knockout') return f.stage !== 'Group Stage';
    return true;
  });

  // Calculate Malaysia campaign record for banner stats
  const malFixtures = fixtures.filter(f => f.homeTeamId === 'malaysia' || f.awayTeamId === 'malaysia');
  let malWins = 0, malDraws = 0, malLosses = 0, malGoals = 0, malConceded = 0;
  malFixtures.forEach(f => {
    if (f.status === 'COMPLETED') {
      const isHome = f.homeTeamId === 'malaysia';
      const scoreFor = isHome ? f.homeScore : f.awayScore;
      const scoreAgainst = isHome ? f.awayScore : f.homeScore;
      malGoals += scoreFor;
      malConceded += scoreAgainst;
      if (scoreFor > scoreAgainst) malWins++;
      else if (scoreFor === scoreAgainst) malDraws++;
      else malLosses++;
    }
  });

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

        <div className="px-3 py-1 text-xs text-zinc-400 font-medium">
          {currentTournament.sanction}
        </div>
      </div>

      {/* Page Title & Banner */}
      <div className={`p-5 sm:p-6 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative overflow-hidden ${
        isFifa 
          ? 'bg-linear-to-r from-amber-500/10 via-zinc-900/90 to-zinc-900/60 border-amber-500/30' 
          : 'bg-linear-to-r from-emerald-500/10 via-zinc-900/90 to-zinc-900/60 border-emerald-500/30'
      }`}>
        <div className="z-10">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
              isFifa ? 'bg-amber-400 text-zinc-950' : 'bg-emerald-400 text-zinc-950'
            }`}>
              {currentTournament.shortName}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700/60">
              🇲🇾 HARIMAU MALAYA FOCUS
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {currentTournament.division}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            {currentTournament.name} Fixtures & Results
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Official match schedule, verified stadiums, opponents & campaign scores • Host: {currentTournament.host}
          </p>
        </div>

        {/* Campaign pill & Focus toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 shrink-0">
          {/* Quick Malaysia Record Pill */}
          <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 p-2 rounded-xl text-xs">
            <div className="text-center px-2.5 border-r border-zinc-800">
              <div className="font-black text-white">{malFixtures.length}</div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Matches</div>
            </div>
            <div className="text-center px-2.5 border-r border-zinc-800">
              <div className="font-black text-white">{malWins}W - {malDraws}D - {malLosses}L</div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Record</div>
            </div>
            <div className="text-center px-2.5 border-r border-zinc-800">
              <div className="font-black text-primary">{malGoals} ({malConceded} con)</div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Goals</div>
            </div>
            <div className="text-center px-2">
              <div className="font-black text-accent">{isFifa ? 'Bronze (3rd)' : 'SF Exit'}</div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Result</div>
            </div>
          </div>

          {/* Malaysia Only Toggle */}
          <button
            onClick={() => setFocusMalaysiaOnly(!focusMalaysiaOnly)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              focusMalaysiaOnly
                ? isFifa
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm'
                  : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <span>{focusMalaysiaOnly ? '🇲🇾 Malaysia Only' : 'All Teams'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex bg-zinc-950 border border-zinc-800 p-1 rounded-xl gap-1">
          {(['ALL', 'Group Stage', 'Knockout'] as const).map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveFilter(stage)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === stage 
                  ? isFifa ? 'bg-amber-400 text-zinc-950 font-black' : 'bg-emerald-400 text-zinc-950 font-black' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {stage === 'ALL' ? 'All Matches' : stage === 'Knockout' ? 'Knockouts & Finals' : 'Group Stages'}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-500">
          Showing <span className="font-bold text-zinc-200">{displayedFixtures.length}</span> matches
        </div>
      </div>

      {/* Fixtures List */}
      <div className="space-y-4">
        {displayedFixtures.map((f) => {
          const home = teams.find(t => t.id === f.homeTeamId);
          const away = teams.find(t => t.id === f.awayTeamId);
          const venue = venues.find(v => v.id === f.venueId);
          const isFeatured = f.homeTeamId === 'malaysia' || f.awayTeamId === 'malaysia';
          const matchNote = MATCH_NOTES[f.id];

          // Determine outcome for Malaysia
          let outcome: 'WIN' | 'DRAW' | 'LOSS' | null = null;
          if (isFeatured && f.status === 'COMPLETED') {
            const isMalHome = f.homeTeamId === 'malaysia';
            const malScore = isMalHome ? f.homeScore : f.awayScore;
            const oppScore = isMalHome ? f.awayScore : f.homeScore;
            if (malScore > oppScore) outcome = 'WIN';
            else if (malScore === oppScore) outcome = 'DRAW';
            else outcome = 'LOSS';
          }

          const isThirdPlaceMatch = f.id === 'match-fac-13';

          return (
            <div
              key={f.id}
              className={`glass-card rounded-2xl p-5 border transition-all ${
                isFeatured 
                  ? 'border-primary/40 bg-zinc-900/60 hover:border-primary/60 shadow-md shadow-primary/5' 
                  : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Left Column: Stage, Date, Time */}
                <div className="space-y-1 w-full md:w-56 shrink-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] bg-zinc-950 border border-zinc-800 text-accent font-bold px-2 py-0.5 rounded uppercase">
                      {isThirdPlaceMatch ? '3rd Place Playoff' : f.stage} {f.group ? `• Group ${f.group}` : ''}
                    </span>
                    {isFeatured && (
                      <span className="text-[9px] bg-primary/20 text-primary font-black px-1.5 py-0.5 rounded uppercase">
                        HARIMAU MALAYA
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-zinc-200 mt-1 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{f.date}</span>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{f.time} Local</span>
                    {f.weather && <span className="text-[11px] text-zinc-500">• {f.weather}</span>}
                  </div>
                </div>

                {/* Center Column: Teams, Scores */}
                <div className="flex-1 flex flex-col items-center justify-center gap-2 w-full max-w-lg md:px-4">
                  <div className="flex items-center justify-between gap-4 w-full">
                    {/* Home Team */}
                    <div className="flex items-center gap-2.5 w-5/12 justify-end text-right">
                      <span className={`font-extrabold text-sm sm:text-base ${
                        f.homeTeamId === 'malaysia' ? 'text-amber-300' : 'text-zinc-200'
                      }`}>
                        {home?.name || f.homeTeamId}
                      </span>
                      <span className="text-2xl shrink-0">{home?.flag}</span>
                    </div>

                    {/* Score / VS Box */}
                    <div className="flex flex-col items-center shrink-0">
                      {f.status === 'COMPLETED' ? (
                        <div className={`px-4 py-1.5 rounded-xl text-base font-black tracking-widest border flex items-center gap-2 ${
                          outcome === 'WIN'
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                            : outcome === 'DRAW'
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        }`}>
                          <span>{f.homeScore}</span>
                          <span className="text-xs opacity-60">-</span>
                          <span>{f.awayScore}</span>
                        </div>
                      ) : f.status === 'LIVE' ? (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-black px-3 py-1.5 rounded-xl text-sm animate-pulse">
                          LIVE • {f.homeScore} - {f.awayScore}
                        </div>
                      ) : (
                        <div className="bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-black px-4 py-1.5 rounded-xl text-xs tracking-wider">
                          VS
                        </div>
                      )}

                      {/* Outcome Badge */}
                      {outcome && (
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                          outcome === 'WIN' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : outcome === 'DRAW' 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {outcome === 'WIN' ? 'MALAYSIA WIN' : outcome === 'DRAW' ? 'DRAW' : 'DEFEAT'}
                        </span>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-2.5 w-5/12 justify-start text-left">
                      <span className="text-2xl shrink-0">{away?.flag}</span>
                      <span className={`font-extrabold text-sm sm:text-base ${
                        f.awayTeamId === 'malaysia' ? 'text-amber-300' : 'text-zinc-200'
                      }`}>
                        {away?.name || f.awayTeamId}
                      </span>
                    </div>
                  </div>

                  {/* Scorer Timeline Note */}
                  {matchNote?.scorers && (
                    <div className="text-[11px] text-zinc-400 text-center font-medium bg-zinc-950/60 px-3 py-1 rounded-lg border border-zinc-800/60">
                      {matchNote.scorers}
                    </div>
                  )}
                </div>

                {/* Right Column: Venue & Details */}
                <div className="flex flex-col md:items-end text-xs text-zinc-400 gap-1 w-full md:w-56 shrink-0 border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
                  <div className="flex items-center gap-1.5 text-zinc-200 font-semibold md:text-right">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{venue?.name || 'Gelora Bung Karno Stadium'}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 md:text-right">
                    {venue?.city ? `${venue.city}, ${venue.country}` : 'Jakarta, Indonesia'}
                  </div>
                  {f.referee && (
                    <div className="text-[10px] text-zinc-500 md:text-right">
                      Ref: {f.referee}
                    </div>
                  )}
                  {isThirdPlaceMatch && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      <Award className="h-3 w-3" />
                      <span>3rd Place Bronze Medal</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
