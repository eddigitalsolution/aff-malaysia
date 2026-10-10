'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getPlayers, Player } from '@/lib/api';
import { 
  Swords, Calendar, MapPin, Trophy, Shield, Users, Star, 
  ArrowRight, Flame, Target, Activity, CheckCircle2, ChevronRight, UserCheck,
  RotateCcw, ChevronDown, ArrowLeftRight, Layers, Eye, Compass, Sparkles
} from 'lucide-react';

/* ---------------------------------------------------------
   SVG FLAGS (Cross-platform crisp rendering without Windows emoji fallback)
--------------------------------------------------------- */
function FlagMalaysia({ className = "w-8 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 280" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="my-flag-clip">
          <rect width="560" height="280" rx="24" />
        </clipPath>
      </defs>
      <g clipPath="url(#my-flag-clip)">
        {/* 14 Stripes */}
        {[...Array(14)].map((_, i) => (
          <rect key={i} y={i * 20} width="560" height="20" fill={i % 2 === 0 ? "#cc0000" : "#ffffff"} />
        ))}
        {/* Blue Canton */}
        <rect width="280" height="160" fill="#000066" />
        {/* Crescent */}
        <circle cx="115" cy="80" r="55" fill="#ffcc00" />
        <circle cx="127" cy="80" r="48" fill="#000066" />
        {/* 14-Point Star */}
        <path
          d="M 160 80 L 168 70 L 178 74 L 175 85 L 182 92 L 172 95 L 168 105 L 160 98 L 152 105 L 148 95 L 138 92 L 145 85 L 142 74 L 152 70 Z"
          fill="#ffcc00"
        />
      </g>
    </svg>
  );
}

