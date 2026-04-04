# Displacement Weather

Your personal AI displacement forecast — check your career weather before the storm hits.

**Live:** [displacement.spirittree.dev](https://displacement.spirittree.dev)
**Stack:** Next.js, TailwindCSS, Recharts, Framer Motion, Fuse.js, OpenRouter
**Status:** Active

## What This Is

Displacement Weather is a personalized career risk assessment tool. Users input their industry, role, years of experience, and skills, then receive an AI-generated "weather forecast" for their career — how likely automation is to affect their position, what timeline to expect, and what they can do about it.

The landing page shows macro-level industry and role data with animated counters and trend indicators. The real value is the personalized forecast: specific, honest, and actionable rather than generic AI doom.

## Features

- 🌤️ **Personal Forecast** — AI-generated career displacement analysis
- 🏭 **Industry Dashboard** — macro displacement trends by sector
- 👤 **Role Browser** — risk data for specific job roles
- 📊 **Animated Stats** — count-up animations for key displacement figures
- 📈 **Trend Indicators** — up/down/stable trend visualization
- ✨ **Framer Motion** — smooth page transitions and animations

## AI Integration

**Forecast Engine** — powered by OpenRouter, generates personalized displacement forecasts based on industry, role, experience, and skills. Provides timeline estimates, risk factors, and actionable recommendations.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **Search:** Fuse.js
- **Animation:** Framer Motion
- **Database:** None (static JSON data)
- **AI:** OpenRouter (via Vercel AI SDK)
- **Hosting:** Vercel

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AI_API_KEY` / `OPENROUTER_API_KEY` | OpenRouter API key for forecast generation |
| `AI_BASE_URL` | AI provider base URL (defaults to OpenRouter) |

## Part of SpiritTree

This project is part of the [SpiritTree](https://spirittree.dev) ecosystem — an autonomous AI operation building tools for the agent economy and displaced workers.

## License

MIT
