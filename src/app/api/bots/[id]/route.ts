// app/api/bots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBots, createBot } from '@/lib/data-utils';

export async function GET() {
  try {
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
    const { name, openmic_uid } = body;

    if (!name) {
      return NextResponse.json({ error: 'Bot name is required' }, { status: 400 });
    }

    const bot = await createBot({ name, openmic_uid });
    return NextResponse.json({ bot }, { status: 201 });
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 });
  }
}
