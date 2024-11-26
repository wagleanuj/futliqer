import { WebSocketServer } from 'ws'
import { NextResponse } from 'next/server'
import WebSocket from 'ws'
import type { Liquidation } from '@/types'

let wss: WebSocketServer | null = null

function setupWebSocket() {
  if (wss) {
    try {
      wss.close()
      console.log('Closed existing WebSocket server')
    } catch (error) {
      console.error('Error closing existing WebSocket server:', error)
    }
  }

  const port = parseInt(process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_PORT || '8090')

  console.log(`Starting WebSocket server on port ${port}`)

  try {
    wss = new WebSocketServer({ port })

    wss.on('error', (error) => {
      console.error('WebSocket Server Error:', error.message)
    })

    wss.on('connection', (ws, req) => {
      const clientIp = req.socket.remoteAddress
      console.log(`Client connected from ${clientIp}`)
      let binanceWs: WebSocket | null = null

      // Binance connection
      try {
        binanceWs = new WebSocket('wss://fstream.binance.com/ws/!forceOrder@arr')

        binanceWs.on('open', () => {
          console.log('Binance WebSocket connected successfully')
        })

        binanceWs.on('message', (data: WebSocket.Data) => {
          try {
            const message = JSON.parse(data.toString())
            if (message.e === 'forceOrder') {
              const liquidation: Liquidation = {
                exchange: 'binance',
                symbol: message.o.s,
                size: parseFloat(message.o.q) * parseFloat(message.o.p),
                price: parseFloat(message.o.p),
                type: message.o.S.toLowerCase() as 'long' | 'short',
                timestamp: message.E,
              }
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(liquidation))
              }
            }
          } catch (error) {
            console.error('Error processing Binance message:', error instanceof Error ? error.message : String(error))
          }
        })

        binanceWs.on('error', (error) => {
          console.error('Binance WebSocket error:', error instanceof Error ? error.message : String(error))
        })

        binanceWs.on('close', () => {
          console.log('Binance WebSocket connection closed')
        })

        ws.on('close', () => {
          console.log(`Client ${clientIp} disconnected`)
          if (binanceWs && binanceWs.readyState === WebSocket.OPEN) {
            binanceWs.close()
            console.log('Closed Binance WebSocket connection')
          }
        })

        ws.on('error', (error) => {
          console.error(`Client ${clientIp} error:`, error instanceof Error ? error.message : String(error))
        })

      } catch (error) {
        console.error('Error setting up Binance WebSocket:', error instanceof Error ? error.message : String(error))
      }
    })
  } catch (error) {
    console.error('Error setting up WebSocket server:', error instanceof Error ? error.message : String(error))
    throw error
  }
}

export async function GET() {
  try {
    setupWebSocket()
    return NextResponse.json({ status: 'WebSocket server started successfully' })
  } catch (error) {
    console.error('Failed to start WebSocket server:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Failed to start WebSocket server' },
      { status: 500 }
    )
  }
}
