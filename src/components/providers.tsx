'use client'

import { useEffect } from 'react'
import { ExchangeManager } from '@/lib/exchange'
import { useStore } from '@/lib/store'
import type { Liquidation } from '@/types'

export function Providers({ children }: { children: React.ReactNode }) {
  const addLiquidation = useStore((state) => state.addLiquidation)
  const settings = useStore((state) => state.settings)
  const watchlist = useStore((state) => state.watchlist)

  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    // Start the WebSocket server
    fetch('/api/ws').catch(console.error)

    const exchangeManager = new ExchangeManager((liquidation: Liquidation) => {
      // Add to store
      addLiquidation(liquidation)

      // Check if we should notify
      const shouldNotify =
        liquidation.size >= settings.notification.minSize ||
        watchlist.some(
          (item) =>
            item.enabled &&
            item.symbol === liquidation.symbol &&
            liquidation.size >= item.threshold
        )

      if (shouldNotify) {
        // Browser notification
        if (settings.notification.browser && Notification.permission === 'granted') {
          new Notification(`Large Liquidation: ${liquidation.symbol}`, {
            body: `${liquidation.type.toUpperCase()} liquidation of $${liquidation.size.toLocaleString()} on ${
              liquidation.exchange
            }`,
          })
        }

        // Sound alert
        if (settings.notification.sound) {
          const audio = new Audio('/notification.mp3')
          audio.play().catch(console.error)
        }
      }
    })

    // Connect to WebSocket server if any exchange is enabled
    if (settings.exchanges.binance.enabled || settings.exchanges.bybit.enabled) {
      exchangeManager.connect()
    }

    return () => {
      exchangeManager.disconnect()
    }
  }, [settings.exchanges, settings.notification, watchlist, addLiquidation])

  return <>{children}</>
}
