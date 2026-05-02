"use client"

import { Download, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  onExport: () => void
}

export function DashboardHeader({ onExport }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Network Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your 5G infrastructure in real-time
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
