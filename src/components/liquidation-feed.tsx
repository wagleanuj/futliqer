'use client'

import { useEffect, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'

// Function to format price with all decimal places
const formatExactPrice = (price: number): string => {
  return price.toString()
}

export function LiquidationFeed() {
  const liquidations = useStore((state) => state.liquidations)
  const settings = useStore((state) => state.settings)
  const watchlist = useStore((state) => state.watchlist)

  const filteredLiquidations = useMemo(() => {
    return liquidations.filter(
      (liq) => 
        settings.exchanges[liq.exchange].enabled &&
        watchlist.some(item => item.symbol === liq.symbol && item.enabled)
    )
  }, [liquidations, settings.exchanges, watchlist])

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Liquidation Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Exchange</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-right">Size (USD)</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLiquidations.map((liquidation, index) => (
              <TableRow 
                key={`${liquidation.timestamp}-${index}`}
                className={liquidation.type === 'long' ? 'bg-red-50/50 dark:bg-red-950/20' : 'bg-green-50/50 dark:bg-green-950/20'}
              >
                <TableCell>
                  {formatDistanceToNow(liquidation.timestamp, { addSuffix: true })}
                </TableCell>
                <TableCell className="capitalize">{liquidation.exchange}</TableCell>
                <TableCell className="font-medium">{liquidation.symbol}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      liquidation.type === 'long'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                    }`}
                  >
                    {liquidation.type === 'long' ? 'LONG LIQUIDATED' : 'SHORT LIQUIDATED'}
                  </span>
                </TableCell>
                <TableCell className={`text-right font-medium ${
                  liquidation.size >= 1000000 ? 'text-red-600 dark:text-red-400' : ''
                }`}>
                  ${liquidation.size.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${formatExactPrice(liquidation.price)}
                </TableCell>
              </TableRow>
            ))}
            {filteredLiquidations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No liquidations yet. Waiting for data...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
