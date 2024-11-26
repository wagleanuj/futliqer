'use client'

import Image from "next/image";
import { LiquidationFeed } from '@/components/liquidation-feed'
import { Watchlist } from '@/components/watchlist'
import { SettingsDialog } from '@/components/settings-dialog'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="container mx-auto p-4 space-y-4 row-start-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Liquidation Monitor</h1>
        <SettingsDialog />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <LiquidationFeed />
        <Watchlist />
      </div>
    </main>
  </div>
  );
}
