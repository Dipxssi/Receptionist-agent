import { NextResponse } from 'next/server';
import { getCallLogs } from '@/lib/data-utils';

export async function GET() {
  try {
    const callLogs = await getCallLogs();
    return NextResponse.json({ callLogs });
  } catch (error) {
    console.error('Error fetching call logs:', error);
    return NextResponse.json({ error: 'Failed to fetch call logs' }, { status: 500 });
  }
}
