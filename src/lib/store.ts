import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Liquidation, WatchlistItem, Settings } from '@/types'

const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { symbol: 'BTCUSDT', threshold: 100000, enabled: true },
  { symbol: 'ETHUSDT', threshold: 50000, enabled: true },
  { symbol: 'BNBUSDT', threshold: 20000, enabled: true },
  { symbol: 'DOGEUSDT', threshold: 10000, enabled: true },
]

interface Store {
  liquidations: Liquidation[]
  watchlist: WatchlistItem[]
  settings: Settings
  addLiquidation: (liquidation: Liquidation) => void
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (symbol: string) => void
  updateWatchlistItem: (symbol: string, updates: Partial<WatchlistItem>) => void
  updateSettings: (settings: Partial<Settings>) => void
  resetWatchlist: () => void
}

const DEFAULT_SETTINGS: Settings = {
  exchanges: {
    binance: {
      enabled: true,
    },
    bybit: {
      enabled: true,
    },
  },
  notification: {
    sound: true,
    browser: true,
    minSize: 100000, // Default 100k USD
  },
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      liquidations: [],
      watchlist: DEFAULT_WATCHLIST,
      settings: DEFAULT_SETTINGS,
      
      addLiquidation: (liquidation) =>
        set((state) => {
          // Only add liquidation if the symbol is in watchlist
          if (state.watchlist.some(item => item.symbol === liquidation.symbol && item.enabled)) {
            return {
              liquidations: [liquidation, ...state.liquidations].slice(0, 1000), // Keep last 1000 liquidations
            }
          }
          return state
        }),
      
      addToWatchlist: (item) =>
        set((state) => ({
          watchlist: [...state.watchlist, item],
        })),
      
      removeFromWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.filter((item) => item.symbol !== symbol),
        })),
      
      updateWatchlistItem: (symbol, updates) =>
        set((state) => ({
          watchlist: state.watchlist.map((item) =>
            item.symbol === symbol ? { ...item, ...updates } : item
          ),
        })),
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),

      resetWatchlist: () =>
        set(() => ({
          watchlist: DEFAULT_WATCHLIST,
        })),
    }),
    {
      name: 'futliqer-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Ensure watchlist is never empty
        if (!state || !state.watchlist || state.watchlist.length === 0) {
          state.watchlist = DEFAULT_WATCHLIST
        }
      },
    }
  )
)
