'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFixtures, getTeams, getVenues, Fixture, Team, Venue } from '@/lib/api';
import { Calendar, MapPin, Compass, AlertCircle, Clock, CloudRain } from 'lucide-react';

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Group Stage' | 'Semi Final' | 'Final'>('ALL');

  useEffect(() => {
    async function loadData() {
      const f = await getFixtures();
      const t = await getTeams();
      const v = await getVenues();
      setFixtures(f);
      setTeams(t);
      setVenues(v);
    }
    loadData();
  }, []);

  const filteredFixtures = fixtures.filter(f => activeFilter === 'ALL' || f.stage === activeFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span>Tournament Fixtures</span>
        </h1>
        <p className="text-xs text-zinc-400">Chronological schedule of the ASEAN Hyundai Cup 2026 matches.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80 overflow-x-auto self-start">
        {(['ALL', 'Group Stage', 'Semi Final', 'Final'] as const).map((stage) => (
          <button
            key={stage}
            onClick={() => setActiveFilter(stage)}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeFilter === stage ? 'bg-primary text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {stage === 'ALL' ? 'All Stages' : stage + 's'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredFixtures.map((f) => {
          const home = teams.find(t => t.id === f.homeTeamId);
          const away = teams.find(t => t.id === f.awayTeamId);
          const venue = venues.find(v => v.id === f.venueId);
          const isFeatured = f.homeTeamId === 'malaysia' || f.awayTeamId === 'malaysia';

          return (
            <div
              key={f.id}
              className={`glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                isFeatured ? 'border-primary/20 bg-primary/2' : ''
              }`}
            >
              {/* Left Column: Stage, Date, Time */}
              <div className="space-y-1">
                <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-accent font-bold px-2 py-0.5 rounded uppercase">
                  {f.stage}
                </span>
                <div className="text-sm font-bold text-zinc-300 mt-1">{f.date}</div>
                <div className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Kickoff: {f.time} Local</span>
                </div>
              </div>

              {/* Center Column: Teams, Scores */}
              <div className="flex-1 flex items-center justify-between gap-4 max-w-lg w-full md:px-8">
                <div className="flex items-center gap-2.5 w-5/12 justify-end text-right">
                  <span className="font-extrabold text-sm sm:text-base">{home?.name}</span>
                  <span className="text-xl shrink-0">{home?.flag}</span>
                </div>

                <div className="flex flex-col items-center shrink-0">
                  {f.status === 'COMPLETED' ? (
                    <div className="bg-zinc-900 border border-zinc-800 text-primary font-black px-4 py-1 rounded-xl text-base tracking-widest">
                      {f.homeScore} - {f.awayScore}
                    </div>
                  ) : f.status === 'LIVE' ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-black px-3 py-1 rounded-xl text-sm animate-pulse">
                      LIVE • {f.homeScore} - {f.awayScore}
                    </div>
                  ) : (
                    <div className="bg-zinc-900/60 border border-zinc-800 text-zinc-400 font-bold px-4 py-1 rounded-xl text-xs">
                      VS
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-5/12 justify-start text-left">
                  <span className="text-xl shrink-0">{away?.flag}</span>
                  <span className="font-extrabold text-sm sm:text-base">{away?.name}</span>
                </div>
              </div>

              {/* Right Column: Venue and Conditions */}
              <div className="w-full md:w-56 space-y-1.5 text-xs text-zinc-500 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-900">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="line-clamp-1">{venue?.name || 'TBD Venue'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 shrink-0" />
                  <span>Referee: {f.referee}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CloudRain className="h-3.5 w-3.5 shrink-0" />
                  <span>Weather: {f.weather}</span>
                </div>
                {f.status === 'COMPLETED' && (
                  <Link href={`/matches/${f.id}`} className="block text-[10px] text-primary font-bold hover:underline pt-1">
                    View Match Report & Analytics →
                  </Link>
                )}
                {f.status === 'LIVE' && (
                  <Link href={`/matches/${f.id}`} className="block text-[10px] text-red-400 font-bold hover:underline pt-1 animate-pulse">
                    Join Match Live Center →
                  </Link>
                )}
                {f.status === 'UPCOMING' && (
                  <Link href={`/matches/${f.id}`} className="block text-[10px] text-accent font-bold hover:underline pt-1">
                    Pre-Match Details & Predictions →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
