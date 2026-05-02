"use client"

import { useState } from "react"
import { SimulationProvider, useSimulation } from "@/lib/simulation-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { HealthCards } from "@/components/dashboard/health-cards"
import { SignalMonitor } from "@/components/dashboard/signal-monitor"
import { MimoStats } from "@/components/dashboard/mimo-stats"
import { CoverageMap } from "@/components/dashboard/coverage-map"
import { Menu, X } from "lucide-react"

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { mode, config, logs } = useSimulation()

  const handleExport = () => {
    // Create a comprehensive network report with current simulation data
    const reportData = {
      generatedAt: new Date().toISOString(),
      networkMode: mode,
      networkStatus: "Healthy",
      metrics: {
        bandwidth: mode === "5G" ? "2.4 Gbps" : "150 Mbps",
        connectedDevices: Math.floor(config.maxDevices * 0.9),
        packetLoss: `${config.packetLossBase}%`,
        activeProtocol: mode === "5G" ? "5G NR" : "4G LTE",
        averageSNR: `${config.baseSnr} dB`,
        averageLatency: `${config.baseLatency} ms`,
        mimoStreams: config.mimoStreams,
        mimoEfficiency: mode === "5G" ? "85%" : "68%",
        towersCoverage: "87%"
      },
      recentLogs: logs.slice(0, 10).map(log => ({
        timestamp: log.timestamp.toISOString(),
        type: log.type,
        message: log.message,
        severity: log.severity,
      })),
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `network-report-${mode}-${new Date().toISOString().split('T')[0]}.json`
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
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">
                {mode} Mode
              </span>
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

export default function Dashboard() {
  return (
    <SimulationProvider>
      <DashboardContent />
    </SimulationProvider>
  )
}
