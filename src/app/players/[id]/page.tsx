'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getPlayer, getTeam, Player, Team } from '@/lib/api';
import { ArrowLeft, User, Activity, ShieldAlert, Award } from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

export default function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const playerId = resolvedParams.id;

  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const p = await getPlayer(playerId);
      if (p) {
        const t = await getTeam(p.teamId);
        setPlayer(p);
        setTeam(t);
      }
      setLoading(false);
    }
    loadData();
  }, [playerId]);

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center">Loading player profile...</div>;
  }

  if (!player) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-zinc-500">Player profile not found</div>
        <Link href="/players" className="text-primary hover:underline flex items-center gap-1 justify-center">
          <ArrowLeft className="h-4 w-4" /> Back to Players
        </Link>
      </div>
    );
  }

  // Prep Radar Chart data
  const radarData = player.radar ? [
    { subject: 'Pace', A: player.radar.pace, fullMark: 100 },
    { subject: 'Shooting', A: player.radar.shooting, fullMark: 100 },
    { subject: 'Passing', A: player.radar.passing, fullMark: 100 },
    { subject: 'Dribbling', A: player.radar.dribbling, fullMark: 100 },
    { subject: 'Defending', A: player.radar.defending, fullMark: 100 },
    { subject: 'Physical', A: player.radar.physical, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/players" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Players
      </Link>

      {/* Header */}
      <section className="glass-card rounded-2xl p-6 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-xl text-primary overflow-hidden shadow">
            {player.photo ? (
              <img 
                src={player.photo} 
                alt={player.name} 
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
            <span className={player.photo ? "fallback-number hidden" : "fallback-number"}>#{player.number}</span>
          </div>
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <span className="bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-xs px-2.5 py-1 rounded font-black">
                #{player.number}
              </span>
              <span>{player.name}</span>
            </h1>
            <p className="text-xs text-zinc-400">
              {player.position} • {team?.flag} {team?.name} • {player.club}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 w-full md:w-auto justify-between">
          <div className="text-right pr-4 border-r border-zinc-850">
            <span className="text-[9px] text-zinc-500 block uppercase font-bold">Appearances</span>
            <span className="font-extrabold text-sm text-zinc-200">{player.appearances}</span>
          </div>
          <div className="text-right px-4 border-r border-zinc-850">
            <span className="text-[9px] text-zinc-500 block uppercase font-bold">Minutes</span>
            <span className="font-extrabold text-sm text-zinc-200">{player.minutes}'</span>
          </div>
          <div className="text-right pl-4">
            <span className="text-[9px] text-zinc-500 block uppercase font-bold">Avg Rating</span>
            <span className="font-black text-base text-accent">{player.averageRating}</span>
          </div>
        </div>
      </section>

      {/* Stats and Radar charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detailed Stats */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-zinc-800 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2">TOURNAMENT STATISTICS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-850">
              <span className="text-[9px] text-zinc-500 block uppercase font-bold">Goals</span>
              <span className="text-base font-black text-primary mt-1 block">{player.goals}</span>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-850">
              <span className="text-[9px] text-zinc-500 block uppercase font-bold">Assists</span>
              <span className="text-base font-black text-accent mt-1 block">{player.assists}</span>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-850">
              <span className="text-[9px] text-zinc-500 block uppercase font-bold">Expected Goals (xG)</span>
              <span className="text-base font-black text-zinc-200 mt-1 block">{player.expectedGoals}</span>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-850">
              <span className="text-[9px] text-zinc-500 block uppercase font-bold">Expected Assists (xA)</span>
              <span className="text-base font-black text-zinc-200 mt-1 block">{player.expectedAssists}</span>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-850">
              <span className="text-[9px] text-zinc-500 block uppercase font-bold">Passing Accuracy</span>
              <span className="text-base font-black text-zinc-200 mt-1 block">{player.passingAccuracy}%</span>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-850">
              <span className="text-[9px] text-zinc-500 block uppercase font-bold">Recoveries</span>
              <span className="text-base font-black text-zinc-200 mt-1 block">{player.recoveries}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-850">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">Physical Metrics</span>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Height:</span> <span className="font-bold text-zinc-200">{player.height} cm</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Weight:</span> <span className="font-bold text-zinc-200">{player.weight} kg</span>
                </div>
              </div>
            </div>
            <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-850">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">Running Stats</span>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Sprint Speed:</span> <span className="font-bold text-zinc-200">{player.sprintSpeed || 30.5} km/h</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Distance:</span> <span className="font-bold text-zinc-200">{player.distanceCovered || 34.2} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attribute Radar Chart */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between items-center min-h-75">
          <div className="w-full">
            <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2">PLAYER ATTRIBUTES</h3>
          </div>
          {radarData.length > 0 ? (
            <div className="w-full h-55 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#27272a" tick={false} />
                  <Radar name={player.name} dataKey="A" stroke="#facc15" fill="#facc15" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-zinc-500 text-xs py-12">No radar attributes configured for this player.</div>
          )}
        </div>
      </section>

      {/* AI analysis */}
      {player.aiAnalysis && (
        <section className="glass-card rounded-2xl p-6 border border-zinc-800 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-1.5">
            <Activity className="h-4.5 w-4.5 text-primary" />
            <span>AI Performance Report</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-zinc-500 font-bold block uppercase text-[10px]">Playing Style Description</span>
                <p className="text-zinc-300 leading-relaxed mt-1">{player.aiAnalysis.playingStyle}</p>
              </div>
              <div>
                <span className="text-emerald-400 font-bold block uppercase text-[10px]">Key Strengths</span>
                <ul className="list-disc list-inside text-zinc-300 space-y-1 mt-1.5">
                  {player.aiAnalysis.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <span className="text-red-400 font-bold block uppercase text-[10px]">Identified Weaknesses</span>
              <ul className="list-disc list-inside text-zinc-300 space-y-1 mt-1.5">
                {player.aiAnalysis.weaknesses.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
