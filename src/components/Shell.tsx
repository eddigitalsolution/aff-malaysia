'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/store';
import { 
  Home, Trophy, Calendar, Users, User, ArrowLeftRight, BarChart2, 
  Sparkles, Newspaper, Search, Menu, X, Star, Zap, Circle
} from 'lucide-react';
import { getPlayers, getTeams, getFixtures, Player, Team, Fixture } from '@/lib/api';

const NAV_ITEMS = [
  { href: '/malaysia', label: 'Tactical Planner', icon: Star, highlight: true },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/players', label: 'Players', icon: User },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useAppState();
  
  // Search data states
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [searchResults, setSearchResults] = useState<{
    players: Player[];
    teams: Team[];
    fixtures: Fixture[];
  }>({ players: [], teams: [], fixtures: [] });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function loadData() {
      const p = await getPlayers();
      const t = await getTeams();
      const f = await getFixtures();
      setPlayers(p);
      setTeams(t);
      setFixtures(f);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ players: [], teams: [], fixtures: [] });
      return;
    }
    const query = searchQuery.toLowerCase();
    
    const filteredPlayers = players.filter(p => 
      p.teamId === 'malaysia' && 
      (p.name.toLowerCase().includes(query) || p.position.toLowerCase().includes(query))
    );
    const filteredTeams = teams.filter(t => 
      t.id === 'malaysia' && 
      (t.name.toLowerCase().includes(query) || t.code.toLowerCase().includes(query))
    );
    const filteredFixtures = fixtures.filter(f => {
      const isMalaysiaGame = f.homeTeamId === 'malaysia' || f.awayTeamId === 'malaysia';
      if (!isMalaysiaGame) return false;
      const homeName = teams.find(t => t.id === f.homeTeamId)?.name.toLowerCase() || '';
      const awayName = teams.find(t => t.id === f.awayTeamId)?.name.toLowerCase() || '';
      return homeName.includes(query) || awayName.includes(query) || f.stage.toLowerCase().includes(query);
    });

    setSearchResults({
      players: filteredPlayers.slice(0, 4),
      teams: filteredTeams.slice(0, 3),
      fixtures: filteredFixtures.slice(0, 3),
    });
  }, [searchQuery, players, teams, fixtures]);

  const handleSearchSelect = (url: string) => {
    setSearchQuery('');
    setShowDropdown(false);
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-125 h-125 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-100 h-100 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass-card border-b border-zinc-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-zinc-400 hover:text-white p-1"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/malaysia-logo.png" alt="Harimau Malaya Logo" className="w-8 h-8 object-contain shrink-0" />
            <div className="flex flex-col">
              <span className="bg-linear-to-r from-primary to-amber-500 bg-clip-text text-transparent font-extrabold text-xs sm:text-sm lg:text-base tracking-wider uppercase leading-none">
                Harimau Malaya
              </span>
              <span className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5 leading-none">
                Analytics Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search */}
        <div className="relative flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search players, teams, matches..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-primary focus:bg-zinc-900 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showDropdown && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl p-3 border border-zinc-800 shadow-2xl max-h-100 overflow-y-auto z-50">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs text-zinc-500 font-semibold tracking-wider">SEARCH RESULTS</span>
                <button onClick={() => setShowDropdown(false)} className="text-zinc-500 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {searchResults.players.length === 0 && searchResults.teams.length === 0 && searchResults.fixtures.length === 0 ? (
                <div className="text-center py-6 text-sm text-zinc-500">No results found for "{searchQuery}"</div>
              ) : (
                <div className="space-y-3">
                  {/* Players */}
                  {searchResults.players.length > 0 && (
                    <div>
                      <h4 className="text-xs text-primary font-bold px-2 py-1">PLAYERS</h4>
                      <div className="space-y-0.5">
                        {searchResults.players.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleSearchSelect(`/players/${p.id}`)}
                            className="w-full text-left px-2 py-1.5 rounded-md hover:bg-zinc-800/80 text-xs flex justify-between items-center transition-colors"
                          >
                            <span>{p.name} ({p.position})</span>
                            <span className="text-zinc-500 text-[10px]">{p.club}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teams */}
                  {searchResults.teams.length > 0 && (
                    <div>
                      <h4 className="text-xs text-accent font-bold px-2 py-1">TEAMS</h4>
                      <div className="space-y-0.5">
                        {searchResults.teams.map(t => (
                          <button
                            key={t.id}
                            onClick={() => handleSearchSelect(`/teams/${t.id}`)}
                            className="w-full text-left px-2 py-1.5 rounded-md hover:bg-zinc-800/80 text-xs flex justify-between items-center transition-colors"
                          >
                            <span>{t.name}</span>
                            <span className="text-zinc-500 text-[10px]">Rank {t.fifaRanking}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matches */}
                  {searchResults.fixtures.length > 0 && (
                    <div>
                      <h4 className="text-xs text-zinc-400 font-bold px-2 py-1">MATCHES</h4>
                      <div className="space-y-0.5">
                        {searchResults.fixtures.map(f => {
                          const home = teams.find(t => t.id === f.homeTeamId);
                          const away = teams.find(t => t.id === f.awayTeamId);
                          return (
                            <button
                              key={f.id}
                              onClick={() => handleSearchSelect(`/matches/${f.id}`)}
                              className="w-full text-left px-2 py-1.5 rounded-md hover:bg-zinc-800/80 text-xs flex justify-between items-center transition-colors"
                            >
                              <span>{home?.name} vs {away?.name}</span>
                              <span className="text-zinc-500 text-[10px]">{f.stage}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>


      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="w-64 border-r border-zinc-900 bg-zinc-950 p-4 hidden lg:flex flex-col gap-1 sticky top-17.25 h-[calc(100vh-69px)] overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active 
                    ? item.highlight 
                      ? 'bg-primary text-zinc-950 glow-yellow font-bold' 
                      : 'bg-zinc-900 text-primary border-l-2 border-primary pl-3.5'
                    : item.highlight
                      ? 'text-primary hover:bg-primary/10 border border-primary/20'
                      : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active && item.highlight ? 'stroke-zinc-950' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-zinc-950 border-r border-zinc-800 p-5 flex flex-col gap-4 animate-in slide-in-from-left duration-250">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/malaysia-logo.png" alt="Harimau Malaya Logo" className="w-6 h-6 object-contain" />
                  <span className="font-black text-primary tracking-wider text-sm uppercase">Harimau Malaya</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm text-zinc-200 focus:outline-none"
                />
              </div>

              <nav className="flex flex-col gap-1 overflow-y-auto flex-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        active 
                          ? item.highlight 
                            ? 'bg-primary text-zinc-950 font-bold' 
                            : 'bg-zinc-900 text-primary'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Content Panel */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-350 mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 px-4">
        <p>© 2026-2027 ASEAN Hyundai Cup 2026 Analytics Platform.</p>
        <p className="mt-1 text-zinc-600">All statistical computations simulated for research and development purposes.</p>
      </footer>
    </div>
  );
}
