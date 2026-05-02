"use client"

import { useState } from "react"
import { 
  Radio, 
  Server, 
  Shield, 
  Activity, 
  Map, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Wifi,
  ChevronRight,
  ScrollText
} from "lucide-react"
import { cn } from "@/lib/utils"
import { NetworkLogs } from "./network-logs"
import { SettingsPanel } from "./settings-panel"
import { useSimulation } from "@/lib/simulation-context"

interface NavItem {
  icon: React.ElementType
  label: string
  active?: boolean
}

const navItems: NavItem[] = [
  { icon: Activity, label: "Overview", active: true },
  { icon: Radio, label: "Signal Monitor" },
  { icon: Server, label: "MIMO Stats" },
  { icon: Map, label: "Coverage Map" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Shield, label: "Security" },
]

export function DashboardSidebar() {
  const [activePanel, setActivePanel] = useState<"logs" | "settings" | null>(null)
  const { mode, logs } = useSimulation()

  const togglePanel = (panel: "logs" | "settings") => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
          <Wifi className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">NetPulse</h1>
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "inline-flex h-1.5 w-1.5 rounded-full",
              mode === "5G" ? "bg-emerald-500" : "bg-amber-500"
            )} />
            <p className="text-xs text-muted-foreground">{mode} Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-2 shrink-0">
        <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Main Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  item.active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings & Logs Toggles */}
      <div className="px-4 py-3 shrink-0 border-t border-sidebar-border">
        <div className="space-y-1">
          <button
            onClick={() => togglePanel("settings")}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
              activePanel === "settings"
                ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              Settings
            </div>
            <ChevronRight 
              className={cn(
                "h-4 w-4 transition-transform",
                activePanel === "settings" && "rotate-90"
              )} 
            />
          </button>
          <button
            onClick={() => togglePanel("logs")}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
              activePanel === "logs"
                ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <div className="flex items-center gap-3">
              <ScrollText className="h-4 w-4" />
              Network Logs
            </div>
            <div className="flex items-center gap-2">
              {logs.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
                  {logs.length}
                </span>
              )}
              <ChevronRight 
                className={cn(
                  "h-4 w-4 transition-transform",
                  activePanel === "logs" && "rotate-90"
                )} 
              />
            </div>
          </button>
        </div>
      </div>

      {/* Expandable Panel */}
      {activePanel && (
        <div className="flex-1 overflow-hidden border-t border-sidebar-border">
          {activePanel === "settings" && <SettingsPanel />}
          {activePanel === "logs" && <NetworkLogs />}
        </div>
      )}

      {/* Help */}
      {!activePanel && (
        <div className="px-4 py-3 shrink-0">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200">
            <HelpCircle className="h-4 w-4" />
            Help Center
          </button>
        </div>
      )}

      {/* User Profile */}
      <div className="mt-auto border-t border-sidebar-border p-4 shrink-0">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 px-4 py-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-sm font-medium text-white">AK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Alex Kim</p>
            <p className="text-xs text-muted-foreground truncate">Network Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
