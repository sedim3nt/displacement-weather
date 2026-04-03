import { streamText } from 'ai';
import { defaultModel } from '@/lib/ai-provider';

export async function POST(req: Request) {
  const { industry, role, yearsExperience, skills } = await req.json();

  if (!industry || !role) {
    return new Response(JSON.stringify({ error: 'Industry and role are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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
- **Key Skills:** ${skills?.length ? skills.join(', ') : 'Not specified'}`,
  });

  return result.toTextStreamResponse();
}
