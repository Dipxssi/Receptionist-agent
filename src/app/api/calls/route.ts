import { NextRequest, NextResponse } from 'next/server';
import { getCallLogs } from '@/lib/data-utils';

export async function GET(request: NextRequest) {
  try {
    // Optional query params: limit, page, botId
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const botId = url.searchParams.get('botId') ?? undefined;

    const callLogs = await getCallLogs({ limit, page, botId });

    return NextResponse.json({ success: true, data: callLogs });
  } catch (error) {
    console.error('Error fetching call logs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch call logs' }, { status: 500 });
  }
}
