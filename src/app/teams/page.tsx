'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTeams, TOURNAMENTS, Team } from '@/lib/api';
import { useAppState } from '@/store';
import { Shield, Users, Compass, Award, Trophy, Globe } from 'lucide-react';

export default function TeamsPage() {
  const { activeTournamentId, setActiveTournamentId } = useAppState();
  const [teams, setTeams] = useState<Team[]>([]);

  const currentTournament = TOURNAMENTS.find(t => t.id === activeTournamentId) || TOURNAMENTS[0];
  const isFifa = activeTournamentId === 'fifa-asean-cup-2026';

  useEffect(() => {
    async function loadData() {
      const data = await getTeams(activeTournamentId);
      setTeams(data);
    }
    loadData();
  }, [activeTournamentId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Tournament Selection Header Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl w-full max-w-full">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl flex-1 sm:flex-initial overflow-x-auto scrollbar-none max-w-full">
          {TOURNAMENTS.map(t => {
            const active = t.id === activeTournamentId;
            const isFifaTournament = t.id === 'fifa-asean-cup-2026';
            return (
              <button
                key={t.id}
                onClick={() => setActiveTournamentId(t.id)}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? isFifaTournament
                      ? 'bg-amber-400 text-zinc-950 shadow-md font-black'
                      : 'bg-emerald-400 text-zinc-950 shadow-md font-black'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Trophy className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">{t.name}</span>
                <span className="sm:hidden">{t.shortName}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase shrink-0 ${
                  active ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {isFifaTournament ? 'FIFA' : 'AFF'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-3 py-1 text-xs text-zinc-400 font-medium hidden sm:block">
          {currentTournament.sanction}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span>{currentTournament.name} Participating Teams</span>
        </h1>
        <p className="text-xs text-zinc-400">
          {isFifa 
            ? '8 Division 1 nations competing in Jakarta & Bandung across Group A & Group B.' 
            : '10 ASEAN nations competing across Group A & Group B in the Home & Away championship.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((t) => {
          const isFeatured = t.id === 'malaysia';
          return (
            <Link
              key={t.id}
              href={isFeatured ? '/malaysia' : `/teams/${t.id}`}
              className={`block glass-card rounded-2xl p-5 border border-zinc-800 glass-card-hover ${
                isFeatured ? 'bg-primary/5 border-primary/30 glow-yellow' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.flag}</span>
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-1.5">
                      {t.name}
                      {isFeatured && (
                        <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                          PREMIUM
                        </span>
                      )}
                    </h3>
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Group {t.group} • FIFA #{t.fifaRanking}</span>
                  </div>
                </div>
              </div>

              {/* Tactical summary */}
              <div className="grid grid-cols-3 gap-2 border-t border-zinc-900 pt-3 text-center">
                <div>
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">Tactics</div>
                  <div className="text-xs font-bold text-zinc-300">{t.formation}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">Avg Age</div>
                  <div className="text-xs font-bold text-zinc-300">{t.averageAge}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">Value</div>
                  <div className="text-xs font-bold text-zinc-300">{t.squadValue}</div>
                </div>
              </div>

              {/* Ratings */}
              <div className="mt-4 space-y-2 border-t border-zinc-900 pt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Attack</span>
                  <div className="w-2/3 bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${t.ratings.attack}%` }} />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Midfield</span>
                  <div className="w-2/3 bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: `${t.ratings.midfield}%` }} />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Defense</span>
                  <div className="w-2/3 bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${t.ratings.defense}%` }} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
