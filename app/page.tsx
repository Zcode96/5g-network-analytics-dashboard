"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { HealthCards } from "@/components/dashboard/health-cards"
import { SignalMonitor } from "@/components/dashboard/signal-monitor"
import { MimoStats } from "@/components/dashboard/mimo-stats"
import { CoverageMap } from "@/components/dashboard/coverage-map"
import { Menu, X } from "lucide-react"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleExport = () => {
    // Create a simple network report
    const reportData = {
      generatedAt: new Date().toISOString(),
      networkStatus: "Healthy",
      metrics: {
        bandwidth: "2.4 Gbps",
        connectedDevices: 1847,
        packetLoss: "0.02%",
        activeProtocol: "5G NR",
        averageSNR: "32 dB",
        averageLatency: "11 ms",
        mimoEfficiency: "85%",
        towersCoverage: "87%"
      }
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `network-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-lg lg:hidden"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64">
        <div className="p-4 pt-16 sm:p-6 lg:p-8 lg:pt-8">
          {/* Header */}
          <DashboardHeader onExport={handleExport} />

          {/* Health Cards */}
          <section className="mt-6 lg:mt-8">
            <HealthCards />
          </section>

          {/* Charts Grid */}
          <section className="mt-6 grid gap-6 lg:mt-8 xl:grid-cols-2">
            <SignalMonitor />
            <MimoStats />
          </section>

          {/* Coverage Map */}
          <section className="mt-6 lg:mt-8">
            <CoverageMap />
          </section>

          {/* Footer */}
          <footer className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:mt-12">
            <p>&copy; 2024 NetPulse Analytics. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Last sync: Just now</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>System operational</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
