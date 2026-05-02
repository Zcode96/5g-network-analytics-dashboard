"use client"

import { Download, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimulation } from "@/lib/simulation-context"

interface DashboardHeaderProps {
  onExport: () => void
}

export function DashboardHeader({ onExport }: DashboardHeaderProps) {
  const { mode, isSimulating } = useSimulation()

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Network Dashboard</h1>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            mode === "5G" 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-amber-100 text-amber-700"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${
              mode === "5G" ? "bg-emerald-500" : "bg-amber-500"
            } ${isSimulating ? "animate-pulse" : ""}`} />
            {mode}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor your {mode} infrastructure in real-time
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search metrics..."
            className="h-10 w-64 rounded-xl border border-border bg-card pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            3
          </span>
        </button>

        {/* Export Button */}
        <Button
          onClick={onExport}
          className="rounded-xl bg-gradient-to-r from-primary to-accent px-3 sm:px-5 shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
        >
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Download Report</span>
        </Button>
      </div>
    </header>
  )
}
