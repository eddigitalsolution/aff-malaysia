'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/store';
import { 
  Trophy, Calendar, Users, User, BarChart2, 
  Menu, X, Star, Globe, ChevronDown, Swords, Zap, Sparkles
} from 'lucide-react';
import { TOURNAMENTS } from '@/lib/api';

const NAV_ITEMS = [
  { href: '/malaysia', label: 'Tactical Planner', icon: Star, highlight: true },
  { href: '/friendly', label: 'China Friendly (Tier 1)', icon: Swords, highlight: true, badge: 'NOV 14 & 17' },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/players', label: 'Players', icon: User },
  { href: '/potential-players', label: 'Potential Players', icon: Sparkles, badge: 'SCOUTING' },
  { href: '/squad-selection', label: 'Squad Selection', icon: Users },
  { href: '/fixtures', label: 'Fixtures & Results', icon: Calendar },
  { href: '/stats', label: 'Team Stats & Analytics', icon: BarChart2 },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeTournamentId, setActiveTournamentId } = useAppState();

  const activeTournament = TOURNAMENTS.find(t => t.id === activeTournamentId) || TOURNAMENTS[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative w-full max-w-full overflow-x-clip">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-125 h-72 sm:h-125 bg-primary/5 rounded-full blur-[120px] pointer-events-none max-w-full" />
      <div className="absolute bottom-10 left-10 w-64 sm:w-100 h-64 sm:h-100 bg-accent/5 rounded-full blur-[100px] pointer-events-none max-w-full" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full max-w-full bg-zinc-950/98 backdrop-blur-xl border-b border-zinc-800/90 shadow-md px-3 sm:px-4 lg:px-8 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Buka Menu"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white active:bg-zinc-800 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <img src="/malaysia-logo.png" alt="Harimau Malaya Logo" className="w-7 sm:w-8 h-7 sm:h-8 object-contain shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="bg-linear-to-r from-primary to-amber-500 bg-clip-text text-transparent font-extrabold text-xs sm:text-sm lg:text-base tracking-wider uppercase leading-none truncate">
                Harimau Malaya
              </span>
              <span className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5 leading-none">
                Analytics Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile Active Tournament Indicator */}
        <div className="lg:hidden flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-wider"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTournamentId === 'fifa-asean-cup-2026' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span className="truncate max-w-28">{activeTournament.shortName}</span>
            <ChevronDown className="h-3 w-3 text-zinc-500 shrink-0" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 relative w-full max-w-full min-w-0">
        {/* Desktop Sidebar */}
        <aside className="w-72 border-r border-zinc-900 bg-zinc-950 p-4 hidden lg:flex flex-col gap-4 sticky top-17.25 h-[calc(100vh-69px)] overflow-y-auto">
          {/* Tournament Selection Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-primary" />
                <span>Pilih Kejohanan</span>
              </span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase">2026 Season</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {TOURNAMENTS.map(t => {
                const active = t.id === activeTournamentId;
                const isFifa = t.id === 'fifa-asean-cup-2026';
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTournamentId(t.id)}
                    className={`text-left p-3 rounded-xl transition-all duration-200 border relative overflow-hidden group cursor-pointer ${
                      active
                        ? isFifa
                          ? 'bg-linear-to-br from-amber-500/15 via-zinc-900 to-zinc-950 border-amber-500/50 shadow-md shadow-amber-500/10'
                          : 'bg-linear-to-br from-emerald-500/15 via-zinc-900 to-zinc-950 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                        : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isFifa 
                          ? active ? 'bg-amber-400 text-zinc-950' : 'bg-amber-400/20 text-amber-400' 
                          : active ? 'bg-emerald-400 text-zinc-950' : 'bg-emerald-400/20 text-emerald-400'
                      }`}>
                        {isFifa ? 'FIFA ASEAN CUP' : 'AFF CHAMPIONSHIP'}
                      </span>
                      {active && (
                        <span className="flex h-2 w-2 relative">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFifa ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${isFifa ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        </span>
                      )}
                    </div>

                    <div className="font-extrabold text-xs text-zinc-100 group-hover:text-white leading-snug">
                      {t.name}
                    </div>

                    <div className="text-[10px] text-zinc-400 mt-1.5 flex flex-col gap-0.5">
                      <span className="truncate">{t.host}</span>
                      <span>{t.dates}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-zinc-900 my-1" />

          {/* Navigation Items Section */}
          <div className="space-y-1">
            <div className="px-1 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                Menu Analisis & Hub
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 uppercase">
                {activeTournament.shortName}
              </span>
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    active 
                      ? item.highlight 
                        ? 'bg-primary text-zinc-950 glow-yellow font-extrabold' 
                        : 'bg-zinc-900 text-primary border-l-2 border-primary pl-3'
                      : item.highlight
                        ? 'text-primary hover:bg-primary/10 border border-primary/20'
                        : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`h-4 w-4 shrink-0 ${active && item.highlight ? 'stroke-zinc-950' : ''}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {(item as any).badge && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      active ? 'bg-zinc-950/20 text-zinc-950' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div 
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-zinc-950 border-r border-zinc-800 p-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col gap-4 animate-in slide-in-from-left duration-250 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <img src="/malaysia-logo.png" alt="Harimau Malaya Logo" className="w-6 h-6 object-contain" />
                  <span className="font-black text-primary tracking-wider text-sm uppercase">Harimau Malaya</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Tutup Menu"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tournament Switcher inside Mobile Menu */}
              <div className="space-y-2">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Pilih Kejohanan</span>
                  <span className="text-zinc-500">2026 Season</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {TOURNAMENTS.map(t => {
                    const active = t.id === activeTournamentId;
                    const isFifa = t.id === 'fifa-asean-cup-2026';
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTournamentId(t.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`text-left p-3 rounded-xl text-xs font-bold transition-all flex flex-col gap-1 border active:scale-[0.99] cursor-pointer ${
                          active 
                            ? isFifa ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md' : 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase ${
                            isFifa ? 'bg-amber-400 text-zinc-950' : 'bg-emerald-400 text-zinc-950'
                          }`}>
                            {isFifa ? 'FIFA ASEAN' : 'AFF CUP'}
                          </span>
                          {active && <span className="text-[9px] text-primary font-bold">Aktif</span>}
                        </div>
                        <span className="font-extrabold">{t.name}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">{t.dates}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-zinc-900" />

              <nav className="flex flex-col gap-1 overflow-y-auto flex-1">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-1 px-1">
                  Menu Utama ({activeTournament.shortName})
                </div>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                        active 
                          ? item.highlight 
                            ? 'bg-primary text-zinc-950 font-bold' 
                            : 'bg-zinc-900 text-primary font-bold border-l-2 border-primary pl-3'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {(item as any).badge && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          {(item as any).badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Content Panel */}
        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-8 pb-24 lg:pb-8 max-w-350 mx-auto w-full overflow-x-clip">
          {children}

          {/* Marketing/Development CTA Banner */}
          <div className="mt-12 mb-4 p-5 sm:p-7 md:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg max-w-full">
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2 max-w-3xl z-10">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-400 tracking-widest uppercase">
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span>Servis Pembangunan & Pemasaran</span>
              </div>
              <h3 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                Perlukan Bantuan Website Atau Pemasaran Digital?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Hubungi kami jika anda memerlukan bantuan mengenai pembangunan laman web (website), sistem perkhidmatan custom, atau pemasaran digital (marketing).
              </p>
            </div>
            
            <a 
              href="https://wa.me/601130719502?text=Hai%20Ed%20Digital%2C%20saya%20berminat%20untuk%20bertanya%20mengenai%20servis%20pembangunan%20website%20dan%20pemasaran%20digital." 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all duration-200 shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0 z-10 active:scale-[0.98]"
            >
              Hubungi WhatsApp (+60 11-3071 9502)
            </a>
          </div>
        </main>
      </div>

      {/* Mobile iOS / Android Bottom Tab Bar */}
      <nav 
        aria-label="Navigasi Mudah Alih"
        className="lg:hidden fixed bottom-0 inset-x-0 w-full max-w-full z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl flex items-center justify-around"
      >
        <Link
          href="/malaysia"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
            pathname === '/malaysia' ? 'text-primary' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Star className={`h-5 w-5 ${pathname === '/malaysia' ? 'text-primary fill-primary/20' : ''}`} />
          <span>Taktikal</span>
        </Link>

        <Link
          href="/friendly"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 relative ${
            pathname === '/friendly' ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Swords className={`h-5 w-5 ${pathname === '/friendly' ? 'text-amber-400' : ''}`} />
          <span>China (T1)</span>
          <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </Link>

        <Link
          href="/standings"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
            pathname === '/standings' ? 'text-primary' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Trophy className={`h-5 w-5 ${pathname === '/standings' ? 'text-primary' : ''}`} />
          <span>Kedudukan</span>
        </Link>

        <Link
          href="/players"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
            pathname === '/players' ? 'text-primary' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <User className={`h-5 w-5 ${pathname === '/players' ? 'text-primary' : ''}`} />
          <span>Pemain</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold text-zinc-400 hover:text-zinc-200 active:scale-95 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
          <span>Lain-lain</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 px-4 pb-[max(5rem,env(safe-area-inset-bottom))] lg:pb-6">
        <p className="text-zinc-600">All statistical computations simulated for Harimau Malaya research and development purposes.</p>
      </footer>
    </div>
  );
}
