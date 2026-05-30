import { streamText } from 'ai';
import { defaultModel } from '@/lib/ai-provider';
import industries from '@/data/industries.json';
import roles from '@/data/roles.json';

export const runtime = 'nodejs';

// --- Lightweight in-memory rate limiter (per-IP) ---
// Guards the open AI endpoint against cost-runaway abuse. This is a single-instance
// best-effort limiter; for multi-region scale, back it with Redis/Upstash later.
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5; // per IP per window
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

// Opportunistically evict stale buckets so the Map can't grow unbounded.
function evictStale() {
  if (hits.size < 5000) return;
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key);
  }
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Pull the app's own structured data for the closest matching industry/role so
// the forecast is grounded in the dataset rather than only the model's priors.
function buildGrounding(industryInput: string, roleInput: string): string {
  const lines: string[] = [];

  const ind = industries.find(
    (i) => norm(i.name) === norm(industryInput) || norm(i.id) === norm(industryInput)
  );

  if (ind) {
    lines.push(
      `Industry data — ${ind.name}: displacement risk score ${ind.riskScore}/10, trend "${ind.trend}", ~${ind.jobsAtRisk.toLocaleString()} jobs at risk. Key AI tools: ${ind.keyAITools.join(', ')}. Established reskilling paths: ${ind.reskillingSuggestions.slice(0, 3).join('; ')}.`
    );
  }

  const r = roles.find((x) => {
    const t = norm(x.title);
    const q = norm(roleInput);
    return t === q || t.includes(q) || q.includes(t);
  });

  if (r) {
    lines.push(
      `Role data — ${r.title}: risk score ${r.riskScore}/10, status "${r.status}", replacement timeline ${r.replacementTimeline}, median salary $${r.medianSalary.toLocaleString()}. Tools displacing this role: ${r.aiTools.join(', ')}.`
    );
  }

  if (lines.length === 0) return '';

  return `\n\nGround your forecast in this verified data from our displacement index. Reference these specific figures where relevant, but stay in the weather-forecast voice:\n${lines.join('\n')}`;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  evictStale();
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many forecasts. Please wait a moment and try again.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(limit.retryAfter),
        },
      }
    );
  }

  const { industry, role, yearsExperience, skills } = await req.json();

  if (!industry || !role) {
    return new Response(JSON.stringify({ error: 'Industry and role are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const grounding = buildGrounding(String(industry), String(role));

  const result = streamText({
    model: defaultModel,
    maxOutputTokens: 1500,
    system: `You are The Forecaster for Displacement Weather — a personal AI displacement weather service. Generate a personal "weather forecast" for AI displacement based on the user's specific role and industry.

Your forecast must include:
1. **☁️ Current Conditions** — What's happening RIGHT NOW in their field regarding AI displacement. Be specific about tools, companies, and trends.
2. **🌤️ 6-Month Outlook** — Near-term forecast. What changes are approaching?
3. **⛈️ 18-Month Outlook** — Longer-range forecast. What's on the horizon?
4. **🛡️ Storm Preparedness** — Exactly 3 specific, actionable steps they should take NOW. Not generic advice — tailored to their role, experience level, and skills.

Rules:
- Use weather metaphors throughout (partly cloudy, storm approaching, clear skies, high pressure systems, cold fronts, barometric drops, etc.)
- Be honest about risks but constructive about preparation
- Base your analysis on real industry trends, not generic advice
- Consider their years of experience and skills when assessing vulnerability
- Format with clear markdown headings
- Keep it concise and punchy — this is a forecast, not an essay`,
    prompt: `Generate a displacement weather forecast for:
- **Industry:** ${industry}
- **Role:** ${role}
- **Years of Experience:** ${yearsExperience || 'Not specified'}
- **Key Skills:** ${skills?.length ? skills.join(', ') : 'Not specified'}${grounding}`,
  });

  return result.toTextStreamResponse();
}
