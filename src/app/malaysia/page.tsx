'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getPlayers, getTeam, getFixtures, Player, Team, Fixture } from '@/lib/api';
import { Activity, Calendar, RotateCcw, Users, ChevronDown } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

interface PitchPlayer {
  id: string;
  name: string;
  number: number;
  photo?: string;
  averageRating: number;
  x: number;
  y: number;
  role: string;
}

const FORMATIONS: Record<string, { label: string; positions: { x: number; y: number; role: string }[] }> = {
  '4-3-3': {
    label: '4-3-3',
    positions: [
      { x: 50, y: 90, role: 'GK' },
      { x: 15, y: 70, role: 'LB' }, { x: 37, y: 72, role: 'CB' }, { x: 63, y: 72, role: 'CB' }, { x: 85, y: 70, role: 'RB' },
      { x: 22, y: 48, role: 'CM' }, { x: 50, y: 44, role: 'CM' }, { x: 78, y: 48, role: 'CM' },
      { x: 18, y: 22, role: 'LW' }, { x: 50, y: 16, role: 'ST' }, { x: 82, y: 22, role: 'RW' },
    ],
  },
  '4-4-2': {
    label: '4-4-2',
    positions: [
      { x: 50, y: 90, role: 'GK' },
      { x: 12, y: 70, role: 'LB' }, { x: 35, y: 72, role: 'CB' }, { x: 65, y: 72, role: 'CB' }, { x: 88, y: 70, role: 'RB' },
      { x: 12, y: 48, role: 'LM' }, { x: 35, y: 50, role: 'CM' }, { x: 65, y: 50, role: 'CM' }, { x: 88, y: 48, role: 'RM' },
      { x: 35, y: 18, role: 'ST' }, { x: 65, y: 18, role: 'ST' },
    ],
  },
  '4-2-3-1': {
    label: '4-2-3-1',
    positions: [
      { x: 50, y: 90, role: 'GK' },
      { x: 12, y: 70, role: 'LB' }, { x: 35, y: 72, role: 'CB' }, { x: 65, y: 72, role: 'CB' }, { x: 88, y: 70, role: 'RB' },
      { x: 33, y: 55, role: 'CDM' }, { x: 67, y: 55, role: 'CDM' },
      { x: 15, y: 32, role: 'LW' }, { x: 50, y: 30, role: 'CAM' }, { x: 85, y: 32, role: 'RW' },
      { x: 50, y: 12, role: 'ST' },
    ],
  },
  '3-5-2': {
    label: '3-5-2',
    positions: [
      { x: 50, y: 90, role: 'GK' },
      { x: 25, y: 72, role: 'CB' }, { x: 50, y: 74, role: 'CB' }, { x: 75, y: 72, role: 'CB' },
      { x: 12, y: 48, role: 'LWB' }, { x: 30, y: 50, role: 'CM' }, { x: 50, y: 46, role: 'CM' }, { x: 70, y: 50, role: 'CM' }, { x: 88, y: 48, role: 'RWB' },
      { x: 35, y: 18, role: 'ST' }, { x: 65, y: 18, role: 'ST' },
    ],
  },
  '3-1-5-1': {
    label: '3-1-5-1',
    positions: [
      { x: 50, y: 90, role: 'GK' },
      { x: 22, y: 72, role: 'CB' }, { x: 50, y: 74, role: 'CB' }, { x: 78, y: 72, role: 'CB' },
      { x: 50, y: 58, role: 'CDM' },
      { x: 12, y: 40, role: 'LWB' }, { x: 28, y: 36, role: 'CM' }, { x: 50, y: 33, role: 'CAM' }, { x: 72, y: 36, role: 'CM' }, { x: 88, y: 40, role: 'RWB' },
      { x: 50, y: 12, role: 'ST' },
    ],
  },
};

const FORMATION_REASONS: Record<string, { attack: string; defense: string }> = {
  '4-3-3': {
    attack: "FLANK: Wingers stretch fullbacks, while CMs run into half-spaces to support overlaps. CENTRAL: The CDM acts as a deep pivot to recycle play, while the striker drops deep as a false nine to pull CBs out, enabling late central runs into the box by attacking midfielders.",
    defense: "FLANK: Fullbacks press high, supported by the nearest CM dropping into wide channels. CENTRAL: A high-intensity front-three press forces opposing build-ups inside into a congested three-man midfield block to trigger central turnovers."
  },
  '4-4-2': {
    attack: "FLANK: Wide wingers drive deep to deliver crosses into the box. CENTRAL: The two strikers play close together to execute quick wall-passes, make complementary runs, and contest second balls won by the central midfielders.",
    defense: "FLANK: Winger and fullback form double-team blocks on the flanks. CENTRAL: Two rigid banks of four slide laterally to restrict central spacing, choking central channels and forcing opposition into low-risk long balls."
  },
  '4-2-3-1': {
    attack: "FLANK: Inside-cutting wingers combine with overlapping fullbacks. CENTRAL: The playmaker CAM acts as the creative hub in zone 14 to slide diagonal passes through central lines, supported by deep double-pivots recycling possession.",
    defense: "FLANK: Left CDM shifts wide to cover overlapping fullbacks. CENTRAL: Double pivots clog the space in front of the center-backs, while the CAM drops to form a compact central mid-block out of possession."
  },
  '3-5-2': {
    attack: "FLANK: High wingbacks provide width and stretch the opponent backline. CENTRAL: Three central midfielders dominate possession, while the two strikers make opposite vertical runs (one short, one long) to split center-backs.",
    defense: "FLANK: Recovering wingbacks drop deep to form a five-man defensive line. CENTRAL: The three center-backs sit narrow and compact in the box to clear crosses, screened by a dense three-man central midfield block."
  },
  '3-1-5-1': {
    attack: "FLANK: Wingbacks push up to provide secondary width. CENTRAL: Five midfielders construct a high-possession passing web to overload central zones, creating short combination networks to release the lone striker in the box.",
    defense: "FLANK: Wingbacks track back to cover wide defensive corridors. CENTRAL: Ibrahim Manusi acts as a dedicated central defensive screen to break up counters, supported by three deep center-backs clogging the penalty box."
  }
};

const ROLE_COLOR: Record<string, string> = {
  GK: '#94a3b8',
  LB: '#34d399', RB: '#34d399', CB: '#34d399', LWB: '#34d399', RWB: '#34d399',
  CM: '#60a5fa', CDM: '#60a5fa', CAM: '#60a5fa', LM: '#60a5fa', RM: '#60a5fa',
  LW: '#facc15', RW: '#facc15', ST: '#facc15',
};

