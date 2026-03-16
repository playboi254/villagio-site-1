import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePWAInstall } from '@/hooks/usePWAInstall'

const PWAInstallBanner = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall()
  const [dismissed, setDismissed] = useState(false)

  // Don't show on admin pages or if already installed/dismissed
  if (
    !isInstallable ||
    isInstalled ||
    dismissed ||
    window.location.pathname.startsWith('/admin')
  ) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50
      bg-white border border-primary/20 rounded-2xl shadow-xl p-4 flex items-center gap-4
      animate-in slide-in-from-bottom-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <img src="/icons/icon-72x72.png" alt="Villagio" className="w-8 h-8 rounded-lg" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">Install Villagio</p>
        <p className="text-xs text-muted-foreground">Shop fresh produce anytime, even offline</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button size="sm" onClick={install} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />Install
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default PWAInstallBanner