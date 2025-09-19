import { NextRequest, NextResponse } from 'next/server';
import { updateBot, deleteBot } from '@/lib/data-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const bot = await updateBot(id, body);
    return NextResponse.json({ bot });
  } catch (error) {
    console.error('Error updating bot:', error);
    return NextResponse.json({ error: 'Failed to update bot' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteBot(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json({ error: 'Failed to delete bot' }, { status: 500 });
  }
}
