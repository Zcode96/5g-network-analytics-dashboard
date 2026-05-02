"use client"

import { useEffect, useState } from "react"
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
import { Activity } from "lucide-react"

interface DataPoint {
  time: string
  snr: number
  latency: number
}

function generateInitialData(): DataPoint[] {
  const data: DataPoint[] = []
  for (let i = 0; i < 20; i++) {
    data.push({
      time: `${i}s`,
      snr: 25 + Math.random() * 10,
      latency: 8 + Math.random() * 6,
    })
  }
  return data
}

export function SignalMonitor() {
  const [data, setData] = useState<DataPoint[]>(generateInitialData())
  const [counter, setCounter] = useState(20)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)]
        newData.push({
          time: `${counter}s`,
          snr: 25 + Math.random() * 10,
          latency: 8 + Math.random() * 6,
        })
        return newData
      })
      setCounter((c) => c + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [counter])

  return (
    <Card className="overflow-hidden rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Live Signal Monitor</CardTitle>
            <p className="text-xs text-muted-foreground">Real-time SNR & Latency tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-600">Live</span>
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
                label={{ value: 'SNR (dB)', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'oklch(0.5 0.03 250)' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 11, fill: 'oklch(0.5 0.03 250)' }}
                axisLine={false}
                tickLine={false}
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
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
