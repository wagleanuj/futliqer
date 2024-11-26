'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useStore } from '@/lib/store'
import { Settings } from 'lucide-react'

export function SettingsDialog() {
  const settings = useStore((state) => state.settings)
  const updateSettings = useStore((state) => state.updateSettings)
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium">Exchanges</h4>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Binance</label>
              <Switch
                checked={settings.exchanges.binance.enabled}
                onCheckedChange={(checked) =>
                  updateSettings({
                    exchanges: {
                      ...settings.exchanges,
                      binance: { ...settings.exchanges.binance, enabled: checked },
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Bybit</label>
              <Switch
                checked={settings.exchanges.bybit.enabled}
                onCheckedChange={(checked) =>
                  updateSettings({
                    exchanges: {
                      ...settings.exchanges,
                      bybit: { ...settings.exchanges.bybit, enabled: checked },
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Notifications</h4>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Browser Notifications</label>
              <Switch
                checked={settings.notification.browser}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notification: {
                      ...settings.notification,
                      browser: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Sound Alerts</label>
              <Switch
                checked={settings.notification.sound}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notification: {
                      ...settings.notification,
                      sound: checked,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Minimum Size for Global Alerts (USD)
              </label>
              <Input
                type="number"
                value={settings.notification.minSize}
                onChange={(e) =>
                  updateSettings({
                    notification: {
                      ...settings.notification,
                      minSize: parseFloat(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
