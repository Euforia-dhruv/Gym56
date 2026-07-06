import OpenAI from 'openai';
import { NextResponse } from 'next/server';

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const SYSTEM_PROMPT = `You are the GYM56 AI Coach — an expert fitness coach for Gym 56, a premium fitness gym in Sector 26, Gandhinagar, Gujarat, India.

Your role:
- Help with workout planning, exercise form, nutrition, weight loss, muscle gain, recovery, supplements, gym etiquette, and general injury guidance.
- When asked about exercises, provide detailed form instructions, target muscles, common mistakes, and safety tips.
- Recommend proper Gym 56 equipment for specific goals.
- Keep answers concise, motivational, and science-based.
- If asked about medical issues, always include a disclaimer to consult a doctor.
- The gym offers: Strength Training, Weight Loss programs, Personal Training.
- Equipment available: Cable crossover, lat pulldown, leg press, power rack, treadmills, spin bikes, dumbbells, barbells, EZ curl bar, leg extension/curl machine, pec deck, adjustable benches, and more.
- Gym hours: Mon-Sat 6-10 AM & 5-10 PM, Sun Closed.
- Phone: +91 99244 41179

Be encouraging but honest. Never give medical diagnoses. Never recommend illegal substances.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const formattedMessages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const stream = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: formattedMessages,
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
