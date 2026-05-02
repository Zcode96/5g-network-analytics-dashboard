"use client"

import { Wifi, Smartphone, AlertTriangle, Radio } from "lucide-react"

interface HealthCard {
  title: string
  value: string
  subtitle: string
  icon: React.ElementType
  trend?: {
    value: string
    positive: boolean
  }
}

const healthData: HealthCard[] = [
  {
    title: "Current Bandwidth",
    value: "2.4 Gbps",
    subtitle: "Peak: 3.2 Gbps",
    icon: Wifi,
    trend: { value: "+12%", positive: true }
  },
  {
    title: "Connected Devices",
    value: "1,847",
    subtitle: "Active sessions",
    icon: Smartphone,
    trend: { value: "+23", positive: true }
  },
  {
    title: "Packet Loss",
    value: "0.02%",
    subtitle: "Within threshold",
    icon: AlertTriangle,
    trend: { value: "-0.01%", positive: true }
  },
  {
    title: "Active Protocol",
    value: "5G NR",
    subtitle: "Band n78 (3.5GHz)",
    icon: Radio,
  },
]

export function HealthCards() {
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
              <p className="mt-2 text-2xl font-bold text-card-foreground">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
              <card.icon className="h-5 w-5 text-primary" />
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
              <span className="text-xs text-muted-foreground">vs last hour</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
