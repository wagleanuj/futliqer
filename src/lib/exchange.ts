import type { Liquidation } from '@/types'

export class ExchangeManager {
  private ws: WebSocket | null = null
  private onLiquidation: (liquidation: Liquidation) => void

  constructor(onLiquidation: (liquidation: Liquidation) => void) {
    this.onLiquidation = onLiquidation
  }

  connect() {
    if (this.ws) {
      this.ws.close()
    }

    // Connect to our backend WebSocket server
    this.ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8090')

    this.ws.onmessage = (event) => {
      try {
        const liquidation: Liquidation = JSON.parse(event.data)
        this.onLiquidation(liquidation)
      } catch (error) {
        console.error('Error processing message:', error)
      }
    }

    this.ws.onerror = (event) => {
      console.error('WebSocket connection failed. Please ensure the server is running on port', process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_PORT || '8090')
      // Optionally trigger reconnect after a delay
      setTimeout(() => this.connect(), 5000)
    }

    this.ws.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect...')
      setTimeout(() => this.connect(), 5000)
    }

    this.ws.onopen = () => {
      console.log('WebSocket connection established successfully')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
