"use client"

import { useEffect, useState, useRef } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, PauseCircle } from "lucide-react"
import { useSimulation } from "@/lib/simulation-context"

interface DataPoint {
  time: string
  snr: number
  latency: number
}

export function SignalMonitor() {
  const { mode, config, isSimulating, addLog } = useSimulation()
  const [data, setData] = useState<DataPoint[]>([])
  const [counter, setCounter] = useState(0)
  const lastSnrRef = useRef(config.baseSnr)
  const lastLatencyRef = useRef(config.baseLatency)

  // Generate initial data when mode changes
  useEffect(() => {
    const initialData: DataPoint[] = []
    let snr = config.baseSnr
    let latency = config.baseLatency
    
    for (let i = 0; i < 20; i++) {
      // Smooth random walk for realistic fluctuations
      snr += (Math.random() - 0.5) * (config.snrVariance / 2)
      snr = Math.max(config.baseSnr - config.snrVariance, Math.min(config.baseSnr + config.snrVariance, snr))
      
      latency += (Math.random() - 0.5) * (config.latencyVariance / 2)
      latency = Math.max(config.baseLatency - config.latencyVariance/2, Math.min(config.baseLatency + config.latencyVariance, latency))
      
      initialData.push({
        time: `${i}s`,
        snr: Math.round(snr * 10) / 10,
        latency: Math.round(latency * 10) / 10,
      })
    }
    
    lastSnrRef.current = snr
    lastLatencyRef.current = latency
    setData(initialData)
    setCounter(20)
  }, [mode, config])

  // Real-time updates with realistic fluctuations
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setData((prevData) => {
        // Smooth random walk for SNR
        let newSnr = lastSnrRef.current + (Math.random() - 0.5) * (config.snrVariance / 3)
        
        // Occasional signal drops (more frequent in 4G)
        const dropChance = mode === "4G" ? 0.08 : 0.03
        if (Math.random() < dropChance) {
          newSnr -= config.snrVariance * 0.6
          addLog({
            type: "signal_drop",
            message: `Signal degradation detected: SNR dropped to ${Math.round(newSnr)}dB`,
            severity: "warning",
          })
        }
        
        // Recovery tendency
        if (newSnr < config.baseSnr - config.snrVariance/2) {
          newSnr += config.snrVariance * 0.2
          if (Math.random() < 0.3) {
            addLog({
              type: "recovery",
              message: "Signal strength recovering",
              severity: "info",
            })
          }
        }
        
        newSnr = Math.max(config.baseSnr - config.snrVariance, Math.min(config.baseSnr + config.snrVariance, newSnr))
        lastSnrRef.current = newSnr

        // Smooth random walk for latency
        let newLatency = lastLatencyRef.current + (Math.random() - 0.5) * (config.latencyVariance / 3)
        
        // Occasional latency spikes (congestion)
        const congestionChance = mode === "4G" ? 0.06 : 0.02
        if (Math.random() < congestionChance) {
          newLatency += config.latencyVariance * 0.8
          addLog({
            type: "congestion",
            message: `Network congestion: Latency spike to ${Math.round(newLatency)}ms`,
            severity: "warning",
          })
        }
        
        newLatency = Math.max(config.baseLatency - config.latencyVariance/2, Math.min(config.baseLatency + config.latencyVariance * 1.5, newLatency))
        lastLatencyRef.current = newLatency

        const newData = [...prevData.slice(1)]
        newData.push({
          time: `${counter}s`,
          snr: Math.round(newSnr * 10) / 10,
          latency: Math.round(newLatency * 10) / 10,
        })
        return newData
      })
      setCounter((c) => c + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [counter, config, mode, isSimulating, addLog])

  const currentSnr = data[data.length - 1]?.snr ?? config.baseSnr
  const currentLatency = data[data.length - 1]?.latency ?? config.baseLatency

  return (
    <Card className="overflow-hidden rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Live Signal Monitor</CardTitle>
            <p className="text-xs text-muted-foreground">
              {mode} Real-time SNR & Latency tracking
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Current Values */}
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
              <span className="font-medium text-primary">SNR:</span>
              <span className="font-bold text-primary">{currentSnr}dB</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1">
              <span className="font-medium text-accent-foreground">Lat:</span>
              <span className="font-bold text-accent-foreground">{currentLatency}ms</span>
            </div>
          </div>
          {/* Live/Paused Indicator */}
          {isSimulating ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-600">Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <PauseCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Paused</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="snrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.15 250)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.15 250)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.85 0.08 280)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.85 0.08 280)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="oklch(0.9 0.02 250)" 
                vertical={false}
              />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 11, fill: 'oklch(0.5 0.03 250)' }}
                axisLine={{ stroke: 'oklch(0.9 0.02 250)' }}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 11, fill: 'oklch(0.5 0.03 250)' }}
                axisLine={false}
                tickLine={false}
                domain={[
                  mode === "5G" ? 20 : 5,
                  mode === "5G" ? 40 : 35
                ]}
                label={{ value: 'SNR (dB)', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'oklch(0.5 0.03 250)' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 11, fill: 'oklch(0.5 0.03 250)' }}
                axisLine={false}
                tickLine={false}
                domain={[
                  0,
                  mode === "5G" ? 20 : 80
                ]}
                label={{ value: 'Latency (ms)', angle: 90, position: 'insideRight', fontSize: 11, fill: 'oklch(0.5 0.03 250)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid oklch(0.9 0.02 250)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                  padding: '12px 16px',
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 8 }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                iconType="circle"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="snr"
                name="SNR (dB)"
                stroke="oklch(0.55 0.15 250)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: 'oklch(0.55 0.15 250)', stroke: 'white', strokeWidth: 2 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="latency"
                name="Latency (ms)"
                stroke="oklch(0.75 0.12 280)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: 'oklch(0.75 0.12 280)', stroke: 'white', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
