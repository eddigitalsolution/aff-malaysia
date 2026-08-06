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

          {/* Marketing/Development CTA Banner */}
          <div className="mt-12 mb-4 p-6 md:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg">
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2.5 max-w-3xl z-10">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-500 tracking-widest uppercase">
                <span>💡</span>
                <span>Servis Pembangunan & Pemasaran</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                Perlukan Bantuan Website Atau Pemasaran Digital? 🚀
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Hubungi kami jika anda memerlukan bantuan mengenai pembangunan laman web (website), sistem perkhidmatan custom, atau pemasaran digital (marketing).
              </p>
            </div>
            
            <a 
              href="https://wa.me/601130719502" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all duration-200 shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0 z-10 active:scale-[0.98]"
            >
              Hubungi WhatsApp (+60 11-3071 9502)
            </a>
          </div>
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
