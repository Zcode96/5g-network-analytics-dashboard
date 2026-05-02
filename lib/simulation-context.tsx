"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type NetworkMode = "5G" | "4G"

export interface NetworkLog {
  id: string
  timestamp: Date
  type: "signal_drop" | "handover" | "congestion" | "recovery" | "connection"
  message: string
  severity: "info" | "warning" | "error"
}

interface NetworkConfig {
  mode: NetworkMode
  // 5G parameters
  "5G": {
    baseSnr: number
    snrVariance: number
    baseLatency: number
    latencyVariance: number
    bandwidth: number
    maxDevices: number
    packetLossBase: number
    mimoStreams: number
  }
  // 4G parameters
  "4G": {
    baseSnr: number
    snrVariance: number
    baseLatency: number
    latencyVariance: number
    bandwidth: number
    maxDevices: number
    packetLossBase: number
    mimoStreams: number
  }
}

const networkConfig: NetworkConfig = {
  mode: "5G",
  "5G": {
    baseSnr: 30,
    snrVariance: 8,
    baseLatency: 8,
    latencyVariance: 4,
    bandwidth: 2.4,
    maxDevices: 2000,
    packetLossBase: 0.02,
    mimoStreams: 4,
  },
  "4G": {
    baseSnr: 18,
    snrVariance: 12,
    baseLatency: 35,
    latencyVariance: 20,
    bandwidth: 0.15,
    maxDevices: 500,
    packetLossBase: 0.15,
    mimoStreams: 2,
  },
}

interface SimulationContextType {
  mode: NetworkMode
  setMode: (mode: NetworkMode) => void
  logs: NetworkLog[]
  addLog: (log: Omit<NetworkLog, "id" | "timestamp">) => void
  clearLogs: () => void
  config: NetworkConfig["5G"] | NetworkConfig["4G"]
  isSimulating: boolean
  setIsSimulating: (value: boolean) => void
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<NetworkMode>("5G")
  const [logs, setLogs] = useState<NetworkLog[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 120000),
      type: "connection",
      message: "Network initialized successfully",
      severity: "info",
    },
    {
      id: "2", 
      timestamp: new Date(Date.now() - 90000),
      type: "handover",
      message: "Handover to Cell Tower #3 completed",
      severity: "info",
    },
  ])
  const [isSimulating, setIsSimulating] = useState(true)

  const addLog = useCallback((log: Omit<NetworkLog, "id" | "timestamp">) => {
    const newLog: NetworkLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
    }
    setLogs((prev) => [newLog, ...prev].slice(0, 50)) // Keep only last 50 logs
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const setMode = useCallback((newMode: NetworkMode) => {
    setModeState(newMode)
    // Add log for mode switch
    setLogs((prev) => [{
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      type: "handover",
      message: `Switched to ${newMode} network mode`,
      severity: "info",
    }, ...prev].slice(0, 50))
  }, [])

  const config = networkConfig[mode]

  return (
    <SimulationContext.Provider
      value={{
        mode,
        setMode,
        logs,
        addLog,
        clearLogs,
        config,
        isSimulating,
        setIsSimulating,
      }}
    >
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider")
  }
  return context
}
