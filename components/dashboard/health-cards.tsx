"use client"

import { useEffect, useState } from "react"
import { Wifi, Smartphone, AlertTriangle, Radio } from "lucide-react"
import { useSimulation } from "@/lib/simulation-context"

interface HealthMetrics {
  bandwidth: number
  devices: number
  packetLoss: number
}

export function HealthCards() {
  const { mode, config, isSimulating, addLog } = useSimulation()
  const [metrics, setMetrics] = useState<HealthMetrics>({
    bandwidth: config.bandwidth,
    devices: Math.floor(config.maxDevices * 0.9),
    packetLoss: config.packetLossBase,
  })
  const [trends, setTrends] = useState({
    bandwidth: { value: "+12%", positive: true },
    devices: { value: "+23", positive: true },
    packetLoss: { value: "-0.01%", positive: true },
  })

  // Reset metrics when mode changes
  useEffect(() => {
    setMetrics({
      bandwidth: config.bandwidth,
      devices: Math.floor(config.maxDevices * 0.9),
      packetLoss: config.packetLossBase,
    })
  }, [mode, config])

  // Simulate fluctuating metrics
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setMetrics((prev) => {
        // Bandwidth fluctuation (±15%)
        const bandwidthDelta = (Math.random() - 0.5) * config.bandwidth * 0.15
        let newBandwidth = prev.bandwidth + bandwidthDelta
        newBandwidth = Math.max(config.bandwidth * 0.7, Math.min(config.bandwidth * 1.2, newBandwidth))

        // Device count fluctuation
        const deviceDelta = Math.floor((Math.random() - 0.5) * 50)
        let newDevices = prev.devices + deviceDelta
        newDevices = Math.max(Math.floor(config.maxDevices * 0.7), Math.min(config.maxDevices, newDevices))

        // Packet loss fluctuation
        const packetLossDelta = (Math.random() - 0.5) * config.packetLossBase * 0.5
        let newPacketLoss = prev.packetLoss + packetLossDelta
        
        // Occasional packet loss spike
        if (Math.random() < 0.05) {
          newPacketLoss = config.packetLossBase * 3
          addLog({
            type: "congestion",
            message: `Packet loss spike detected: ${(newPacketLoss).toFixed(2)}%`,
            severity: "warning",
          })
        }
        
        newPacketLoss = Math.max(0.01, Math.min(config.packetLossBase * 5, newPacketLoss))

        // Update trends
        setTrends({
          bandwidth: {
            value: bandwidthDelta > 0 ? `+${Math.abs(bandwidthDelta * 100 / config.bandwidth).toFixed(0)}%` : `-${Math.abs(bandwidthDelta * 100 / config.bandwidth).toFixed(0)}%`,
            positive: bandwidthDelta > 0,
          },
          devices: {
            value: deviceDelta > 0 ? `+${deviceDelta}` : `${deviceDelta}`,
            positive: deviceDelta > 0,
          },
          packetLoss: {
            value: packetLossDelta < 0 ? `-${Math.abs(packetLossDelta).toFixed(2)}%` : `+${packetLossDelta.toFixed(2)}%`,
            positive: packetLossDelta < 0,
          },
        })

        return {
          bandwidth: newBandwidth,
          devices: newDevices,
          packetLoss: newPacketLoss,
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [config, isSimulating, addLog])

  const formatBandwidth = (bw: number) => {
    if (bw >= 1) return `${bw.toFixed(1)} Gbps`
    return `${(bw * 1000).toFixed(0)} Mbps`
  }

  const healthData = [
    {
      title: "Current Bandwidth",
      value: formatBandwidth(metrics.bandwidth),
      subtitle: `Peak: ${formatBandwidth(config.bandwidth * 1.3)}`,
      icon: Wifi,
      trend: trends.bandwidth,
    },
    {
      title: "Connected Devices",
      value: metrics.devices.toLocaleString(),
      subtitle: "Active sessions",
      icon: Smartphone,
      trend: trends.devices,
    },
    {
      title: "Packet Loss",
      value: `${metrics.packetLoss.toFixed(2)}%`,
      subtitle: metrics.packetLoss < config.packetLossBase * 2 ? "Within threshold" : "Above threshold",
      icon: AlertTriangle,
      trend: trends.packetLoss,
      warning: metrics.packetLoss >= config.packetLossBase * 2,
    },
    {
      title: "Active Protocol",
      value: mode === "5G" ? "5G NR" : "4G LTE",
      subtitle: mode === "5G" ? "Band n78 (3.5GHz)" : "Band 3 (1800MHz)",
      icon: Radio,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {healthData.map((card, index) => (
        <div
          key={card.title}
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,255,0.95) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Decorative gradient */}
          <div 
            className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 transition-opacity group-hover:opacity-50"
            style={{
              background: index % 2 === 0 
                ? 'linear-gradient(135deg, oklch(0.55 0.15 250) 0%, oklch(0.75 0.1 260) 100%)'
                : 'linear-gradient(135deg, oklch(0.85 0.08 280) 0%, oklch(0.65 0.12 280) 100%)'
            }}
          />
          
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <p className={`mt-2 text-2xl font-bold ${card.warning ? 'text-amber-600' : 'text-card-foreground'}`}>
                {card.value}
              </p>
              <p className={`mt-1 text-xs ${card.warning ? 'text-amber-500' : 'text-muted-foreground'}`}>
                {card.subtitle}
              </p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              card.warning 
                ? 'bg-amber-100' 
                : 'bg-gradient-to-br from-primary/10 to-accent/10'
            }`}>
              <card.icon className={`h-5 w-5 ${card.warning ? 'text-amber-600' : 'text-primary'}`} />
            </div>
          </div>

          {card.trend && (
            <div className="relative mt-4 flex items-center gap-1">
              <span 
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  card.trend.positive 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {card.trend.value}
              </span>
              <span className="text-xs text-muted-foreground">vs last update</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
