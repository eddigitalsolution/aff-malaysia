'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTeams, Team } from '@/lib/api';
import { Shield, Users, Compass, Award } from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getTeams();
      setTeams(data);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span>Participating Teams</span>
        </h1>
        <p className="text-xs text-zinc-400">Click on any team to view their tactics, full squad roster, and detailed analytics.</p>
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
