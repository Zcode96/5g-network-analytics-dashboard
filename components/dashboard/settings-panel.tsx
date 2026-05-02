"use client"

import { useSimulation, type NetworkMode } from "@/lib/simulation-context"
import { Radio, Zap, PlayCircle, PauseCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function SettingsPanel() {
  const { mode, setMode, isSimulating, setIsSimulating } = useSimulation()

  const modes: { value: NetworkMode; label: string; description: string }[] = [
    { value: "5G", label: "5G NR", description: "Ultra-fast, low latency" },
    { value: "4G", label: "4G LTE", description: "Standard mobile network" },
  ]

  return (
    <div className="p-3 space-y-4">
      {/* Simulation Toggle */}
      <div className="rounded-xl bg-sidebar-accent/50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSimulating ? (
              <Zap className="h-4 w-4 text-emerald-500" />
            ) : (
              <Radio className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-xs font-medium text-sidebar-foreground">
              Simulation Mode
            </span>
          </div>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
              isSimulating
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {isSimulating ? (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                </span>
                Active
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                Paused
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {isSimulating 
            ? "Metrics are fluctuating with realistic variations" 
            : "Simulation paused - metrics are static"}
        </p>
      </div>

      {/* Network Mode Selector */}
      <div>
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Network Mode
        </p>
        <div className="space-y-2">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all",
                mode === m.value
                  ? "bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 shadow-sm"
                  : "bg-sidebar-accent/50 hover:bg-sidebar-accent border border-transparent"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  mode === m.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Radio className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    mode === m.value ? "text-primary" : "text-sidebar-foreground"
                  )}
                >
                  {m.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{m.description}</p>
              </div>
              {mode === m.value && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <svg
                    className="h-3 w-3 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats for Current Mode */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
          {mode} Specifications
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-card/80 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">Max Speed</p>
            <p className="text-sm font-bold text-foreground">
              {mode === "5G" ? "2.4 Gbps" : "150 Mbps"}
            </p>
          </div>
          <div className="rounded-lg bg-card/80 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">Latency</p>
            <p className="text-sm font-bold text-foreground">
              {mode === "5G" ? "~8ms" : "~35ms"}
            </p>
          </div>
          <div className="rounded-lg bg-card/80 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">MIMO</p>
            <p className="text-sm font-bold text-foreground">
              {mode === "5G" ? "4×4" : "2×2"}
            </p>
          </div>
          <div className="rounded-lg bg-card/80 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">Capacity</p>
            <p className="text-sm font-bold text-foreground">
              {mode === "5G" ? "2000+" : "~500"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
