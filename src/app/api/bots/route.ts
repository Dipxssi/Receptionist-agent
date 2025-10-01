import { NextRequest, NextResponse } from 'next/server';
import { getBots, createBot, getBotById } from '@/lib/data-utils';
import { z } from 'zod';

// POST schema
const BotSchema = z.object({
  name: z.string().min(1),
  openmic_uid: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id'); // optional id query param

    if (id) {
      const bot = await getBotById(id);
      if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
      return NextResponse.json({ bot });
    }

    const bots = await getBots();
    return NextResponse.json({ bots });
  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const bot = await createBot(parsed.data);
    return NextResponse.json({ bot }, { status: 201 });
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 });
  }
}
