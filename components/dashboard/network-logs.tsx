"use client"

import { useSimulation, type NetworkLog } from "@/lib/simulation-context"
import { 
  AlertTriangle, 
  ArrowDownUp, 
  Wifi, 
  WifiOff, 
  Activity,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function getLogIcon(type: NetworkLog["type"]) {
  switch (type) {
    case "signal_drop":
      return WifiOff
    case "handover":
      return ArrowDownUp
    case "congestion":
      return AlertTriangle
    case "recovery":
      return Wifi
    case "connection":
      return Activity
    default:
      return Activity
  }
}

function getLogColor(severity: NetworkLog["severity"]) {
  switch (severity) {
    case "error":
      return "text-rose-500 bg-rose-50"
    case "warning":
      return "text-amber-500 bg-amber-50"
    case "info":
      return "text-primary bg-primary/10"
    default:
      return "text-muted-foreground bg-muted"
  }
}

export function NetworkLogs() {
  const { logs, clearLogs } = useSimulation()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Network Logs
        </h3>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            title="Clear logs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">No network events yet</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => {
              const Icon = getLogIcon(log.type)
              const colorClasses = getLogColor(log.severity)
              
              return (
                <li
                  key={log.id}
                  className="group flex items-start gap-2.5 rounded-lg bg-sidebar-accent/50 p-2.5 transition-colors hover:bg-sidebar-accent"
                >
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                    colorClasses
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-sidebar-foreground leading-tight">
                      {log.message}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {formatTime(log.timestamp)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
