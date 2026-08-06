'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getMatch, getTeam, MatchDetails, Team, StartingXIPlayer } from '@/lib/api';
import { useAppState } from '@/store';
import { ArrowLeft, Clock, Activity, Zap, Play, CheckCircle, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.id;

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  // Live timer states from store
  const { liveMinute, incrementLiveMinute, resetLiveMinute } = useAppState();

  useEffect(() => {
    async function loadData() {
      const m = await getMatch(matchId);
      if (m) {
        setMatch(m);
        const home = await getTeam(m.homeTeamId);
        const away = await getTeam(m.awayTeamId);
        setHomeTeam(home);
        setAwayTeam(away);
      }
      setLoading(false);
    }
    loadData();
  }, [matchId]);

  // Live simulator timer effect
  useEffect(() => {
    if (match?.status !== 'LIVE') return;
    
    resetLiveMinute();
    const interval = setInterval(() => {
      incrementLiveMinute();
    }, 5000); // increment every 5s for demo speed

    return () => clearInterval(interval);
  }, [match?.status]);

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center">Loading match details...</div>;
  }

  if (!match || !homeTeam || !awayTeam) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-zinc-500">Match details not found</div>
        <Link href="/" className="text-primary hover:underline flex items-center gap-1 justify-center">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const isLive = match.status === 'LIVE';
  const currentMinute = isLive ? liveMinute : 90;

  // Filter timeline events depending on current live minute
  const filteredTimeline = match.timeline.filter(e => e.minute <= currentMinute);

  // Dynamic possession if live
  const possession = isLive 
    ? [Math.min(70, Math.max(30, match.statistics.possession[0] + (currentMinute % 2 === 0 ? 1 : -1))), 0]
    : match.statistics.possession;
  possession[1] = 100 - possession[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
      </Link>

      {/* Header Match Card */}
      <section className="glass-card rounded-2xl p-6 border border-zinc-800 text-center relative overflow-hidden">
        {isLive && (
          <div className="absolute top-0 inset-x-0 h-1 bg-red-500 animate-pulse" />
        )}
        <div className="flex justify-between items-center text-xs text-zinc-500 mb-4">
          <span>ASEAN Hyundai Cup 2026</span>
          {isLive ? (
            <span className="bg-red-500/10 text-red-500 font-black px-2.5 py-1 rounded border border-red-500/30 animate-pulse flex items-center gap-1">
              <Play className="h-3 w-3 fill-red-500" /> LIVE • {currentMinute}'
            </span>
          ) : (
            <span className="bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded">FT</span>
          )}
        </div>

        {/* Score & Flag Row */}
        <div className="flex justify-between items-center max-w-xl mx-auto py-2">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-1.5 w-1/3">
            <span className="text-4xl">{homeTeam.flag}</span>
            <span className="font-extrabold text-sm sm:text-base">{homeTeam.name}</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase">{match.formations.home}</span>
          </div>

          {/* Scores */}
          <div className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl font-black text-primary tracking-widest bg-zinc-900 border border-zinc-800 px-6 py-2.5 rounded-2xl shadow">
              {match.homeScore} - {match.awayScore}
            </div>
            <span className="text-[10px] text-zinc-500 mt-2 font-bold uppercase">
              xG: {match.statistics.expectedGoals[0]} - {match.statistics.expectedGoals[1]}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-1.5 w-1/3">
            <span className="text-4xl">{awayTeam.flag}</span>
            <span className="font-extrabold text-sm sm:text-base">{awayTeam.name}</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase">{match.formations.away}</span>
          </div>
        </div>

        {/* Referee and Weather */}
        <div className="mt-4 border-t border-zinc-900 pt-3 text-[11px] text-zinc-500 flex justify-center gap-6">
          <span>Referee: {match.referee}</span>
          <span>Weather: {match.weather}</span>
        </div>
      </section>

      {/* Main Grid: stats, timelines, lineups */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Statistics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2">MATCH STATISTICS</h3>
            <div className="space-y-4 text-xs">
              {/* Possession */}
              <div>
                <div className="flex justify-between text-zinc-400 font-bold mb-1">
                  <span>{possession[0]}%</span>
                  <span>Possession</span>
                  <span>{possession[1]}%</span>
                </div>
                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full" style={{ width: `${possession[0]}%` }} />
                  <div className="bg-accent h-full" style={{ width: `${possession[1]}%` }} />
                </div>
              </div>

              {/* Expected Goals */}
              <div>
                <div className="flex justify-between text-zinc-400 font-bold mb-1">
                  <span>{match.statistics.expectedGoals[0]}</span>
                  <span>Expected Goals (xG)</span>
                  <span>{match.statistics.expectedGoals[1]}</span>
                </div>
                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full" style={{ width: `${(match.statistics.expectedGoals[0] / (match.statistics.expectedGoals[0] + match.statistics.expectedGoals[1])) * 100}%` }} />
                  <div className="bg-accent h-full" style={{ width: `${(match.statistics.expectedGoals[1] / (match.statistics.expectedGoals[0] + match.statistics.expectedGoals[1])) * 100}%` }} />
                </div>
              </div>

              {/* Total Shots */}
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/60">
                <span className="font-bold">{match.statistics.shots[0]}</span>
                <span className="text-zinc-500 uppercase font-semibold text-[10px]">Total Shots</span>
                <span className="font-bold">{match.statistics.shots[1]}</span>
              </div>

              {/* Shots on Target */}
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/60">
                <span className="font-bold">{match.statistics.shotsOnTarget[0]}</span>
                <span className="text-zinc-500 uppercase font-semibold text-[10px]">Shots On Target</span>
                <span className="font-bold">{match.statistics.shotsOnTarget[1]}</span>
              </div>

              {/* Passing Accuracy */}
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/60">
                <span className="font-bold">{match.statistics.passAccuracy[0]}%</span>
                <span className="text-zinc-500 uppercase font-semibold text-[10px]">Pass Accuracy</span>
                <span className="font-bold">{match.statistics.passAccuracy[1]}%</span>
              </div>

              {/* Corners */}
              <div className="flex justify-between items-center">
                <span className="font-bold">{match.statistics.corners[0]}</span>
                <span className="text-zinc-500 uppercase font-semibold text-[10px]">Corners</span>
                <span className="font-bold">{match.statistics.corners[1]}</span>
              </div>
            </div>
          </div>

          {/* Real-time pressure chart */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800">
            <h3 className="font-bold text-sm text-zinc-300 mb-4 flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-accent" />
              <span>PRESSURE MOMENTUM</span>
            </h3>
            <div className="h-50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={match.pressureChart.filter(p => p.minute <= currentMinute)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="minute" stroke="#71717a" fontSize={10} />
                  <YAxis stroke="#71717a" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                  <Area type="monotone" dataKey="value" stroke="#facc15" fill="#facc15" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase mt-2">
              <span>← {homeTeam.name} Advantage</span>
              <span>{awayTeam.name} Advantage →</span>
            </div>
          </div>
        </div>

        {/* Live Timeline and AI summaries */}
        <div className="space-y-6">
          {/* Match events timeline */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-2">MATCH TIMELINE</h3>
            
            {filteredTimeline.length === 0 ? (
              <div className="text-center text-zinc-500 text-xs py-8">Waiting for events...</div>
            ) : (
              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-850">
                {filteredTimeline.map((e, idx) => (
                  <div key={idx} className="flex gap-3 items-start relative text-xs">
                    <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-[10px] text-primary shrink-0 relative z-10">
                      {e.minute}'
                    </div>
                    <div>
                      <div className="font-extrabold text-zinc-200">
                        {e.type} • {e.playerName}
                      </div>
                      <span className="text-[10px] text-zinc-500">{e.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Tactical summary */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3">
            <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-1.5">
              <Zap className="h-4.5 w-4.5 text-primary" />
              <span>AI MATCH SUMMARY</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{match.aiSummary}</p>
            {match.manOfTheMatch && !isLive && (
              <div className="mt-2 bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-primary font-bold">MAN OF THE MATCH:</span>
                <span className="font-extrabold text-zinc-200">{match.manOfTheMatch}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
