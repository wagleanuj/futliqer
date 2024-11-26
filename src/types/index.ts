export interface Liquidation {
  exchange: 'binance' | 'bybit'
  symbol: string
  size: number
  price: number
  type: 'long' | 'short'
  timestamp: number
}

export interface WatchlistItem {
  symbol: string
  threshold: number
  enabled: boolean
}

export interface ExchangeConfig {
  enabled: boolean
  apiKey?: string
  secretKey?: string
}

export interface Settings {
  exchanges: {
    binance: ExchangeConfig
    bybit: ExchangeConfig
  }
  notification: {
    sound: boolean
    browser: boolean
    minSize: number
  }
}
