# 5g-network-analytics-dashboard
**Settings Panel** - Toggle simulation on/off and switch between 4G and 5G modes. Shows mode-specific specs (speed, latency, MIMO configuration, capacity).
**Network Logs** - A timestamped log panel in the sidebar that records signal drops, handovers, congestion events, and recovery notifications. Logs automatically clear after 50 entries.
**4G/5G Mode Toggle** - Switching modes adapts the entire UI:

- Signal Monitor: Different base SNR/latency values and axis ranges (5G: 30dB/8ms, 4G: 18dB/35ms)
- Health Cards: Bandwidth adjusts (2.4Gbps vs 150Mbps), device capacity changes
- MIMO Stats: 4x4 streams for 5G, 2x2 for 4G with different efficiency levels
- Coverage Map: 5G shows stronger signals with fewer warnings; 4G shows degraded signals and may have offline towers



**Realistic Fluctuations** - All metrics fluctuate with smooth random walks. Signal drops and latency spikes occur randomly (more frequently in 4G mode) and are logged with timestamps


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/Zcode96/5g-network-analytics-dashboard" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
