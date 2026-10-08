import { create } from 'zustand';

interface AppState {
  activeTournamentId: string;
  setActiveTournamentId: (id: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Comparison state
  compareTeamA: string | null;
  compareTeamB: string | null;
  setCompareTeamA: (teamId: string | null) => void;
  setCompareTeamB: (teamId: string | null) => void;
  
  comparePlayerA: string | null;
  comparePlayerB: string | null;
  setComparePlayerA: (playerId: string | null) => void;
  setComparePlayerB: (playerId: string | null) => void;

  // Live match simulator values
  liveMinute: number;
  incrementLiveMinute: () => void;
  resetLiveMinute: () => void;
}

export const useAppState = create<AppState>((set) => ({
  activeTournamentId: 'fifa-asean-cup-2026',
  setActiveTournamentId: (activeTournamentId) => set({ activeTournamentId }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  compareTeamA: 'malaysia',
  compareTeamB: 'indonesia',
  setCompareTeamA: (compareTeamA) => set({ compareTeamA }),
  setCompareTeamB: (compareTeamB) => set({ compareTeamB }),
  
  comparePlayerA: 'arif-aiman',
  comparePlayerB: 'chanathip',
  setComparePlayerA: (comparePlayerA) => set({ comparePlayerA }),
  setComparePlayerB: (comparePlayerB) => set({ comparePlayerB }),

  liveMinute: 72,
  incrementLiveMinute: () => set((state) => ({ 
    liveMinute: state.liveMinute < 90 ? state.liveMinute + 1 : 90 
  })),
  resetLiveMinute: () => set({ liveMinute: 72 }),
}));
