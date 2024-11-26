'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useStore } from '@/lib/store'
import type { WatchlistItem } from '@/types'

export function Watchlist() {
  const [newSymbol, setNewSymbol] = useState('')
  const [threshold, setThreshold] = useState('100000')
  const watchlist = useStore((state) => state.watchlist)
  const addToWatchlist = useStore((state) => state.addToWatchlist)
  const removeFromWatchlist = useStore((state) => state.removeFromWatchlist)
  const updateWatchlistItem = useStore((state) => state.updateWatchlistItem)

  const handleAdd = () => {
    if (newSymbol && !watchlist.find((item) => item.symbol === newSymbol.toUpperCase())) {
      addToWatchlist({
        symbol: newSymbol.toUpperCase(),
        threshold: parseFloat(threshold),
        enabled: true,
      })
      setNewSymbol('')
      setThreshold('100000')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Symbol (e.g., BTCUSDT)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Threshold (USD)"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>

        <div className="space-y-4">
          {watchlist.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-4">
                <Switch
                  checked={item.enabled}
                  onCheckedChange={(checked) =>
                    updateWatchlistItem(item.symbol, { enabled: checked })
                  }
                />
                <span className="font-medium">{item.symbol}</span>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={item.threshold}
                  className="w-32"
                  onChange={(e) =>
                    updateWatchlistItem(item.symbol, {
                      threshold: parseFloat(e.target.value),
                    })
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromWatchlist(item.symbol)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