function FlagChina({ className = "w-8 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 600" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="cn-flag-clip">
          <rect width="900" height="600" rx="48" />
        </clipPath>
      </defs>
      <g clipPath="url(#cn-flag-clip)">
        <rect width="900" height="600" fill="#de2910" />
        {/* Big star */}
        <polygon points="150,75 168,131 228,131 179,166 198,222 150,187 102,222 121,166 72,131 132,131" fill="#ffde00" />
        {/* 4 Arc stars */}
        <polygon points="300,45 306,63 325,63 310,75 316,93 300,82 284,93 290,75 275,63 294,63" fill="#ffde00" transform="rotate(23 300 65)" />
        <polygon points="360,105 366,123 385,123 370,135 376,153 360,142 344,153 350,135 335,123 354,123" fill="#ffde00" transform="rotate(45 360 125)" />
        <polygon points="360,195 366,213 385,213 370,225 376,243 360,232 344,243 350,225 335,213 354,213" fill="#ffde00" transform="rotate(0 360 215)" />
        <polygon points="300,255 306,273 325,273 310,285 316,303 300,292 284,303 290,285 275,273 294,273" fill="#ffde00" transform="rotate(70 300 275)" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------
   TACTICAL FORMATIONS & ROLES CONFIGURATION
--------------------------------------------------------- */
interface PitchSlot {
  slotId: string;
  x: number;
  y: number;
  role: string;
  defaultPlayerId: string;
}

interface FormationConfig {
  label: string;
  description: string;
  slots: PitchSlot[];
  tactics: {
    inPossession: string;
    outOfPossession: string;
    keyMatchup: string;
  };
}

const FORMATIONS: Record<string, FormationConfig> = {
  '3-4-3': {
    label: '3-4-3 Dynamic Wing Overload',
    description: 'Primary attacking setup with Bergson & Arif Aiman exploiting China’s slow lateral recovery.',
    slots: [
      { slotId: 'gk',  x: 50, y: 90, role: 'GK',  defaultPlayerId: 'syihan-hazmi' },
      { slotId: 'lcb', x: 26, y: 72, role: 'LCB', defaultPlayerId: 'daniel-ting' },
      { slotId: 'cb',  x: 50, y: 74, role: 'CB',  defaultPlayerId: 'brad-tapp' },
      { slotId: 'rcb', x: 74, y: 72, role: 'RCB', defaultPlayerId: 'dion-cools' },
      {slotId: 'lwb', x: 16, y: 48, role: 'LWB', defaultPlayerId: 'corbin-ong' },
      { slotId: 'lcm', x: 37, y: 48, role: 'CM',  defaultPlayerId: 'stuart-wilkin' },
      { slotId: 'rcm', x: 63, y: 48, role: 'CDM', defaultPlayerId: 'nooa-laine' },
      { slotId: 'rwb', x: 84, y: 48, role: 'RWB', defaultPlayerId: 'quentin-cheng' },
      { slotId: 'lw',  x: 22, y: 22, role: 'LW',  defaultPlayerId: 'manuel-hidalgo' },
      { slotId: 'st',  x: 50, y: 14, role: 'ST',  defaultPlayerId: 'bergson' },
      { slotId: 'rw',  x: 78, y: 22, role: 'RW',  defaultPlayerId: 'arif-aiman' },
    ],
    tactics: {
      inPossession: 'Arif Aiman & Hidalgo isolate China’s fullbacks in 1v1 duels. Corbin-Ong & Quentin Cheng overlap to provide crossing service for Bergson.',
      outOfPossession: 'Wingbacks drop into a compact 5-man line. Daniel Ting (LCB) locks down the left defensive channel, Brad Tapp (CB) anchors the central box, and Dion Cools (RCB) commands the right half-space.',
      keyMatchup: 'Arif Aiman vs China Left Back · Dion Cools (RCB) vs China Left Winger/Striker'
    }
  },
  '4-3-3': {
    label: '4-3-3 Balanced High-Press',
    description: 'Midfield control shape with Nooa Laine anchoring and Wan Kuzain distributing.',
    slots: [
      { slotId: 'gk',  x: 50, y: 90, role: 'GK',  defaultPlayerId: 'syihan-hazmi' },
      { slotId: 'lb',  x: 16, y: 70, role: 'LB',  defaultPlayerId: 'daniel-ting' },
      { slotId: 'lcb', x: 37, y: 72, role: 'CB',  defaultPlayerId: 'brad-tapp' },
      { slotId: 'rcb', x: 63, y: 72, role: 'RCB', defaultPlayerId: 'dion-cools' },
      { slotId: 'rb',  x: 84, y: 70, role: 'RB',  defaultPlayerId: 'quentin-cheng' },
      { slotId: 'cdm', x: 50, y: 54, role: 'CDM', defaultPlayerId: 'nooa-laine' },
      { slotId: 'lcm', x: 30, y: 40, role: 'CM',  defaultPlayerId: 'stuart-wilkin' },
      { slotId: 'rcm', x: 70, y: 40, role: 'CM',  defaultPlayerId: 'wan-kuzain' },
      { slotId: 'lw',  x: 22, y: 22, role: 'LW',  defaultPlayerId: 'manuel-hidalgo' },
      { slotId: 'st',  x: 50, y: 14, role: 'ST',  defaultPlayerId: 'bergson' },
      { slotId: 'rw',  x: 78, y: 22, role: 'RW',  defaultPlayerId: 'arif-aiman' },
    ],
    tactics: {
      inPossession: 'Wan Kuzain and Wilkin cycle possession with 91%+ pass efficiency. Wingers pin China’s backline deep into Tianhe Stadium half.',
      outOfPossession: 'Daniel Ting (LB) and Brad Tapp (CB) clamp down on the left defensive half, while Dion Cools (RCB) steps up to intercept through-balls into the right channels.',
      keyMatchup: 'Dion Cools (RCB) & Quentin Cheng (RB) vs China Left Flank Overload'
    }
  },
  '5-3-2': {
    label: '5-3-2 Low-Block Counter (Match 2)',
    description: 'Combined dual-tournament rotation structure featuring Fergus Tierney & Paulo Josué.',
    slots: [
      { slotId: 'gk',  x: 50, y: 90, role: 'GK',  defaultPlayerId: 'azri-ghani' },
      { slotId: 'lwb', x: 16, y: 48, role: 'LWB', defaultPlayerId: 'faris-danish' },
      { slotId: 'lcb', x: 28, y: 72, role: 'LCB', defaultPlayerId: 'daniel-ting' },
      { slotId: 'cb',  x: 50, y: 74, role: 'CB',  defaultPlayerId: 'brad-tapp' },
      { slotId: 'rcb', x: 72, y: 72, role: 'RCB', defaultPlayerId: 'dion-cools' },
      { slotId: 'rwb', x: 84, y: 48, role: 'RWB', defaultPlayerId: 'quentin-cheng' },
      { slotId: 'lcm', x: 30, y: 42, role: 'CM',  defaultPlayerId: 'wan-kuzain' },
      { slotId: 'cdm', x: 50, y: 52, role: 'CDM', defaultPlayerId: 'nooa-laine' },
      { slotId: 'rcm', x: 70, y: 42, role: 'CM',  defaultPlayerId: 'sergio-aguero' },
      { slotId: 'ls',  x: 35, y: 18, role: 'ST',  defaultPlayerId: 'fergus-tierney' },
      { slotId: 'rs',  x: 65, y: 18, role: 'ST',  defaultPlayerId: 'paulo-josue-fifa' },
    ],
    tactics: {
      inPossession: 'Direct vertical releases into the channels for Fergus Tierney (Vietnam winner) and Paulo Josué (4 goals combined) to hold up play.',
      outOfPossession: 'Daniel Ting (LCB) shifts wide to cover the left flank while Brad Tapp (CB) and Harith Haikal command the penalty box.',
      keyMatchup: 'Dion Cools (RCB) defensive anticipation · Azri Ghani shot-stopping'
    }
  },
  '4-2-3-1': {
    label: '4-2-3-1 Dual Pivot Control',
    description: 'Disciplined midfield shield with Paulo Josué pulling strings behind Bergson.',
    slots: [
      { slotId: 'gk',  x: 50, y: 90, role: 'GK',  defaultPlayerId: 'syihan-hazmi' },
      { slotId: 'lb',  x: 16, y: 70, role: 'LB',  defaultPlayerId: 'corbin-ong' },
      { slotId: 'lcb', x: 37, y: 72, role: 'LCB', defaultPlayerId: 'daniel-ting' },
      { slotId: 'rcb', x: 63, y: 72, role: 'RCB', defaultPlayerId: 'dion-cools' },
      { slotId: 'rb',  x: 84, y: 70, role: 'RB',  defaultPlayerId: 'quentin-cheng' },
      { slotId: 'ldm', x: 35, y: 54, role: 'CDM', defaultPlayerId: 'stuart-wilkin' },
      { slotId: 'rdm', x: 65, y: 54, role: 'CDM', defaultPlayerId: 'nooa-laine' },
      { slotId: 'lam', x: 22, y: 30, role: 'LW',  defaultPlayerId: 'manuel-hidalgo' },
      { slotId: 'cam', x: 50, y: 30, role: 'CAM', defaultPlayerId: 'paulo-josue-fifa' },
      { slotId: 'ram', x: 78, y: 30, role: 'RW',  defaultPlayerId: 'arif-aiman' },
      { slotId: 'st',  x: 50, y: 14, role: 'ST',  defaultPlayerId: 'bergson' },
    ],
    tactics: {
      inPossession: 'Paulo Josué operates freely in Zone 14 between China’s lines. Nooa Laine & Stuart Wilkin maintain structural balance.',
      outOfPossession: 'Daniel Ting (LCB) and Brad Tapp / Harith Haikal (CB) form an impenetrable central pairing with Dion Cools (RCB) covering the right channel.',
      keyMatchup: 'Paulo Josué creative delivery · Dion Cools (RCB) backline leadership'
    }
  }
};

const ROLE_COLORS: Record<string, string> = {
  GK: '#94a3b8',
  CB: '#34d399', RCB: '#34d399', LCB: '#34d399', LB: '#34d399', RB: '#34d399', LWB: '#34d399', RWB: '#34d399',
  CM: '#60a5fa', CDM: '#38bdf8', CAM: '#818cf8', LM: '#60a5fa', RM: '#60a5fa',
  LW: '#facc15', RW: '#facc15', ST: '#f59e0b', CF: '#f59e0b', LS: '#f59e0b', RS: '#f59e0b'
};

import playersData from '../../../data/players.json';

const initialSquad = (playersData as unknown as Player[]).filter(p => p.isChinaCallUp);

export default function FriendlyChinaPage() {
  const [players, setPlayers] = useState<Player[]>(initialSquad);
  const [activeTab, setActiveTab] = useState<'All' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('All');
  const [tournamentFilter, setTournamentFilter] = useState<'All' | 'Both' | 'FIFA' | 'AFF' | 'Potential'>('All');

  // Tactical Planner State
  const [selectedFormationKey, setSelectedFormationKey] = useState<string>('3-4-3');
  const [lineupPreset, setLineupPreset] = useState<'match1' | 'match2'>('match1');
  const [flowMode, setFlowMode] = useState<'none' | 'attacking' | 'defensive'>('none');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Map of slotId -> playerId
  const [customSlotAssignments, setCustomSlotAssignments] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      const allPlayers = await getPlayers('malaysia');
      const squad = allPlayers.filter(p => p.isChinaCallUp);
      if (squad.length > 0) {
        setPlayers(squad);
      }
    }
    loadData();
  }, []);

  const currentFormation = FORMATIONS[selectedFormationKey] || FORMATIONS['3-4-3'];

  // Reset or switch lineup preset
  const handlePresetChange = (preset: 'match1' | 'match2') => {
    setLineupPreset(preset);
    setSelectedSlotId(null);
    if (preset === 'match1') {
      setSelectedFormationKey('3-4-3');
      setCustomSlotAssignments({});
    } else {
      setSelectedFormationKey('5-3-2');
      setCustomSlotAssignments({});
    }
  };

  const handleFormationSelect = (fmKey: string) => {
    setSelectedFormationKey(fmKey);
    setSelectedSlotId(null);
    setCustomSlotAssignments({});
  };

  // Resolve player in a slot
  const getPlayerForSlot = (slot: PitchSlot): Player | undefined => {
    const assignedId = customSlotAssignments[slot.slotId] || slot.defaultPlayerId;
    return players.find(p => p.id === assignedId);
  };

  // Active starting 11 IDs
  const activePitchPlayerIds = useMemo(() => {
    return new Set(currentFormation.slots.map(s => {
      return customSlotAssignments[s.slotId] || s.defaultPlayerId;
    }));
  }, [currentFormation, customSlotAssignments]);

  // Bench players (the rest of the 26-man squad)
  const benchPlayers = useMemo(() => {
    return players.filter(p => !activePitchPlayerIds.has(p.id));
  }, [players, activePitchPlayerIds]);

  // Swap bench player into selected slot or auto-select matching slot
  const handleBenchClick = (benchPlayer: Player) => {
    if (selectedSlotId) {
      handleSwapPlayer(benchPlayer.id);
    } else {
      // Auto-select a matching slot on the pitch (Dion Cools strictly targets RCB or RB)
      const matchingSlot = currentFormation.slots.find(s => {
        if (benchPlayer.id === 'dion-cools') return ['RCB', 'RB'].includes(s.role) || (s.role === 'CB' && s.x > 50);
        if (benchPlayer.id === 'harith-haikal' || benchPlayer.id === 'brad-tapp' || benchPlayer.id === 'rodney-celvin') return s.role === 'CB' || ['CB', 'LCB', 'RCB'].includes(s.role);
        if (benchPlayer.id === 'daniel-ting') return ['LCB', 'LB', 'LWB'].includes(s.role);
        if (benchPlayer.id === 'nooa-laine') return ['CDM', 'CM'].includes(s.role);
        if (benchPlayer.id === 'faris-danish') return ['LWB', 'LB'].includes(s.role);
        if (benchPlayer.id === 'daniesh-amirruddin') return ['LW', 'ST', 'RW', 'LS', 'RS'].includes(s.role);
        if (benchPlayer.position === 'Goalkeeper') return s.role === 'GK';
        if (benchPlayer.position === 'Defender') return ['CB', 'RCB', 'LCB', 'LB', 'RB', 'LWB', 'RWB'].includes(s.role);
        if (benchPlayer.position === 'Midfielder') return ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(s.role);
        if (benchPlayer.position === 'Forward') return ['ST', 'CF', 'RW', 'LW', 'LS', 'RS'].includes(s.role);
        return false;
      }) || currentFormation.slots[0];

      if (matchingSlot) {
        setSelectedSlotId(matchingSlot.slotId);
      }
    }
  };

  const handleSwapPlayer = (benchPlayerId: string) => {
    if (!selectedSlotId) return;
    setCustomSlotAssignments(prev => ({
      ...prev,
      [selectedSlotId]: benchPlayerId
    }));
  };

  // Selected player on pitch
  const selectedSlot = currentFormation.slots.find(s => s.slotId === selectedSlotId);
  const selectedPlayer = selectedSlot ? getPlayerForSlot(selectedSlot) : undefined;

  // Reset formation lineup
  const handleResetLineup = () => {
    setCustomSlotAssignments({});
    setSelectedSlotId(null);
    setFlowMode('none');
  };

  // Provenance grouping lists
  const dualPlayers = useMemo(() => players.filter(p => p.tournamentProvenance?.includes('Both')), [players]);
  const fifaPlayers = useMemo(() => players.filter(p => (p.tournamentProvenance?.includes('FIFA') || false) && !p.tournamentProvenance?.includes('Both') && !p.tournamentProvenance?.includes('Potential')), [players]);
  const affPlayers = useMemo(() => players.filter(p => (p.tournamentProvenance?.includes('Hyundai') || p.tournamentProvenance?.includes('AFF') || false) && !p.tournamentProvenance?.includes('Both') && !p.tournamentProvenance?.includes('Potential')), [players]);
  const potentialPlayers = useMemo(() => players.filter(p => p.tournamentProvenance?.includes('Potential')), [players]);

  // Filtered 26-man squad list
  const filteredSquad = useMemo(() => {
    return players.filter(p => {
      const matchesPos = activeTab === 'All' || p.position === activeTab;
      let matchesTour = true;
      if (tournamentFilter === 'Both') {
        matchesTour = p.tournamentProvenance?.includes('Both') || false;
      } else if (tournamentFilter === 'FIFA') {
        matchesTour = (p.tournamentProvenance?.includes('FIFA') || false) && !p.tournamentProvenance?.includes('Both') && !p.tournamentProvenance?.includes('Potential');
      } else if (tournamentFilter === 'AFF') {
        matchesTour = (p.tournamentProvenance?.includes('Hyundai') || p.tournamentProvenance?.includes('AFF') || false) && !p.tournamentProvenance?.includes('Both') && !p.tournamentProvenance?.includes('Potential');
      } else if (tournamentFilter === 'Potential') {
        matchesTour = p.tournamentProvenance?.includes('Potential') || false;
      }
      return matchesPos && matchesTour;
    });
  }, [players, activeTab, tournamentFilter]);

  const goalkeepers = useMemo(() => players.filter(p => p.position === 'Goalkeeper'), [players]);
  const defenders = useMemo(() => players.filter(p => p.position === 'Defender'), [players]);
  const midfielders = useMemo(() => players.filter(p => p.position === 'Midfielder'), [players]);
  const forwards = useMemo(() => players.filter(p => p.position === 'Forward'), [players]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================
          HERO BANNER & H2H FIX
      ========================================================= */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-linear-to-br from-zinc-900 via-zinc-950 to-black p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Match Details & Headline */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
                <Swords className="h-3.5 w-3.5" />
                <span>FIFA Tier 1 International Friendly Double-Header</span>
              </div>

              {/* Title with balanced sizing so it fits cleanly */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="text-white">Malaysia</span>
                <span className="text-zinc-500 font-light text-xl sm:text-2xl lg:text-3xl">vs</span>
                <span className="text-amber-400">China PR</span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                Harimau Malaya travel to Guangzhou for two high-stakes Tier 1 international fixtures against China PR on <strong className="text-amber-400 whitespace-nowrap">November 14 and 17, 2026</strong>. The official 26-player squad combines the premier performers across both the <strong className="text-amber-400">2026 FIFA ASEAN Cup</strong> and the <strong className="text-emerald-400">ASEAN Hyundai Cup</strong>, highlighted by top stars from each campaign alongside versatile players who featured in both tournaments.
              </p>
            </div>

            {/* Badges in a tidy single horizontal row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-300 font-semibold">
              <span className="inline-flex items-center gap-1.5 bg-zinc-900/90 px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm shrink-0 whitespace-nowrap">
                <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span>Guangzhou, China</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-zinc-900/90 px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm shrink-0 whitespace-nowrap">
                <Calendar className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>14 & 17 Nov 2026</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-zinc-900/90 px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm shrink-0 whitespace-nowrap">
                <Trophy className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>FIFA World Ranking Points</span>
              </span>
            </div>
          </div>

          {/* Right Column: H2H Match Preview Card */}
          <div className="lg:col-span-5 xl:col-span-4 w-full bg-zinc-900/95 border border-zinc-800/90 p-5 sm:p-6 rounded-3xl flex flex-col justify-between gap-5 text-center shadow-2xl backdrop-blur-md">
            <div className="w-full flex items-center justify-between pb-2 border-b border-zinc-800/80 text-[10px] font-black uppercase tracking-wider text-zinc-400">
              <span>Match Preview</span>
              <span className="text-red-400">Guangzhou Double-Header</span>
            </div>

            <div className="flex items-center justify-around w-full gap-4">
              {/* Malaysia Badge */}
              <div className="flex flex-col items-center gap-1.5 group">
                <div className="relative p-1 rounded-2xl bg-zinc-950 border border-amber-500/40 shadow-lg shadow-amber-500/10 transition-transform group-hover:scale-105">
                  <FlagMalaysia className="w-14 h-9 rounded-xl shadow-inner" />
                </div>
                <div className="text-sm font-black text-zinc-100 tracking-wide">Malaysia</div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-[10px] text-amber-400 font-extrabold">
                  FIFA #132
                </div>
                <span className="text-[10px] text-zinc-400 font-semibold">Harimau Malaya</span>
              </div>

              {/* VS Pill */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-zinc-400 font-black text-xs uppercase px-3 py-1.5 bg-zinc-950 rounded-xl border border-zinc-800 shadow-inner">
                  VS
                </div>
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">TIER 1</span>
              </div>

              {/* China PR Badge */}
              <div className="flex flex-col items-center gap-1.5 group">
                <div className="relative p-1 rounded-2xl bg-zinc-950 border border-red-500/40 shadow-lg shadow-red-500/10 transition-transform group-hover:scale-105">
                  <FlagChina className="w-14 h-9 rounded-xl shadow-inner" />
                </div>
                <div className="text-sm font-black text-zinc-100 tracking-wide">China PR</div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-400/10 border border-red-400/20 text-[10px] text-red-400 font-extrabold">
                  FIFA #88
                </div>
                <span className="text-[10px] text-zinc-400 font-semibold">Team Dragon</span>
              </div>
            </div>

            <div className="w-full bg-zinc-950/70 border border-zinc-800/70 rounded-2xl p-3 text-left">
              <div className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Historical Context</div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                1–1 Draw in Chengdu (Sep 2023). Harimau Malaya seeking first win on Chinese soil in modern era.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MATCH SCHEDULE DOUBLE-HEADER CARDS
      ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Match 1 */}
        <div className={`glass-card rounded-2xl p-6 border transition-all ${
          lineupPreset === 'match1' 
            ? 'border-amber-500/60 bg-amber-500/5 ring-1 ring-amber-500/30' 
            : 'border-zinc-800 hover:border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-400/15 text-amber-400 border border-amber-400/30">
              Match 1 · Tier 1 Friendly
            </span>
            <span className="text-xs text-zinc-400 font-bold">19:35 (MYT / Local)</span>
          </div>
          <h3 className="text-lg font-black text-zinc-100 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5"><FlagChina className="w-5 h-3.5 inline rounded-xs" /> China PR</span>
            <span className="text-zinc-500 text-sm">vs</span>
            <span className="inline-flex items-center gap-1.5"><FlagMalaysia className="w-5 h-3.5 inline rounded-xs" /> Malaysia</span>
          </h3>
          <div className="mt-3 space-y-1.5 text-xs text-zinc-400">
            <p className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <strong className="text-zinc-200">Saturday, 14 November 2026</strong>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
              <span>Tianhe Stadium, Guangzhou (Capacity: 54,856)</span>
            </p>
            <p className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-zinc-500" />
              <span>Focus: Full-strength 3-4-3 testing Bergson & Arif Aiman counter-threat</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => handlePresetChange('match1')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                lineupPreset === 'match1'
                  ? 'bg-amber-400 text-zinc-950 font-black'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>{lineupPreset === 'match1' ? 'Active in Planner' : 'Load Match 1 Tactics'}</span>
            </button>
            <span className="text-[11px] text-zinc-500">Tianhe Stadium Clash</span>
          </div>
        </div>

        {/* Match 2 */}
        <div className={`glass-card rounded-2xl p-6 border transition-all ${
          lineupPreset === 'match2' 
            ? 'border-red-500/60 bg-red-500/5 ring-1 ring-red-500/30' 
            : 'border-zinc-800 hover:border-red-500/30'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-red-400/15 text-red-400 border border-red-400/30">
              Match 2 · Tier 1 Friendly
            </span>
            <span className="text-xs text-zinc-400 font-bold">19:35 (MYT / Local)</span>
          </div>
          <h3 className="text-lg font-black text-zinc-100 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5"><FlagChina className="w-5 h-3.5 inline rounded-xs" /> China PR</span>
            <span className="text-zinc-500 text-sm">vs</span>
            <span className="inline-flex items-center gap-1.5"><FlagMalaysia className="w-5 h-3.5 inline rounded-xs" /> Malaysia</span>
          </h3>
          <div className="mt-3 space-y-1.5 text-xs text-zinc-400">
            <p className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-red-400" />
              <strong className="text-zinc-200">Tuesday, 17 November 2026</strong>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
              <span>Tianhe Stadium / Yuexiushan, Guangzhou</span>
            </p>
            <p className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-zinc-500" />
              <span>Focus: Tactical rotation, starting minutes for Tierney, Kuzain & Azri</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => handlePresetChange('match2')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                lineupPreset === 'match2'
                  ? 'bg-red-400 text-zinc-950 font-black'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>{lineupPreset === 'match2' ? 'Active in Planner' : 'Load Match 2 Tactics'}</span>
            </button>
            <span className="text-[11px] text-zinc-500">Squad Depth Test</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          INTERACTIVE TACTICAL PLANNER FORMATION
      ========================================================= */}
      <section className="space-y-4">
        {/* Tactical Planner Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-full">
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white">TACTICAL PLANNER FORMATION</h2>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-400/15 border border-amber-400/30 text-amber-400 shrink-0">
                vs China PR · Tier 1
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-normal break-words">
              Select formations, test attacking/defensive tactical movement vectors, and tap pitch players to swap with the bench.
            </p>
          </div>

          {/* Formation Controls Bar */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            {/* Formation Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                id="friendly-formation-select"
                name="formation"
                aria-label="Select friendly match formation"
                value={selectedFormationKey}
                onChange={e => handleFormationSelect(e.target.value)}
                className="w-full appearance-none bg-zinc-950 border border-zinc-700 rounded-xl pl-3 pr-8 py-2 text-xs font-black text-zinc-200 focus:outline-none focus:border-primary cursor-pointer shadow"
              >
                {Object.keys(FORMATIONS).map(f => (
                  <option key={f} value={f}>{f} Formation</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            </div>

            {/* Tactical Movement Flow Buttons */}
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 shadow shrink-0">
              <button
                onClick={() => setFlowMode(prev => prev === 'attacking' ? 'none' : 'attacking')}
                className={`px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                  flowMode === 'attacking' ? 'bg-primary text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Attacking Flow
              </button>
              <button
                onClick={() => setFlowMode(prev => prev === 'defensive' ? 'none' : 'defensive')}
                className={`px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                  flowMode === 'defensive' ? 'bg-red-500 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Defensive Block
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetLineup}
              className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl px-2.5 sm:px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer shadow shrink-0"
              title="Reset formation lineup"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Formation Description Alert */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs w-full max-w-full overflow-hidden">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-black text-amber-400 uppercase tracking-wide text-[11px]">
                {currentFormation.label}
              </span>
              <span className="text-[10px] text-zinc-500 font-bold">· Match Strategy</span>
            </div>
            <p className="text-zinc-300">{currentFormation.description}</p>
          </div>
          <div className="shrink-0 text-[11px] text-zinc-400 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">
            <strong>Key Matchup:</strong> {currentFormation.tactics.keyMatchup}
          </div>
        </div>

        {/* Tactical Pitch & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* THE FOOTBALL PITCH (Left 3 cols, same layout and scale as Tactical Planner) */}
          <div className="lg:col-span-3 space-y-2">
            <div
              className="relative mx-auto w-full max-w-120 aspect-3/4 rounded-2xl overflow-hidden select-none border border-zinc-800 touch-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, #052e16 0%, #022c22 60%, #0a1f15 100%)',
              }}
            >
              {/* Pitch Markings SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 133" preserveAspectRatio="none">
                <defs>
                  <marker id="arrow-attack" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                  </marker>
                  <marker id="arrow-defend" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
                  </marker>
                </defs>
                <rect x="4" y="2" width="92" height="129" fill="none" stroke="#166534" strokeWidth="0.6" />
                <line x1="4" y1="66.5" x2="96" y2="66.5" stroke="#166534" strokeWidth="0.5" />
                <circle cx="50" cy="66.5" r="11" fill="none" stroke="#166534" strokeWidth="0.5" />
                <circle cx="50" cy="66.5" r="0.8" fill="#166534" />
                <rect x="21" y="2" width="58" height="22" fill="none" stroke="#166534" strokeWidth="0.5" />
                <rect x="34" y="2" width="32" height="11" fill="none" stroke="#166534" strokeWidth="0.5" />
                <rect x="21" y="109" width="58" height="22" fill="none" stroke="#166534" strokeWidth="0.5" />
                <rect x="34" y="120" width="32" height="11" fill="none" stroke="#166534" strokeWidth="0.5" />
                <path d="M34 24 A13 13 0 0 1 66 24" fill="none" stroke="#166534" strokeWidth="0.5" />
                <path d="M34 109 A13 13 0 0 0 66 109" fill="none" stroke="#166534" strokeWidth="0.5" />
                {/* Goal */}
                <rect x="43" y="0" width="14" height="2.5" fill="none" stroke="#166534" strokeWidth="0.5" />
                <rect x="43" y="130.5" width="14" height="2.5" fill="none" stroke="#166534" strokeWidth="0.5" />

                {/* Render movement vectors when flow is active */}
                {flowMode !== 'none' && currentFormation.slots.map(slot => {
                  if (slot.role === 'GK') return null;

                  const isAttacking = flowMode === 'attacking';
                  const color = isAttacking ? '#fbbf24' : '#f87171';
                  const marker = isAttacking ? 'url(#arrow-attack)' : 'url(#arrow-defend)';

                  let targetX = slot.x;
                  let targetY = slot.y;
                  let useCurve = false;
                  let controlX = slot.x;
                  let controlY = slot.y;

                  if (isAttacking) {
                    if (['LB', 'LWB', 'RB', 'RWB'].includes(slot.role)) {
                      targetY = slot.y - 12;
                      targetX = slot.x + (slot.x < 50 ? -3 : 3);
                    } else if (['LW', 'RW'].includes(slot.role)) {
                      targetY = slot.y - 10;
                      targetX = slot.x + (slot.x < 50 ? 10 : -10);
                      useCurve = true;
                      controlX = slot.x + (slot.x < 50 ? 2 : -2);
                      controlY = slot.y - 8;
                    } else if (['CAM', 'CM', 'CDM', 'LM', 'RM'].includes(slot.role)) {
                      targetY = slot.y - 8;
                    } else if (['ST', 'CF', 'LS', 'RS'].includes(slot.role)) {
                      targetY = slot.y - 6;
                    } else if (['CB', 'RCB', 'LCB'].includes(slot.role)) {
                      targetY = slot.y - 3;
                    }
                  } else {
                    if (['LB', 'RB', 'LWB', 'RWB'].includes(slot.role)) {
                      targetX = slot.x + (slot.x < 50 ? 3 : -3);
                      targetY = slot.y + 8;
                    } else if (['CB', 'RCB', 'LCB'].includes(slot.role)) {
                      targetY = slot.y + 6;
                    } else if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(slot.role)) {
                      targetY = slot.y + 8;
                    } else if (['LW', 'RW', 'ST', 'CF', 'LS', 'RS'].includes(slot.role)) {
                      targetY = slot.y + 8;
                    }
                  }

                  const startX = slot.x;
                  const startY = (isAttacking ? slot.y - 3.5 : slot.y + 3.5) * 1.33;
                  const finalTargetX = targetX;
                  const adjustY = targetY * 1.33;
                  const cX = controlX;
                  const cY = controlY * 1.33;

                  if (useCurve) {
                    return (
                      <path
                        key={`flow-${slot.slotId}`}
                        d={`M ${startX} ${startY} Q ${cX} ${cY} ${finalTargetX} ${adjustY}`}
                        fill="none"
                        stroke={color}
                        strokeWidth="0.8"
                        strokeDasharray="2 1"
                        markerEnd={marker}
                      />
                    );
                  } else {
                    return (
                      <line
                        key={`flow-${slot.slotId}`}
                        x1={startX}
                        y1={startY}
                        x2={finalTargetX}
                        y2={adjustY}
                        stroke={color}
                        strokeWidth="0.8"
                        strokeDasharray="2 1"
                        markerEnd={marker}
                      />
                    );
                  }
                })}
              </svg>

              {/* Pitch Orientation Labels */}
              <div className="absolute top-2 left-2 text-[8px] text-emerald-600 font-bold opacity-50 pointer-events-none">▲ ATTACK</div>
              <div className="absolute bottom-2 left-2 text-[8px] text-emerald-600 font-bold opacity-50 pointer-events-none">▼ DEFEND</div>

              {/* Pitch Players Nodes */}
              {currentFormation.slots.map(slot => {
                const player = getPlayerForSlot(slot);
                const isSelected = selectedSlotId === slot.slotId;
                const roleColor = ROLE_COLORS[slot.role] || '#facc15';

                // Positional shifts if flow mode is active
                let rx = slot.x;
                let ry = slot.y;
                if (flowMode === 'attacking') {
                  if (['LB', 'LWB', 'RB', 'RWB'].includes(slot.role)) {
                    ry = slot.y - 12;
                    rx = slot.x + (slot.x < 50 ? -3 : 3);
                  } else if (['LW', 'RW'].includes(slot.role)) {
                    ry = slot.y - 10;
                    rx = slot.x + (slot.x < 50 ? 10 : -10);
                  } else if (['CAM', 'CM', 'CDM', 'LM', 'RM'].includes(slot.role)) {
                    ry = slot.y - 8;
                  } else if (['ST', 'CF', 'LS', 'RS'].includes(slot.role)) {
                    ry = slot.y - 6;
                  } else if (['CB', 'RCB', 'LCB'].includes(slot.role)) {
                    ry = slot.y - 3;
                  }
                } else if (flowMode === 'defensive') {
                  if (['LB', 'RB', 'LWB', 'RWB'].includes(slot.role)) {
                    rx = slot.x + (slot.x < 50 ? 5 : -5);
                    ry = slot.y + 2;
                  } else if (['CB', 'RCB', 'LCB'].includes(slot.role)) {
                    ry = slot.y + 3;
                  } else if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(slot.role)) {
                    ry = slot.y + 8;
                  } else if (['LW', 'RW', 'ST', 'CF', 'LS', 'RS'].includes(slot.role)) {
                    ry = slot.y + 6;
                  }
                }

                // Clamping to guarantee tokens never get clipped by pitch borders
                rx = Math.max(16, Math.min(84, rx));
                ry = Math.max(12, Math.min(90, ry));

                return (
                  <div
                    key={slot.slotId}
                    onClick={() => setSelectedSlotId(slot.slotId)}
                    className="absolute z-10 flex flex-col items-center cursor-pointer touch-none"
                    style={{
                      left: `${rx}%`,
                      top: `${ry}%`,
                      transition: 'left 0.5s cubic-bezier(0.16, 1, 0.3, 1), top 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: 'translate(-50%,-50%)',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      className="relative flex flex-col items-center cursor-pointer group"
                      title={`${player?.name || 'Empty'} #${player?.number || ''}`}
                    >
                      {/* Circle Avatar (same w-8 h-8 md:w-9 md:h-9 as Tactical Planner page) */}
                      <div
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 overflow-hidden flex items-center justify-center transition-all duration-150 group-hover:scale-110"
                        style={{
                          borderColor: roleColor,
                          background: '#111827',
                          boxShadow: isSelected ? `0 0 0 3px ${roleColor}66, 0 0 14px ${roleColor}44` : `0 2px 6px rgba(0,0,0,0.5)`,
                          transform: isSelected ? 'scale(1.15)' : undefined,
                        }}
                      >
                        {player?.photo ? (
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="w-full h-full object-cover"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-[10px] md:text-[11px] font-black" style={{ color: roleColor }}>
                            {player?.number || '?'}
                          </span>
                        )}
                      </div>

                      {/* Role Chip */}
                      <div
                        className="text-[6px] md:text-[7px] font-black px-1 rounded-sm mt-0.5"
                        style={{ background: roleColor, color: '#000' }}
                      >
                        {slot.role}
                      </div>

                      {/* Player Surname */}
                      <div className="text-[8px] md:text-[9px] font-bold text-white bg-black/80 rounded px-1 leading-tight mt-0.5 max-w-15.5 truncate text-center">
                        {player 
                          ? (player.name.includes('Faris')
                              ? 'Faris'
                              : player.name.includes('Ruventhiran') 
                              ? 'Ruven' 
                              : player.name.includes('Faisal')
                              ? 'Faisal'
                              : player.name.includes('Rodney')
                              ? 'Rodney'
                              : player.name.includes('Bashah')
                              ? 'Bashah'
                              : player.name.includes('Nazmi') 
                              ? 'Nazmi' 
                              : player.name.includes('Josu')
                              ? 'Josué'
                              : player.name.includes('Corbin')
                              ? 'Corbin'
                              : player.name.includes('Kuzain')
                              ? 'Kuzain'
                              : player.name.includes('Wilkin')
                              ? 'Wilkin'
                              : player.name.includes('Tierney')
                              ? 'Tierney'
                              : player.name.includes('Hidalgo')
                              ? 'Hidalgo'
                              : player.name.includes('Aiman')
                              ? 'Arif'
                              : player.name.includes('Ghani')
                              ? 'Ghani'
                              : player.name.includes('Hazmi')
                              ? 'Hazmi'
                              : player.name.split(' ').slice(-1)[0]) 
                          : '—'}
                      </div>

                      {/* Rating Number (no star icon) */}
                      {player && player.averageRating > 0 && (
                        <div className="text-[7px] md:text-[8px] font-black" style={{ color: roleColor }}>
                          {player.averageRating}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pitch Legend */}
            <div className="flex items-center gap-4 text-[10px] text-zinc-400 flex-wrap px-1">
              {[
                ['GK', ROLE_COLORS.GK],
                ['DEF', ROLE_COLORS.CB],
                ['MID', ROLE_COLORS.CM],
                ['FWD', ROLE_COLORS.RW],
              ].map(([label, color]) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: color }} />
                  {label}
                </span>
              ))}
              <span className="ml-auto text-zinc-600 italic text-[9px]">
                Click player then bench to swap
              </span>
            </div>
          </div>

          {/* SIDEBAR: SELECTED PLAYER & SUBSTITUTION BENCH */}
          <div className="space-y-3">
            {/* Active Selected Player Profile Card */}
            {selectedSlot && selectedPlayer ? (
              <div className="glass-card rounded-2xl p-4 border border-primary/40 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider text-primary">
                    Selected Player
                  </span>
                  <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded font-black">
                    {selectedSlot.role}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full border-2 border-primary overflow-hidden bg-zinc-900 flex items-center justify-center text-primary font-black text-sm shrink-0">
                    {selectedPlayer.photo ? (
                      <img src={selectedPlayer.photo} alt={selectedPlayer.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>#{selectedPlayer.number}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-white leading-tight truncate">{selectedPlayer.name}</div>
                    <div className="text-xs text-zinc-400">#{selectedPlayer.number} · {selectedPlayer.position}</div>
                    <div className="text-xs font-black text-amber-400 mt-0.5">{selectedPlayer.averageRating} avg</div>
                  </div>
                </div>

                {/* Player Highlight / Role Duty */}
                <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                    Tactical Duty vs China:
                  </span>
                  <p className="text-[11px] leading-relaxed text-zinc-300">
                    {selectedPlayer.callUpRole 
                      ? selectedPlayer.callUpRole 
                      : selectedPlayer.tournamentHighlight || 'High-energy execution in tactical phase.'}
                  </p>
                </div>

                <Link
                  href={`/players/${selectedPlayer.id}`}
                  className="block text-center text-[10px] text-primary hover:underline bg-zinc-900/60 rounded-lg py-1.5 border border-zinc-800"
                >
                  View full profile →
                </Link>
                {benchPlayers.length > 0 && (
                  <p className="text-[9px] text-amber-400 text-center animate-pulse">
                    ↓ Tap bench player to swap
                  </p>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-4 border border-zinc-800 text-center">
                <Users className="h-6 w-6 text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-600 text-[11px]">Click a player on the pitch to select</p>
              </div>
            )}

            {/* BENCH & SQUAD RESERVES (12 Players) */}
            <div className="glass-card rounded-2xl p-4 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                    Bench ({benchPlayers.length})
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  {benchPlayers.length} Reserves
                </span>
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto pr-0.5 custom-scrollbar">
                {benchPlayers.map(bp => (
                  <button
                    key={bp.id}
                    onClick={() => handleBenchClick(bp)}
                    disabled={!selectedSlotId}
                    className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all border ${
                      selectedSlotId
                        ? 'bg-zinc-800/80 hover:bg-zinc-700/80 border-zinc-600 hover:border-primary cursor-pointer'
                        : 'bg-zinc-900/40 border-zinc-800/60 cursor-default opacity-60'
                    }`}
                    title={selectedSlotId ? `Swap with ${bp.name}` : 'Select a pitch player first'}
                  >
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-zinc-400 font-black text-[9px] shrink-0">
                      {bp.photo ? (
                        <img src={bp.photo} alt={bp.name} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      ) : bp.number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-zinc-200 truncate">{bp.name}</div>
                      <div className="text-[10px] text-zinc-500 font-semibold truncate">#{bp.number} · {bp.position}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-black text-amber-400 block">{bp.averageRating}</span>
                      <span className="text-[9px] text-zinc-500 font-medium">Swap in ↵</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Directives vs China PR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[11px]">
              <Target className="h-4 w-4" />
              <span>Attacking Key vs China</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              China's center-backs struggle when turned toward their own goal by agile wingers. Arif Aiman & Manuel Hidalgo will isolate fullbacks to create low cutback opportunities for Bergson.
            </p>
          </div>

          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-[11px]">
              <Shield className="h-4 w-4" />
              <span>Defensive Aerial Dominance</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              China relies heavily on set-piece height and diagonal crosses into the penalty box. Dion Cools and Brad Tapp must control first-contact headers with Syihan Hazmi commanding the 6-yard box.
            </p>
          </div>

          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-black uppercase text-[11px]">
              <Flame className="h-4 w-4" />
              <span>Transition Velocity (3-Second Rule)</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Harimau Malaya's fastest route to goal is vertical ball progression through Nooa Laine & Wan Kuzain immediately after turnovers, releasing runners behind China's high line.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          26-MAN OFFICIAL CALL-UP SQUAD SECTION
      ========================================================= */}
      <div className="space-y-6 pt-4 border-t border-zinc-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-xl sm:text-2xl font-black text-zinc-100">
                Official {players.length}-Player Call-Up Squad
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Combined selection of Malaysia's elite performers from the 2026 FIFA ASEAN Cup & ASEAN Hyundai Cup tournaments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/players" 
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-800 text-primary hover:bg-zinc-800 transition-all flex items-center gap-1.5"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>View On Players Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Squad Composition Breakdown Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-zinc-900/70 p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Goalkeepers</span>
            <span className="text-lg font-black text-primary">{goalkeepers.length} Players</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Syihan, Azri, Haziq</span>
          </div>
          <div className="bg-zinc-900/70 p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Defenders</span>
            <span className="text-lg font-black text-primary">{defenders.length} Players</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Cools, Tapp, Ting, Rodney, Haikal +4</span>
          </div>
          <div className="bg-zinc-900/70 p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Midfielders</span>
            <span className="text-lg font-black text-primary">{midfielders.length} Players</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Wilkin, Kuzain, Laine, Bashah, Aguero +3</span>
          </div>
          <div className="bg-zinc-900/70 p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Forwards</span>
            <span className="text-lg font-black text-primary">{forwards.length} Players</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Bergson, Arif, Faisal, Josué, Tierney, Pavithran</span>
          </div>
        </div>

        {/* Combined Tournament Provenance Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Dual Tournament */}
          <div className="bg-zinc-900/80 p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between shadow-lg space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
                  Both Tournaments
                </span>
                <span className="text-xs font-black text-amber-400 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
                  {dualPlayers.length} Players
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-zinc-100">
                  Dual-Tournament Stars
                </h4>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  Capped in both FIFA & AFF campaigns with proven versatility.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-200 font-bold truncate">Paulo Josué</span>
                  <span className="text-amber-400 font-bold text-[10px] shrink-0">4 Goals · Playmaker</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-200 font-bold truncate">Ubaidullah Shamsul</span>
                  <span className="text-emerald-400 font-bold text-[10px] shrink-0">653 Mins · 92% Pass</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-200 font-bold truncate">G. Pavithran</span>
                  <span className="text-amber-300 font-bold text-[10px] shrink-0">581 Mins · 1G 2A</span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
              <span>Combined: 1,869 Mins</span>
              <span className="text-amber-400 font-bold">100% Retained</span>
            </div>
          </div>

          {/* Card 2: FIFA ASEAN Cup 2026 Core */}
          <div className="bg-zinc-900/80 p-5 rounded-2xl border border-amber-500/20 flex flex-col justify-between shadow-lg space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider">
                  <Trophy className="h-3 w-3 text-amber-400" />
                  FIFA ASEAN Cup
                </span>
                <span className="text-xs font-black text-amber-400 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
                  {fifaPlayers.length} Players
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-zinc-100">
                  Bronze Medalist Core
                </h4>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  Historic podium finish with 0 goals conceded in group stage.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-200 font-bold truncate">Dion Cools</span>
                  <span className="text-amber-400 font-bold text-[10px] shrink-0">Rating 8.20 · Captain</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-200 font-bold truncate">Bergson da Silva</span>
                  <span className="text-amber-400 font-bold text-[10px] shrink-0">4 Goals · 3.42 xG</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-200 font-bold truncate">Arif Aiman Hanapi</span>
                  <span className="text-amber-400 font-bold text-[10px] shrink-0">2G 2A · 14 Dribbles</span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
              <span>Avg Rating: <strong className="text-amber-400 font-bold">7.48</strong></span>
              <span className="text-zinc-400 font-semibold">+12 Squad Members</span>
            </div>
          </div>

          {/* Card 3: ASEAN Hyundai Cup Core */}
          <div className="bg-zinc-900/80 p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between shadow-lg space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  ASEAN Hyundai Cup
                </span>
                <span className="text-xs font-black text-emerald-400 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
                  {affPlayers.length} Players
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-zinc-100">
                  High-Impact Standouts
                </h4>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  Top-rated tournament performers providing elite passing & drive.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-200 font-bold truncate">Wan Kuzain</span>
                  <span className="text-emerald-400 font-bold text-[10px] shrink-0">Rating 7.62 · 91% Pass</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-200 font-bold truncate">Sergio Aguero</span>
                  <span className="text-emerald-400 font-bold text-[10px] shrink-0">Rating 7.56 · 425 Mins</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800/80">
                  <span className="text-zinc-200 font-bold truncate">Faris Danish</span>
                  <span className="text-emerald-400 font-bold text-[10px] shrink-0">Rating 7.12 · 315 Mins</span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
              <span>Avg Rating: <strong className="text-emerald-400 font-bold">7.48</strong></span>
              <span className="text-zinc-400 font-semibold">+ Endrick, Azri & Rodney</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
          {/* Tournament Provenance Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Tournament Source:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTournamentFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tournamentFilter === 'All'
                    ? 'bg-amber-400 text-zinc-950 font-black shadow-md'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                All Combined ({players.length})
              </button>
              <button
                onClick={() => setTournamentFilter('Both')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  tournamentFilter === 'Both'
                    ? 'bg-amber-400 text-zinc-950 font-black shadow-md'
                    : 'bg-zinc-950 text-amber-300 hover:text-amber-200 border border-amber-500/40'
                }`}
              >
                <span>Both Tournaments ({dualPlayers.length})</span>
              </button>
              <button
                onClick={() => setTournamentFilter('FIFA')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  tournamentFilter === 'FIFA'
                    ? 'bg-amber-400 text-zinc-950 font-black shadow-md'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <Trophy className="h-3 w-3 text-amber-400" />
                <span>FIFA ASEAN Cup ({fifaPlayers.length})</span>
              </button>
              <button
                onClick={() => setTournamentFilter('AFF')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  tournamentFilter === 'AFF'
                    ? 'bg-emerald-400 text-zinc-950 font-black shadow-md'
                    : 'bg-zinc-950 text-emerald-400/90 hover:text-emerald-300 border border-emerald-500/40'
                }`}
              >
                <Shield className="h-3 w-3 text-emerald-400" />
                <span>ASEAN Hyundai Cup ({affPlayers.length})</span>
              </button>
              <button
                onClick={() => setTournamentFilter('Potential')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  tournamentFilter === 'Potential'
                    ? 'bg-amber-400 text-zinc-950 font-black shadow-md'
                    : 'bg-zinc-950 text-amber-300 hover:text-amber-200 border border-amber-500/40'
                }`}
              >
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Potential Call-Up ({potentialPlayers.length})</span>
              </button>
            </div>
          </div>

          {/* Position Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-2.5 border-t border-zinc-800/80">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Position Filter:</span>
            <div className="flex flex-wrap gap-1.5">
              {(['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const).map((pos) => {
                const count = pos === 'All' 
                  ? players.length 
                  : players.filter(p => p.position === pos).length;
                return (
                  <button
                    key={pos}
                    onClick={() => setActiveTab(pos)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === pos
                        ? 'bg-zinc-200 text-zinc-950 font-black shadow-sm'
                        : 'bg-zinc-950/70 text-zinc-400 hover:text-zinc-200 border border-zinc-850'
                    }`}
                  >
                    {pos === 'All' ? 'All Positions' : pos + 's'} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 26-Man Player Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSquad.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className={`glass-card rounded-2xl p-4 border transition-all flex flex-col justify-between group overflow-hidden ${
                player.tournamentProvenance?.includes('Both')
                  ? 'border-amber-500/40 bg-linear-to-b from-amber-500/5 via-zinc-950 to-zinc-950 hover:border-amber-400'
                  : player.tournamentProvenance?.includes('Hyundai') || player.tournamentProvenance?.includes('AFF')
                  ? 'border-emerald-500/30 bg-linear-to-b from-emerald-500/5 via-zinc-950 to-zinc-950 hover:border-emerald-400'
                  : 'border-zinc-800 hover:border-primary/40'
              }`}
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center shadow">
                    {player.photo ? (
                      <img 
                        src={player.photo} 
                        alt={player.name} 
                        className="w-full h-full object-cover rounded-full" 
                        onError={(e) => { 
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }} 
                      />
                    ) : null}
                    <span className={`fallback-badge font-black text-primary text-xs ${player.photo ? 'hidden' : ''}`}>
                      #{player.number}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-zinc-800 text-zinc-300 text-[9px] px-1.5 py-0.2 rounded font-black">
                        #{player.number}
                      </span>
                      <h3 className="font-extrabold text-sm text-zinc-100 group-hover:text-primary transition-colors truncate">
                        {player.name}
                      </h3>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-semibold uppercase mt-0.5">
                      {player.position} · {player.club}
                    </p>
                    
                    {/* Tournament Provenance Badge */}
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      {player.tournamentProvenance?.includes('Potential') ? (
                        <span className="text-[8.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300">
                          ⭐ Potential Call-Up (Domestic Form)
                        </span>
                      ) : player.tournamentProvenance?.includes('Both') ? (
                        <span className="text-[8.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 bg-linear-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/50 text-amber-300">
                          Both Tournaments (FIFA & AFF)
                        </span>
                      ) : player.tournamentProvenance?.includes('Hyundai') || player.tournamentProvenance?.includes('AFF') ? (
                        <span className="text-[8.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          ASEAN Hyundai Cup 2026
                        </span>
                      ) : (
                        <span className="text-[8.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 bg-amber-400/15 border border-amber-400/30 text-amber-400">
                          FIFA ASEAN Cup 2026
                        </span>
                      )}
                    </div>

                    {player.callUpRole && (
                      <span className="inline-block mt-1 text-[9.5px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded wrap-break-word line-clamp-2">
                        {player.callUpRole}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tournament Stats Capsule */}
                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-zinc-900 text-center text-xs">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold block">
                      {player.tournamentProvenance?.includes('Potential') ? 'Tourn Caps' : 'Apps'}
                    </span>
                    <span className="font-black text-zinc-200">
                      {player.tournamentProvenance?.includes('Potential') ? '0 (Uncapped)' : player.appearances}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold block">
                      {player.tournamentProvenance?.includes('Potential') ? 'Club Goals' : 'Goals'}
                    </span>
                    <span className="font-black text-primary">
                      {player.tournamentProvenance?.includes('Potential') ? '4 (JDT)' : player.goals}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold block">
                      {player.tournamentProvenance?.includes('Potential') ? 'Club Ast' : 'Assists'}
                    </span>
                    <span className="font-black text-accent">
                      {player.tournamentProvenance?.includes('Potential') ? '1 (JDT)' : player.assists}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold block">Pass Acc</span>
                    <span className="font-black text-zinc-300">{player.passingAccuracy}%</span>
                  </div>
                </div>

                {/* Tournament Performance Basis Box */}
                {player.tournamentHighlight && (
                  <div className="mt-3 text-[10px] text-zinc-300 bg-zinc-900/80 p-2 rounded-lg border border-zinc-850 leading-relaxed">
                    <span className="text-[9px] text-amber-400 font-black block uppercase tracking-wider mb-0.5">
                      Selection Basis:
                    </span>
                    {player.tournamentHighlight}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[10px]">
                <span className="text-zinc-500 font-semibold">
                  {player.tournamentProvenance?.includes('Potential') ? 'Uncapped at FIFA/AFF level' : `${player.minutes} mins played`}
                </span>
                <span className="text-primary font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  View Profile <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
