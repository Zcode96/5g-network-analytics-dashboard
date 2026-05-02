"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, MapPin, Radio, PauseCircle } from "lucide-react"
import { useSimulation } from "@/lib/simulation-context"

interface Tower {
  id: number
  name: string
  status: "online" | "warning" | "offline"
  x: number
  y: number
  strength: number
}

const initialTowers5G: Tower[] = [
  { id: 1, name: "Tower Alpha", status: "online", x: 25, y: 30, strength: 95 },
  { id: 2, name: "Tower Beta", status: "online", x: 65, y: 20, strength: 88 },
  { id: 3, name: "Tower Gamma", status: "online", x: 45, y: 55, strength: 92 },
  { id: 4, name: "Tower Delta", status: "warning", x: 80, y: 60, strength: 72 },
  { id: 5, name: "Tower Epsilon", status: "online", x: 20, y: 75, strength: 90 },
]

const initialTowers4G: Tower[] = [
  { id: 1, name: "Tower Alpha", status: "online", x: 25, y: 30, strength: 78 },
  { id: 2, name: "Tower Beta", status: "warning", x: 65, y: 20, strength: 65 },
  { id: 3, name: "Tower Gamma", status: "online", x: 45, y: 55, strength: 72 },
  { id: 4, name: "Tower Delta", status: "offline", x: 80, y: 60, strength: 0 },
  { id: 5, name: "Tower Epsilon", status: "online", x: 20, y: 75, strength: 68 },
]

export function CoverageMap() {
  const { mode, isSimulating, addLog } = useSimulation()
  const [towers, setTowers] = useState<Tower[]>(initialTowers5G)

  // Reset towers when mode changes
  useEffect(() => {
    setTowers(mode === "5G" ? initialTowers5G : initialTowers4G)
  }, [mode])

  // Fluctuate tower status and strength
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setTowers((prev) =>
        prev.map((tower) => {
          if (tower.status === "offline") return tower

          // Random strength fluctuation
          let newStrength = tower.strength + (Math.random() - 0.5) * 10
          const baseStrength = mode === "5G" ? 85 : 65
          newStrength = Math.max(baseStrength - 20, Math.min(100, newStrength))

          // Occasional status changes (more frequent in 4G)
          let newStatus = tower.status
          const degradeChance = mode === "4G" ? 0.08 : 0.03
          const recoverChance = 0.15

          if (tower.status === "online" && Math.random() < degradeChance) {
            newStatus = "warning"
            addLog({
              type: "signal_drop",
              message: `${tower.name}: Signal degradation detected`,
              severity: "warning",
            })
          } else if (tower.status === "warning" && Math.random() < recoverChance) {
            newStatus = "online"
            addLog({
              type: "recovery",
              message: `${tower.name}: Signal strength recovered`,
              severity: "info",
            })
          }

          return {
            ...tower,
            strength: Math.round(newStrength),
            status: newStatus,
          }
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [mode, isSimulating, addLog])

  const onlineCount = towers.filter((t) => t.status === "online").length
  const warningCount = towers.filter((t) => t.status === "warning").length
  const offlineCount = towers.filter((t) => t.status === "offline").length
  const avgCoverage = Math.round(
    towers.reduce((acc, t) => acc + t.strength, 0) / towers.length
  )

  return (
    <Card className="overflow-hidden rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
            <Map className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Cell Tower Coverage</CardTitle>
            <p className="text-xs text-muted-foreground">
              {mode} regional signal distribution
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-muted-foreground">Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <span className="text-muted-foreground">Warning</span>
          </div>
          {mode === "4G" && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <span className="text-muted-foreground">Offline</span>
            </div>
          )}
          {!isSimulating && (
            <div className="flex items-center gap-1.5 ml-2 border-l border-border pl-4">
              <PauseCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Paused</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Stylized Map Area */}
        <div 
          className="relative h-72 w-full overflow-hidden rounded-2xl"
          style={{
            background: `
              linear-gradient(135deg, oklch(0.96 0.02 250) 0%, oklch(0.92 0.03 250) 100%)
            `,
          }}
        >
          {/* Grid pattern */}
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path 
                  d="M 40 0 L 0 0 0 40" 
                  fill="none" 
                  stroke="oklch(0.88 0.025 250)" 
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Coverage circles */}
          {towers.map((tower) => (
            <div
              key={tower.id}
              className="absolute"
              style={{
                left: `${tower.x}%`,
                top: `${tower.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Signal coverage area */}
              {tower.status !== "offline" && (
                <div 
                  className={`absolute rounded-full opacity-20 ${isSimulating ? 'animate-pulse' : ''}`}
                  style={{
                    width: `${tower.strength * 1.5}px`,
                    height: `${tower.strength * 1.5}px`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: tower.status === 'online' 
                      ? 'radial-gradient(circle, oklch(0.55 0.15 250) 0%, transparent 70%)'
                      : 'radial-gradient(circle, oklch(0.75 0.15 80) 0%, transparent 70%)',
                  }}
                />
              )}
              
              {/* Tower marker */}
              <div 
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 ${
                  tower.status === 'online' 
                    ? 'bg-gradient-to-br from-primary to-accent' 
                    : tower.status === 'warning'
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500'
                    : 'bg-gradient-to-br from-rose-400 to-rose-500'
                }`}
              >
                <Radio className="h-4 w-4 text-white" />
              </div>

              {/* Tower label */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-card px-2 py-1 text-xs font-medium shadow-sm border border-border/50">
                <span>{tower.name}</span>
                {tower.status !== "offline" && (
                  <span className="ml-1 text-muted-foreground">({tower.strength}%)</span>
                )}
              </div>
            </div>
          ))}

          {/* Current location indicator */}
          <div 
            className="absolute z-20"
            style={{ left: '50%', top: '45%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative">
              <MapPin className="h-6 w-6 text-rose-500 fill-rose-500 drop-shadow-md" />
              <div className={`absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-rose-500 ${isSimulating ? 'animate-ping' : ''}`} />
            </div>
          </div>
        </div>

        {/* Tower Stats */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
          <div className="text-center">
            <p className="text-lg font-bold text-card-foreground">{towers.length}</p>
            <p className="text-xs text-muted-foreground">Total Towers</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-600">{onlineCount}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-amber-500">{warningCount}</p>
            <p className="text-xs text-muted-foreground">Warning</p>
          </div>
          {mode === "4G" && (
            <>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-rose-500">{offlineCount}</p>
                <p className="text-xs text-muted-foreground">Offline</p>
              </div>
            </>
          )}
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className={`text-lg font-bold ${avgCoverage >= 80 ? 'text-card-foreground' : avgCoverage >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
              {avgCoverage}%
            </p>
            <p className="text-xs text-muted-foreground">Coverage</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
