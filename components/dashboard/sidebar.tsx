"use client"

import { 
  Radio, 
  Server, 
  Shield, 
  Activity, 
  Map, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Wifi
} from "lucide-react"
import { cn } from "@/lib/utils"

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

const bottomItems: NavItem[] = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help Center" },
]

export function DashboardSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
            <Wifi className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">NetPulse</h1>
            <p className="text-xs text-muted-foreground">5G Analytics</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Main Menu
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    item.active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border px-4 py-4">
          <ul className="space-y-1">
            {bottomItems.map((item) => (
              <li key={item.label}>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-4">
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
      </div>
    </aside>
  )
}