const OPP_FLAGS: Record<string, string> = { myanmar: '🇲🇲', laos: '🇱🇦', thailand: '🇹🇭', philippines: '🇵🇭', cambodia: '🇰🇭', singapore: '🇸🇬', indonesia: '🇮🇩', vietnam: '🇻🇳' };
const OPP_NAMES: Record<string, string> = { myanmar: 'Myanmar', laos: 'Laos', thailand: 'Thailand', philippines: 'Philippines', cambodia: 'Cambodia', singapore: 'Singapore', indonesia: 'Indonesia', vietnam: 'Vietnam' };

export default function MalaysiaPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [formation, setFormation] = useState('4-2-3-1');
  const [flowMode, setFlowMode] = useState<'none' | 'attacking' | 'defensive'>('none');
  const [pitchPlayers, setPitchPlayers] = useState<PitchPlayer[]>([]);
  const [benchPlayers, setBenchPlayers] = useState<Player[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const t = await getTeam('malaysia');
      const p = await getPlayers();
      const f = await getFixtures();
      setTeam(t);
      const myPlayers = p.filter(pl => pl.teamId === 'malaysia');
      setPlayers(myPlayers);
      setFixtures(f.filter(fi => fi.homeTeamId === 'malaysia' || fi.awayTeamId === 'malaysia'));
    }
    loadData();
  }, []);

  const applyFormation = useCallback((fm: string, allPlayers: Player[]) => {
    const positions = FORMATIONS[fm]?.positions ?? [];

    const PLAYER_PREFERRED_ROLES: Record<string, string[]> = {
      'paulo-josue':      ['ST', 'CAM'],
      'sergio-aguero':    ['CDM', 'CAM', 'CM'],
      'wan-kuzain':       ['CAM', 'CDM', 'CM'],
      'aysar-hadi':       ['CB'],
      'sumareh':          ['RM', 'RW', 'LM', 'LW'],
      'g-pavithran':      ['LW'],
      'ruventhiran':      ['LB', 'LWB', 'LM', 'LW'],
      'rodney-celvin':    ['CB'],
      'ubaidullah-shamsul': ['CB'],
      'faris-danish':     ['LB', 'LWB'],
      'alif-ahmad':       ['RB', 'RWB'],
      'azri-ghani':       ['GK'],
      'hadi-fayyadh':     ['ST'],
      'haqimi-azim':      ['ST', 'LW', 'RW'],
      'daryl-sham':       ['CM'],
      'aliff-haiqal':     ['CDM', 'CM'],
      'engku-nur-shakir': ['RW', 'RM', 'LW'],
      'jimmy-raymond':    ['RB', 'RWB', 'CB'],
      'endrick':          ['CDM', 'CM'],
      'syafiq-ahmad':     ['ST', 'LW', 'RW'],
      'ibrahim-manusi':   ['CDM', 'CM'],
      'ziad-el-basheer':  ['CDM', 'CM'],
    };

    const roleToCategory = (role: string): string => {
      if (role === 'GK') return 'Goalkeeper';
      if (['LB', 'RB', 'CB', 'LWB', 'RWB'].includes(role)) return 'Defender';
      // LM and RM are wide roles filled by wingers — treat same as LW/RW (Forward)
      if (['CM', 'CDM', 'CAM', 'DM'].includes(role)) return 'Midfielder';
      if (['LW', 'RW', 'LM', 'RM', 'ST', 'CF', 'SS'].includes(role)) return 'Forward';
      return 'Midfielder';
    };

    const roleOrder = ['GK', 'ST', 'LB', 'RB', 'LW', 'RW', 'CAM', 'CB', 'CDM', 'CM', 'RM', 'LM', 'RWB', 'LWB'];

    // Sort positions by specificity order so we assign GK, ST, fullbacks first
    const sortedPositions = [...positions]
      .map((pos, index) => ({ pos, originalIndex: index }))
      .sort((a, b) => {
        const idxA = roleOrder.indexOf(a.pos.role);
        const idxB = roleOrder.indexOf(b.pos.role);
        return idxA - idxB;
      });

    const usedIds = new Set<string>();
    // Include ALL healthy squad players — zero-rated get base score 6.0 so natural position fits still work
    const healthyPlayers = allPlayers.filter(p => p.injuryStatus !== 'Injured' && p.injuryStatus !== 'Returned to Club');
    const assignedSlots: { pp: PitchPlayer; originalIndex: number }[] = [];

    // For 3-1-5-1: pre-assign Ibrahim Manusi to CDM BEFORE the main loop
    // This keeps Aguero free for CM slots (post-processing displacement caused Aguero to bench)
    if (fm === '3-1-5-1') {
      const ibrahimPlayer = healthyPlayers.find(p => p.id === 'ibrahim-manusi');
      const cdmEntry = sortedPositions.find(sp => sp.pos.role === 'CDM');
      if (ibrahimPlayer && cdmEntry) {
        usedIds.add(ibrahimPlayer.id);
        assignedSlots.push({
          pp: {
            id: ibrahimPlayer.id,
            name: ibrahimPlayer.name,
            number: ibrahimPlayer.number,
            photo: ibrahimPlayer.photo,
            averageRating: ibrahimPlayer.averageRating,
            x: cdmEntry.pos.x,
            y: cdmEntry.pos.y,
            role: 'CDM',
          },
          originalIndex: cdmEntry.originalIndex,
        });
        // Remove CDM from sortedPositions so the main loop skips it
        const cdmIdx = sortedPositions.indexOf(cdmEntry);
        if (cdmIdx !== -1) sortedPositions.splice(cdmIdx, 1);
      }
    }

    for (const { pos, originalIndex } of sortedPositions) {
      const slotCategory = roleToCategory(pos.role);

      const candidates = [...healthyPlayers]
        .filter(p => !usedIds.has(p.id) && !(p.id === 'g-pavithran' && pos.role !== 'LW') && !(p.id === 'hadi-fayyadh' && pos.role !== 'ST'))
        .map(p => {
          // Zero-rated players (no appearances) get base score 6.0
          let score = p.averageRating > 0 ? p.averageRating : 6.0;
          const preferred = PLAYER_PREFERRED_ROLES[p.id] ?? [];
          const playerCategory = p.position;

          // Always apply category mismatch penalty first
          if (playerCategory !== slotCategory) {
            score -= 8.0;
          }

          if (preferred.length > 0) {
            if (preferred[0] === pos.role) {
              score += 5.0; // Strong primary role bonus
            } else if (preferred.includes(pos.role)) {
              score += 2.5; // Secondary role bonus
            } else {
              // Same category but role not preferred (e.g. LB at CB)
              score -= 4.0;
            }
          } else {
            // No preferred roles: small category-match bonus only
            if (playerCategory === slotCategory) {
              score += 1.0;
            }
          }

          return { player: p, score };
        })
        .sort((a, b) => b.score - a.score);

      const picked = candidates[0]?.player;
      if (picked) {
        usedIds.add(picked.id);
        assignedSlots.push({
          pp: {
            id: picked.id,
            name: picked.name,
            number: picked.number,
            photo: picked.photo,
            averageRating: picked.averageRating,
            x: pos.x,
            y: pos.y,
            role: pos.role
          },
          originalIndex
        });
      } else {
        assignedSlots.push({
          pp: { id: `empty-${pos.role}`, name: '—', number: 0, averageRating: 0, x: pos.x, y: pos.y, role: pos.role },
          originalIndex
        });
      }
    }

    // Sort back to original order
    const xi = assignedSlots.sort((a, b) => a.originalIndex - b.originalIndex).map(s => s.pp);

    // Swap CDM sides if Aguero and Daryl Sham are both playing CDM to put Daryl Sham on the left (LCDM) and Aguero on the right (RCDM)
    const leftCdmIdx = xi.findIndex(p => p.role === 'CDM' && p.x < 50);
    const rightCdmIdx = xi.findIndex(p => p.role === 'CDM' && p.x > 50);
    if (leftCdmIdx !== -1 && rightCdmIdx !== -1) {
      const leftPlayer = xi[leftCdmIdx];
      const rightPlayer = xi[rightCdmIdx];
      if (leftPlayer && rightPlayer && leftPlayer.id === 'sergio-aguero' && rightPlayer.id === 'daryl-sham') {
        const tempX = leftPlayer.x;
        const tempY = leftPlayer.y;
        leftPlayer.x = rightPlayer.x;
        leftPlayer.y = rightPlayer.y;
        rightPlayer.x = tempX;
        rightPlayer.y = tempY;
        xi[leftCdmIdx] = rightPlayer;
        xi[rightCdmIdx] = leftPlayer;
      }
    }

    const bench = allPlayers.filter(p => !usedIds.has(p.id));
    setPitchPlayers(xi);
    setBenchPlayers(bench);
  }, []);


  useEffect(() => { if (players.length) applyFormation(formation, players); }, [players]);

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setDragging(id);
    setSelectedId(id);
    if (!pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const pp = pitchPlayers.find(p => p.id === id);
    if (!pp) return;
    setDragOffset({ x: e.clientX - rect.left - (pp.x / 100) * rect.width, y: e.clientY - rect.top - (pp.y / 100) * rect.height });
  }, [pitchPlayers]);

  const handleTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    setDragging(id);
    setSelectedId(id);
    if (!pitchRef.current || e.touches.length === 0) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const pp = pitchPlayers.find(p => p.id === id);
    if (!pp) return;
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left - (pp.x / 100) * rect.width,
      y: touch.clientY - rect.top - (pp.y / 100) * rect.height
    });
  }, [pitchPlayers]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = Math.max(7, Math.min(93, ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100));
    const y = Math.max(5, Math.min(92, ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100));

    // Find player category to decide valid roles
    const dbPlayer = players.find(p => p.id === dragging);
    const category = dbPlayer?.position ?? 'Midfielder';
    const current = pitchPlayers.find(p => p.id === dragging);
    const prevRole = current?.role ?? 'CM';

    let role = prevRole;
    if (category === 'Goalkeeper') {
      role = 'GK';
    } else if (category === 'Defender') {
      if (x < 28) role = prevRole.includes('WB') ? 'LWB' : 'LB';
      else if (x > 72) role = prevRole.includes('WB') ? 'RWB' : 'RB';
      else role = 'CB';
    } else if (category === 'Midfielder') {
      if (x < 25) role = 'LM';
      else if (x > 75) role = 'RM';
      else if (y < 42) role = 'CAM';
      else if (y > 60) role = 'CDM';
      else role = 'CM';
    } else if (category === 'Forward') {
      if (dragging === 'g-pavithran') {
        role = 'LW';
      } else if (dragging === 'hadi-fayyadh') {
        role = 'ST';
      } else {
        if (x < 33) role = 'LW';
        else if (x > 67) role = 'RW';
        else role = 'ST';
      }
    }

    setPitchPlayers(prev => prev.map(p => p.id === dragging ? { ...p, x, y, role } : p));
  }, [dragging, dragOffset, players, pitchPlayers]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging || !pitchRef.current || e.touches.length === 0) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    const rect = pitchRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(7, Math.min(93, ((touch.clientX - rect.left - dragOffset.x) / rect.width) * 100));
    const y = Math.max(5, Math.min(92, ((touch.clientY - rect.top - dragOffset.y) / rect.height) * 100));

    // Find player category to decide valid roles
    const dbPlayer = players.find(p => p.id === dragging);
    const category = dbPlayer?.position ?? 'Midfielder';
    const current = pitchPlayers.find(p => p.id === dragging);
    const prevRole = current?.role ?? 'CM';

    let role = prevRole;
    if (category === 'Goalkeeper') {
      role = 'GK';
    } else if (category === 'Defender') {
      if (x < 28) role = prevRole.includes('WB') ? 'LWB' : 'LB';
      else if (x > 72) role = prevRole.includes('WB') ? 'RWB' : 'RB';
      else role = 'CB';
    } else if (category === 'Midfielder') {
      if (x < 25) role = 'LM';
      else if (x > 75) role = 'RM';
      else if (y < 42) role = 'CAM';
      else if (y > 60) role = 'CDM';
      else role = 'CM';
    } else if (category === 'Forward') {
      if (dragging === 'g-pavithran') {
        role = 'LW';
      } else if (dragging === 'hadi-fayyadh') {
        role = 'ST';
      } else {
        if (x < 33) role = 'LW';
        else if (x > 67) role = 'RW';
        else role = 'ST';
      }
    }

    setPitchPlayers(prev => prev.map(p => p.id === dragging ? { ...p, x, y, role } : p));
  }, [dragging, dragOffset, players, pitchPlayers]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  function swapWithBench(bench: Player) {
    if (!selectedId) return;
    const slot = pitchPlayers.find(p => p.id === selectedId);
    if (!slot) return;
    const oldPlayer = players.find(p => p.id === selectedId);
    const newBench = [...benchPlayers.filter(b => b.id !== bench.id)];
    if (oldPlayer) newBench.push(oldPlayer);
    setPitchPlayers(prev => prev.map(p => p.id === selectedId
      ? { ...p, id: bench.id, name: bench.name, number: bench.number, photo: bench.photo, averageRating: bench.averageRating }
      : p));
    setBenchPlayers(newBench);
    setSelectedId(null);
  }

  if (!team) return <div className="text-zinc-500 py-12 text-center">Loading Harimau Malaya data...</div>;

  const goals = players.reduce((s, p) => s + p.goals, 0);
  const assists = players.reduce((s, p) => s + p.assists, 0);
  const totalXG = players.reduce((s, p) => s + p.expectedGoals, 0).toFixed(2);
  const avgPassing = players.length ? (players.reduce((s, p) => s + p.passingAccuracy, 0) / players.length).toFixed(1) : '0';
  const selectedPitch = pitchPlayers.find(p => p.id === selectedId);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* TACTICAL PLANNER ONLY */}
      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> TACTICAL PLANNER</h2>
                <span className="bg-primary/10 border border-primary/25 text-primary text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shrink-0">
                  Next: Semifinal vs Vietnam 🇻🇳 (Aug 16)
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">Drag players to reposition · Click player then bench to swap · Change formation to rearrange</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={formation}
                onChange={e => { const f = e.target.value; setFormation(f); applyFormation(f, players); setSelectedId(null); }}
                className="appearance-none bg-zinc-900 border border-zinc-700 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-zinc-200 focus:outline-none focus:border-primary cursor-pointer"
              >
                {Object.keys(FORMATIONS).map(f => <option key={f} value={f}>{FORMATIONS[f].label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-3 w-3 text-zinc-500 pointer-events-none" />
            </div>
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setFlowMode(prev => prev === 'attacking' ? 'none' : 'attacking')}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-colors ${flowMode === 'attacking' ? 'bg-primary text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                ⚔️ Attacking Flow
              </button>
              <button
                onClick={() => setFlowMode(prev => prev === 'defensive' ? 'none' : 'defensive')}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-colors ${flowMode === 'defensive' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                🛡️ Defensive Flow
              </button>
            </div>
            <button
              onClick={() => { applyFormation(formation, players); setSelectedId(null); setFlowMode('none'); }}
              className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 hover:border-zinc-500 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Pitch */}
          <div className="lg:col-span-3 space-y-2">
            <div
              ref={pitchRef}
              className="relative mx-auto w-full max-w-120 aspect-3/4 rounded-2xl overflow-hidden select-none border border-zinc-800"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, #052e16 0%, #022c22 60%, #0a1f15 100%)', cursor: dragging ? 'grabbing' : 'default' }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseUp}
            >
              {/* SVG pitch lines */}
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

                {/* Dynamic tactical flow arrows for each player */}
                {flowMode !== 'none' && pitchPlayers.map((pp) => {
                  if (pp.role === 'GK' || pp.number === 0) return null; // GK or empty slots stay fixed

                  const isAttacking = flowMode === 'attacking';
                  const color = isAttacking ? '#fbbf24' : '#f87171';
                  const marker = isAttacking ? 'url(#arrow-attack)' : 'url(#arrow-defend)';

                  let targetX = pp.x;
                  let targetY = pp.y;
                  let useCurve = false;
                  let controlX = pp.x;
                  let controlY = pp.y;

                  if (isAttacking) {
                    if (['LB', 'LWB', 'RB', 'RWB'].includes(pp.role)) {
                      targetY = pp.y - 12;
                      targetX = pp.x + (pp.x < 50 ? -3 : 3);
                    } else if (['LW', 'RW'].includes(pp.role)) {
                      targetY = pp.y - 10;
                      targetX = pp.x + (pp.x < 50 ? 10 : -10);
                      useCurve = true;
                      controlX = pp.x + (pp.x < 50 ? 2 : -2);
                      controlY = pp.y - 8;
                    } else if (['CAM', 'CM', 'CM', 'CDM', 'LM', 'RM'].includes(pp.role)) {
                      targetY = pp.y - 8;
                    } else if (pp.role === 'ST') {
                      targetY = pp.y - 6;
                    } else if (pp.role === 'CB') {
                      targetY = pp.y - 3;
                    }
                  } else {
                    if (['LB', 'RB', 'LWB', 'RWB'].includes(pp.role)) {
                      targetX = pp.x + (pp.x < 50 ? 3 : -3);
                      targetY = pp.y + 8;
                    } else if (['CB'].includes(pp.role)) {
                      targetY = pp.y + 6;
                    } else if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pp.role)) {
                      targetY = pp.y + 8;
                    } else if (['LW', 'RW', 'ST'].includes(pp.role)) {
                      targetY = pp.y + 8;
                    }
                  }

                  const startX = pp.x;
                  const startY = isAttacking ? pp.y - 3.5 : pp.y + 3.5;
                  const finalTargetX = targetX;
                  const adjustY = targetY;

                  if (useCurve) {
                    return (
                      <path
                        key={`flow-${pp.id}`}
                        d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${finalTargetX} ${adjustY}`}
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
                        key={`flow-${pp.id}`}
                        x1={startX}
                        y1={startY}
                        x2={finalTargetX}
                        y2={adjustY} // Direct target coordinates
                        stroke={color}
                        strokeWidth="0.8"
                        strokeDasharray="2 1"
                        markerEnd={marker}
                      />
                    );
                  }
                })}
              </svg>

              {/* Pitch players */}
              {pitchPlayers.map(pp => {
                const color = ROLE_COLOR[pp.role] ?? '#facc15';
                const isSelected = selectedId === pp.id;

                // Calculate display coordinates based on attacking/defensive flow shifts
                let rx = pp.x;
                let ry = pp.y;

                if (flowMode === 'attacking') {
                  if (['LB', 'LWB', 'RB', 'RWB'].includes(pp.role)) {
                    ry = pp.y - 12;
                    rx = pp.x + (pp.x < 50 ? -3 : 3);
                  } else if (['LW', 'RW'].includes(pp.role)) {
                    ry = pp.y - 10;
                    rx = pp.x + (pp.x < 50 ? 10 : -10);
                  } else if (['CAM', 'CM', 'CDM', 'LM', 'RM'].includes(pp.role)) {
                    ry = pp.y - 8;
                  } else if (pp.role === 'ST') {
                    ry = pp.y - 6;
                  } else if (pp.role === 'CB') {
                    ry = pp.y - 3;
                  }
                } else if (flowMode === 'defensive') {
                  if (['LB', 'RB', 'LWB', 'RWB'].includes(pp.role)) {
                    rx = pp.x + (pp.x < 50 ? 5 : -5);
                    ry = pp.y + 2;
                  } else if (['CB'].includes(pp.role)) {
                    ry = pp.y + 3;
                  } else if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pp.role)) {
                    ry = pp.y + 8;
                  } else if (['LW', 'RW', 'ST'].includes(pp.role)) {
                    ry = pp.y + 6;
                  }
                }

                return (
                  <div
                    key={pp.id}
                    className="absolute z-10 flex flex-col items-center touch-none"
                    style={{
                      left: `${rx}%`,
                      top: `${ry}%`,
                      transition: dragging === pp.id ? 'none' : 'left 0.5s cubic-bezier(0.16, 1, 0.3, 1), top 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: 'translate(-50%,-50%)',
                      userSelect: 'none'
                    }}
                    onMouseDown={e => handleMouseDown(e, pp.id)}
                    onTouchStart={e => handleTouchStart(e, pp.id)}
                  >
                    <div
                      className="relative flex flex-col items-center cursor-grab active:cursor-grabbing group"
                      title={`${pp.name} #${pp.number}`}
                    >
                      {/* Circle */}
                      <div
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 overflow-hidden flex items-center justify-center transition-all duration-150 group-hover:scale-110"
                        style={{
                          borderColor: color,
                          background: '#111827',
                          boxShadow: isSelected ? `0 0 0 3px ${color}66, 0 0 14px ${color}44` : `0 2px 6px rgba(0,0,0,0.5)`,
                          transform: isSelected ? 'scale(1.15)' : undefined,
                        }}
                      >
                        {pp.photo ? (
                          <img src={pp.photo} alt={pp.name} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <span className="text-[10px] md:text-[11px] font-black" style={{ color }}>{pp.number || '?'}</span>
                        )}
                      </div>
                      {/* Role chip */}
                      <div className="text-[6px] md:text-[7px] font-black px-1 rounded-sm mt-0.5" style={{ background: color, color: '#000' }}>{pp.role}</div>
                      {/* Name */}
                      <div className="text-[8px] md:text-[9px] font-bold text-white bg-black/70 rounded px-1 leading-tight mt-0.5 whitespace-nowrap">
                        {pp.name !== '—' ? pp.name.split(' ').slice(-1)[0] : '—'}
                      </div>
                      {pp.averageRating > 0 && (
                        <div className="text-[7px] md:text-[8px] font-black" style={{ color }}>{pp.averageRating}</div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Attack direction arrow */}
              <div className="absolute top-2 left-2 text-[8px] text-emerald-600 font-bold opacity-50 pointer-events-none">▲ ATTACK</div>
              <div className="absolute bottom-2 left-2 text-[8px] text-emerald-600 font-bold opacity-50 pointer-events-none">▼ DEFEND</div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] text-zinc-400 flex-wrap px-1">
              {[['GK', '#94a3b8'], ['DEF', '#34d399'], ['MID', '#60a5fa'], ['FWD', '#facc15']].map(([label, color]) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: color as string }} />
                  {label}
                </span>
              ))}
              <span className="ml-auto text-zinc-600 italic text-[9px]">Click to select · Drag to move</span>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-3">
            {/* Selected player card */}
            {selectedPitch && selectedPitch.number > 0 ? (
              <div className="glass-card rounded-2xl p-4 border border-primary/40 space-y-3 animate-in fade-in duration-150">
                <div className="text-[9px] text-primary font-black uppercase tracking-wider">Selected Player</div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full border-2 border-primary overflow-hidden bg-zinc-900 flex items-center justify-center text-primary font-black text-sm shrink-0">
                    {selectedPitch.photo ? (
                      <img src={selectedPitch.photo} alt={selectedPitch.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>#{selectedPitch.number}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white leading-tight">{selectedPitch.name}</div>
                    <div className="text-xs text-zinc-400">#{selectedPitch.number} · {selectedPitch.role}</div>
                    <div className="text-xs font-black text-accent mt-0.5">{selectedPitch.averageRating} avg</div>
                  </div>
                </div>
                <Link href={`/players/${selectedPitch.id}`} className="block text-center text-[10px] text-primary hover:underline bg-zinc-900/60 rounded-lg py-1.5 border border-zinc-800">
                  View full profile →
                </Link>
                {benchPlayers.length > 0 && (
                  <p className="text-[9px] text-yellow-400 text-center animate-pulse">↓ Tap bench player to swap</p>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-4 border border-zinc-800 text-center">
                <Users className="h-6 w-6 text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-600 text-[11px]">Click a player on the pitch to select</p>
              </div>
            )}

            {/* Bench */}
            <div className="glass-card rounded-2xl p-4 border border-zinc-800 space-y-2">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Bench ({benchPlayers.length})</h3>
              <div className="space-y-1 max-h-72 overflow-y-auto pr-0.5">
                {benchPlayers.map(bp => (
                  <button
                    key={bp.id}
                    onClick={() => swapWithBench(bp)}
                    disabled={!selectedId}
                    className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all border ${selectedId
                        ? 'bg-zinc-800/80 hover:bg-zinc-700/80 border-zinc-600 hover:border-primary cursor-pointer'
                        : 'bg-zinc-900/40 border-zinc-800/60 cursor-default opacity-60'
                      }`}
                    title={selectedId ? `Swap with ${bp.name}` : 'Select a pitch player first'}
                  >
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-zinc-400 font-black text-[9px] shrink-0">
                      {bp.photo ? (
                        <img src={bp.photo} alt={bp.name} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      ) : bp.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-zinc-300 truncate flex items-center gap-1">
                        <span>{bp.name}</span>
                        {bp.injuryStatus === 'Injured' && (
                          <span className="bg-red-500/20 text-red-400 text-[6.5px] font-black px-1 py-0.2 rounded uppercase shrink-0">
                            INJ
                          </span>
                        )}
                        {bp.injuryStatus === 'Returned to Club' && (
                          <span className="bg-yellow-500/20 text-yellow-400 text-[6.5px] font-black px-1 py-0.2 rounded uppercase shrink-0">
                            CLUB
                          </span>
                        )}
                      </div>
                      <div className="text-[8px] text-zinc-500">{bp.position} · #{bp.number}</div>
                    </div>
                    <span className="text-[9px] font-black text-accent shrink-0">{bp.averageRating}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TACTICAL ANALYSIS PANEL */}
      <section className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block shrink-0" />
              Tactical Overview: {formation} Formation
            </h3>
            <p className="text-[10px] text-zinc-500 mt-1">
              Dynamic analysis based on active pitch lineup and tactical phase.
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${flowMode === 'attacking' ? 'bg-primary/20 text-primary border border-primary/35' : flowMode === 'defensive' ? 'bg-red-500/20 text-red-400 border border-red-500/35' : 'bg-zinc-800 text-zinc-400'}`}>
              Phase: {flowMode === 'none' ? 'Standard shape' : flowMode === 'attacking' ? 'Attacking flow' : 'Defensive transition'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1: Active Starting XI */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-3">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">📋 Active starting lineup ({formation})</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 max-h-55 overflow-y-auto pr-1">
              {pitchPlayers.map((pp) => (
                <div key={pp.role + pp.name} className="flex items-center gap-1.5 py-0.5 border-b border-zinc-800/30 last:border-0">
                  <span className="text-[7.5px] font-black bg-zinc-800 text-zinc-400 rounded px-1.5 py-0.2 w-7 shrink-0 text-center">{pp.role}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9.5px] font-bold text-zinc-300 truncate">{pp.name}</div>
                    <div className="text-[8px] text-zinc-500 font-medium truncate">{pp.averageRating > 0 ? `${pp.averageRating} Rating` : 'Squad Player'}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Substitution Suggestions */}
            <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2.5">
              <div className="text-[9px] font-black text-primary uppercase tracking-wider flex items-center gap-1">
                <span>🔄 Tactical Suggestions</span>
              </div>
              <p className="text-[9.5px] text-zinc-400 leading-normal">
                Select a pitch player first, then tap a choice below to substitute and maintain pressure:
              </p>
              <div className="space-y-1.5 max-h-47.5 overflow-y-auto pr-1">
                {[
                  { id: 'faris-danish', name: 'Faris Danish', role: 'LB/LWB Cover', rating: 7.69, photo: '/players/faris-danish.png' },
                  { id: 'syafiq-ahmad', name: 'Syafiq Ahmad', role: 'RW/LW/ST Cover', rating: 7.24, photo: '/players/syafiq-ahmad.png' },
                  { id: 'daryl-sham', name: 'Daryl Sham', role: 'CM/CDM Cover', rating: 6.97, photo: '/players/daryl-sham.png' },
                  { id: 'haqimi-azim', name: 'Haqimi Azim', role: 'ST/CF Striker', rating: 6.55, photo: '/players/haqimi-azim.png' },
                  { id: 'engku-nur-shakir', name: 'Engku Shakir', role: 'RB/RWB Cover', rating: 7.02, photo: '/players/engku-nur-shakir.png' }
                ].map(sp => {
                  const playerObj = players.find(p => p.id === sp.id);
                  const isAlreadyOnPitch = pitchPlayers.some(p => p.id === sp.id);

                  return (
                    <button
                      key={sp.id}
                      onClick={() => {
                        if (playerObj) swapWithBench(playerObj);
                      }}
                      disabled={!selectedId || isAlreadyOnPitch}
                      className={`w-full flex items-center gap-2 rounded-lg px-2 py-1 text-left transition-all border ${
                        isAlreadyOnPitch
                          ? 'bg-primary/5 border-primary/20 opacity-80 cursor-default'
                          : selectedId
                            ? 'bg-zinc-800/80 hover:bg-zinc-700/80 border-zinc-650 hover:border-primary cursor-pointer'
                            : 'bg-zinc-900/40 border-zinc-800/60 opacity-60 cursor-default'
                      }`}
                      title={isAlreadyOnPitch ? 'Already on pitch' : selectedId ? `Swap with ${sp.name}` : 'Select a pitch player first to swap'}
                    >
                      <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                        <img src={sp.photo} alt={sp.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-bold text-zinc-300 truncate flex items-center gap-1">
                          <span>{sp.name}</span>
                          {isAlreadyOnPitch && <span className="bg-primary/20 text-primary text-[6px] font-bold px-1 rounded uppercase">Active</span>}
                        </div>
                        <div className="text-[7.5px] text-zinc-500">{sp.role}</div>
                      </div>
                      <span className="text-[8.5px] font-black text-accent shrink-0">{sp.rating}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: During Attacking - Left Flank Focus */}
          <div className={`bg-zinc-900/40 border rounded-xl p-4 space-y-2.5 transition-all duration-300 ${flowMode === 'attacking' ? 'border-primary/50 shadow-md shadow-primary/5 bg-primary/2' : 'border-zinc-800/80'}`}>
            <div className="text-[10px] font-black text-primary uppercase tracking-wider flex items-center gap-1">
              <span>🔥 During Attacking</span>
              {flowMode === 'attacking' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
            </div>
            <div className="text-[10.5px] text-zinc-400 space-y-2 leading-relaxed">
              <p className="text-zinc-300 italic text-[10px] bg-zinc-800/40 border border-zinc-700/30 rounded-lg p-2">
                <strong>Strategic Reason ({formation}):</strong> {FORMATION_REASONS[formation]?.attack}
              </p>
              {formation === '4-3-3' && (
                <>
                  <p>
                    <strong>Left Flank Overloads:</strong> Left Back (<strong>{pitchPlayers.find(p => ['LB', 'LWB'].includes(p.role))?.name || 'Ruventhiran'}</strong>) drives vertically up the wing, forming a passing triangle with the CM and the wide LW to overload the opponent's right channel.
                  </p>
                  <p>
                    <strong>Inside Cuts:</strong> Left Winger (<strong>{pitchPlayers.find(p => ['LW', 'LM'].includes(p.role))?.name || 'Pavithran'}</strong>) cuts inside aggressively to join Paulo Josué in the box, opening up space for the overlapping LB.
                  </p>
                  <p>
                    <strong>Through Ball:</strong> Central midfielders use vertical through balls to split the opponent's center-backs, releasing striker <strong>{pitchPlayers.find(p => p.role === 'ST')?.name || 'Paulo Josué'}</strong> in behind.
                  </p>
                  <p>
                    <strong>Set Piece:</strong> Target high outswinging corners aimed at center-backs like <strong>{pitchPlayers.find(p => p.role === 'CB')?.name || 'Rodney Celvin'}</strong> at the far post, using blocks to isolate matching defenders.
                  </p>
                </>
              )}
              {formation === '4-4-2' && (
                <>
                  <p>
                    <strong>Left Flank Overloads:</strong> Left Midfielder (<strong>{pitchPlayers.find(p => ['LW', 'LM'].includes(p.role))?.name || 'Pavithran'}</strong>) stays wide to deliver crosses into the box for the two target strikers, supported by underlapping runs from the Left Back.
                  </p>
                  <p>
                    <strong>Inside Cuts:</strong> Left Midfielder (<strong>{pitchPlayers.find(p => ['LW', 'LM'].includes(p.role))?.name || 'Pavithran'}</strong>) drifts inside to combine directly with strikers, pulling the opponent fullback inside and opening crossing lanes for LB overlaps.
                  </p>
                  <p>
                    <strong>Through Ball:</strong> Wingers feed diagonal through balls behind opposing fullbacks to match the runs of underlapping CMs or dynamic strikers.
                  </p>
                  <p>
                    <strong>Set Piece:</strong> Utilize low, whipped wide free-kicks aimed at the near post, looking for flicks from the two target forwards.
                  </p>
                </>
              )}
              {formation === '4-2-3-1' && (
                <>
                  <p>
                    <strong>Left Flank Overloads:</strong> Left Back (<strong>{pitchPlayers.find(p => ['LB', 'LWB'].includes(p.role))?.name || 'Ruventhiran'}</strong>) makes overlapping runs past LW (<strong>{pitchPlayers.find(p => ['LW', 'LM'].includes(p.role))?.name || 'Pavithran'}</strong>) to cross from the touchline, feeding the lone striker.
                  </p>
                  <p>
                    <strong>Inside Cuts:</strong> Left Winger (<strong>{pitchPlayers.find(p => ['LW', 'LM'].includes(p.role))?.name || 'Pavithran'}</strong>) cuts inside to function as a second playmaker in zone 14, combining with CAM <strong>Sergio Aguero</strong> to unlock central channels.
                  </p>
                  <p>
                    <strong>Through Ball:</strong> Playmaker <strong>Sergio Aguero</strong> slips central through balls between defensive lines to release striker <strong>{pitchPlayers.find(p => p.role === 'ST')?.name || 'Paulo Josué'}</strong>.
                  </p>
                  <p>
                    <strong>Set Piece:</strong> Direct free-kicks are lined up for central playmakers to shoot, or to deliver inswingers targeted at the penalty spot.
                  </p>
                </>
              )}
              {formation === '3-5-2' && (
                <>
                  <p>
                    <strong>Left Flank Overloads:</strong> Left Wingback (<strong>{pitchPlayers.find(p => ['LB', 'LWB'].includes(p.role))?.name || 'Ruventhiran'}</strong>) covers the entire left flank, charging forward to provide crossing width and combine with the two strikers.
                  </p>
                  <p>
                    <strong>Inside Cuts:</strong> Left Wingback (<strong>{pitchPlayers.find(p => ['LB', 'LWB'].includes(p.role))?.name || 'Ruventhiran'}</strong>) cuts inside to join central midfield overloads, combining with CMs to exploit space in half-spaces.
                  </p>
                  <p>
                    <strong>Through Ball:</strong> Central midfielders use rapid wall-pass combinations to setup clean vertical through balls into half-spaces for the strikers.
                  </p>
                  <p>
                    <strong>Set Piece:</strong> Wingbacks stand over wide free-kicks to deliver cross-field floaters, targeting the physical height advantage of the center-backs.
                  </p>
                </>
              )}
              {formation === '3-1-5-1' && (
                <>
                  <p>
                    <strong>Left Flank Overloads:</strong> Left Wingback (<strong>{pitchPlayers.find(p => ['LB', 'LWB'].includes(p.role))?.name || 'Ruventhiran'}</strong>) coordinates high-intensity overlaps with the left attacking midfielder to overload wide defensive lines.
                  </p>
                  <p>
                    <strong>Inside Cuts:</strong> Left attacking midfielder (<strong>{pitchPlayers.find(p => ['LW', 'LM'].includes(p.role))?.name || 'Pavithran'}</strong>) drifts inside to join the central passing web, combining with <strong>Sergio Aguero</strong> to release the lone striker.
                  </p>
                  <p>
                    <strong>Through Ball:</strong> High-possession five-midfielder passing webs wait for opposition displacement to trigger direct, incisive through balls to striker <strong>{pitchPlayers.find(p => p.role === 'ST')?.name || 'Paulo Josué'}</strong>.
                  </p>
                  <p>
                    <strong>Set Piece:</strong> Short-corner variations are prioritized to create a 3v2 overload on the flank before crossing to the back post.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Column 3: During Defensive - Left Channel Cover */}
          <div className={`bg-zinc-900/40 border rounded-xl p-4 space-y-2.5 transition-all duration-300 ${flowMode === 'defensive' ? 'border-red-500/50 shadow-md shadow-red-500/5 bg-red-500/2' : 'border-zinc-800/80'}`}>
            <div className="text-[10px] font-black text-red-400 uppercase tracking-wider flex items-center gap-1">
              <span>🛡️ During Defensive</span>
              {flowMode === 'defensive' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
            </div>
            <div className="text-[10.5px] text-zinc-400 space-y-2 leading-relaxed">
              <p className="text-zinc-300 italic text-[10px] bg-zinc-800/40 border border-zinc-700/30 rounded-lg p-2">
                <strong>Strategic Reason ({formation}):</strong> {FORMATION_REASONS[formation]?.defense}
              </p>
              {formation === '4-3-3' && (
                <>
                  <p>
                    <strong>Left Channel Cover:</strong> Left CM (<strong>{pitchPlayers.find(p => ['CM', 'CDM'].includes(p.role))?.name || 'Daryl Sham'}</strong>) slides wide to cover the vacant left fullback zone, forming a temporary mid-block to delay wide transition threat.
                  </p>
                  <p>
                    <strong>CB Lateral Shift:</strong> Left CB (<strong>{pitchPlayers.find(p => p.role === 'CB')?.name || 'Rodney Celvin'}</strong>) shifts wide to support the CM, checking the run of the opposing winger and forcing them to cycle the ball backwards.
                  </p>
                  <p>
                    <strong>Pressure High:</strong> The front three triggers intensive high pressure inside the opponent's penalty box during goal-kicks, squeezing options.
                  </p>
                  <p>
                    <strong>Mark Man-to-Man:</strong> Central midfielders lock onto opposition playmakers man-to-man to prevent clean pivot turn operations.
                  </p>
                </>
              )}
              {formation === '4-4-2' && (
                <>
                  <p>
                    <strong>Left Channel Cover:</strong> Left CM (<strong>{pitchPlayers.find(p => ['CM', 'CDM'].includes(p.role))?.name || 'Daryl Sham'}</strong>) shifts laterally to screen the center, while LM (<strong>{pitchPlayers.find(p => ['LW', 'LM'].includes(p.role))?.name || 'Pavithran'}</strong>) tracks back to double-team wide attackers.
                  </p>
                  <p>
                    <strong>CB Lateral Shift:</strong> Left CB (<strong>{pitchPlayers.find(p => p.role === 'CB')?.name || 'Rodney Celvin'}</strong>) drops deeper to sweep behind the Left Back, maintaining central cover against diagonal crosses.
                  </p>
                  <p>
                    <strong>Pressure High:</strong> Maintain standard two-bank high pressure lines, forcing opponent build-up to execute riskier long balls over midlines.
                  </p>
                  <p>
                    <strong>Mark Man-to-Man:</strong> Center-backs tightly mark the two opposing forwards man-to-man, blocking physical post-up turns.
                  </p>
                </>
              )}
              {formation === '4-2-3-1' && (
                <>
                  <p>
                    <strong>Left Channel Cover:</strong> Left-sided CDM (<strong>{pitchPlayers.find(p => ['CM', 'CDM'].includes(p.role))?.name || 'Daryl Sham'}</strong>) shifts wide to cover the overlapping Left Back, preventing counter-runs down the left flank.
                  </p>
                  <p>
                    <strong>CB Lateral Shift:</strong> Left CB (<strong>{pitchPlayers.find(p => p.role === 'CB')?.name || 'Rodney Celvin'}</strong>) steps up to press inside-drifting forwards, backed by the double pivot screening the zone.
                  </p>
                  <p>
                    <strong>Pressure High:</strong> Squeeze passing paths using high pressure led by the attacking mid CAM and wide wingers, trapping the ball in wide corridors.
                  </p>
                  <p>
                    <strong>Mark Man-to-Man:</strong> The double CDMs lock onto the main attacking midfielders man-to-man, suffocating zone 14 combination spaces.
                  </p>
                </>
              )}
              {formation === '3-5-2' && (
                <>
                  <p>
                    <strong>Left Channel Cover:</strong> Left-sided CM (<strong>{pitchPlayers.find(p => ['CM', 'CDM'].includes(p.role))?.name || 'Daryl Sham'}</strong>) slides wide to support the wingback, delaying transitions and sealing the sideline.
                  </p>
                  <p>
                    <strong>CB Lateral Shift:</strong> Left CB (<strong>{pitchPlayers.find(p => p.role === 'CB')?.name || 'Rodney Celvin'}</strong>) shifts wide to cover the flank, functioning as a fullback while the wingback recovers.
                  </p>
                  <p>
                    <strong>Pressure High:</strong> Wingbacks push high to pressure opposing fullbacks immediately, backed by CM shifts to seal inner channels.
                  </p>
                  <p>
                    <strong>Mark Man-to-Man:</strong> Three center-backs match and mark opposing strikers man-to-man, with the central CB operating as a sweeper.
                  </p>
                </>
              )}
              {formation === '3-1-5-1' && (
                <>
                  <p>
                    <strong>Left Channel Cover:</strong> Sole CDM (<strong>{pitchPlayers.find(p => ['CDM'].includes(p.role))?.name || 'Ibrahim Manusi'}</strong>) shifts wide left to cover the flank, breaking up transition play.
                  </p>
                  <p>
                    <strong>CB Lateral Shift:</strong> Left CB (<strong>{pitchPlayers.find(p => p.role === 'CB')?.name || 'Rodney Celvin'}</strong>) moves wide to cover the half-space, while central CB stays deep to protect the center.
                  </p>
                  <p>
                    <strong>Pressure High:</strong> Five midfielders compress vertical lines with coordinated high pressure, trapping back passes to the keeper.
                  </p>
                  <p>
                    <strong>Mark Man-to-Man:</strong> Left and right CBs lock onto wingers man-to-man, while CDM <strong>Ibrahim Manusi</strong> monitors central zone runners.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OPPONENT SCOUT REPORT */}
      <section className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-4">
        <div>
          <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shrink-0" />
            Opponent Scout Report: Vietnam 🇻🇳 (3-4-3)
          </h3>
          <p className="text-[10px] text-zinc-500 mt-1">
            Tactical breakdown of Vietnam's playstyle under head coach Kim Sang-sik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Strengths */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-3">
            <div className="text-[10.5px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📈 Key Tactical Strengths</span>
            </div>
            <ul className="text-[11px] text-zinc-400 space-y-2.5 list-disc pl-4">
              <li>
                <strong className="text-zinc-200">High-Intensity Wingback Overloads:</strong> Wingbacks push aggressively high in possession, supporting inverted forwards to create 2v1 overloads on the flanks.
              </li>
              <li>
                <strong className="text-zinc-200">Resilient Central Block (Back-3):</strong> Their 3-CB configuration protects the penalty box exceptionally well against direct crosses and long balls (only 1 goal conceded in group stage).
              </li>
              <li>
                <strong className="text-zinc-200">Midfield Pivot Press:</strong> Do Hung Dung and Nguyen Hoang Duc coordinate a quick, aggressive central press to disrupt opponent build-up in early phases.
              </li>
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-3">
            <div className="text-[10.5px] font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📉 Exploitable Weaknesses</span>
            </div>
            <ul className="text-[11px] text-zinc-400 space-y-2.5 list-disc pl-4">
              <li>
                <strong className="text-zinc-200">Vulnerable Flanks on Transition:</strong> Since their wingbacks play very high, quick counter-attacks down the wings immediately expose the space behind them before their back-3 can shift wide.
              </li>
              <li>
                <strong className="text-zinc-200">Midfield Pivot Numerical Underload:</strong> Their 2-man midfield pivot can be overrun and bypassed centrally by a 3-man midfield setup (e.g., Malaysia's 4-2-3-1 or 4-3-3).
              </li>
              <li>
                <strong className="text-zinc-200">Outer Center-Back Dislocation:</strong> Pulling the wide center-backs out of the defensive block with wide wing play creates central gaps between the remaining center-backs.
              </li>
            </ul>
          </div>

          {/* Action Plan */}
          <div className="bg-zinc-900/40 border border-primary/20 rounded-xl p-4 space-y-3">
            <div className="text-[10.5px] font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯 Strategy to Overcome Vietnam</span>
            </div>
            <ul className="text-[11px] text-zinc-400 space-y-2.5 list-disc pl-4">
              <li>
                <strong className="text-zinc-200">Central Overload (3v2):</strong> Force a central numerical advantage with a 3-man midfield pivot (Aguero, Haiqal, Josué) to dominate possession and isolate their 2-man pivot.
              </li>
              <li>
                <strong className="text-zinc-200">Fast Transition Outlets:</strong> Hit the empty spaces behind Vietnam's advanced wingbacks by releasing Pavithran and Engku Nur Shakir on quick counter-runs.
              </li>
              <li>
                <strong className="text-zinc-200">Inverted Winger Cuts:</strong> Instruct wide forwards to cut inside, dragging outer center-backs away and opening central channels for Sergio Aguero's vertical runs.
              </li>
              <li>
                <strong className="text-zinc-200">Lateral Coverage:</strong> Fullbacks maintain a compact shape, supported by defensive midfielders shifting laterally to contain wide overloads.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

