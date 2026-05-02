"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server } from "lucide-react"

const mimoData = [
  { name: "Stream 1", value: 94, fill: "oklch(0.55 0.15 250)" },
  { name: "Stream 2", value: 88, fill: "oklch(0.65 0.12 280)" },
  { name: "Stream 3", value: 82, fill: "oklch(0.7 0.08 220)" },
  { name: "Stream 4", value: 76, fill: "oklch(0.75 0.1 260)" },
]

const totalEfficiency = Math.round(
  mimoData.reduce((acc, curr) => acc + curr.value, 0) / mimoData.length
)

export function MimoStats() {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">MIMO Stream Efficiency</CardTitle>
            <p className="text-xs text-muted-foreground">4x4 Spatial Multiplexing</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6 lg:flex-row">
          {/* Donut Chart */}
          <div className="relative h-56 w-56 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mimoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {mimoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid oklch(0.9 0.02 250)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                    padding: '12px 16px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Efficiency']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-card-foreground">{totalEfficiency}%</span>
              <span className="text-xs text-muted-foreground">Avg Efficiency</span>
            </div>
          </div>

          {/* Stream Details */}
          <div className="flex-1 space-y-3 w-full">
            {mimoData.map((stream, index) => (
              <div key={stream.name} className="flex items-center gap-3">
                <div 
                  className="h-3 w-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: stream.fill }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-card-foreground">{stream.name}</span>
                    <span className="text-sm font-semibold text-card-foreground">{stream.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stream.value}%`,
                        backgroundColor: stream.fill,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-muted/50 p-4">
          <div>
            <p className="text-xs text-muted-foreground">Channel Rank</p>
            <p className="text-lg font-semibold text-card-foreground">4 / 4</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Beamforming</p>
            <p className="text-lg font-semibold text-emerald-600">Active</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
