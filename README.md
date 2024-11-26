# Liquidation Monitor

A real-time cryptocurrency liquidation monitoring system that tracks and displays liquidation events from Binance and Bybit exchanges.

## Features

- Real-time liquidation tracking from Binance and Bybit
- Customizable watchlist for specific trading pairs
- Configurable notification thresholds
- Browser notifications and sound alerts
- Modern, responsive UI built with Next.js and shadcn/ui

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enable exchanges in the settings (gear icon)
2. Add trading pairs to your watchlist
3. Set notification thresholds for each pair
4. Allow browser notifications when prompted

## Tech Stack

- Next.js 13+
- TypeScript
- Tailwind CSS
- shadcn/ui
- CCXT for exchange integration
- Zustand for state management
