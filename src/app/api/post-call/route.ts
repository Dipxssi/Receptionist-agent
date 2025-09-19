import { NextRequest, NextResponse } from 'next/server';
import { addCallLog } from '@/lib/data-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Post-call webhook received:', body);

    const { dynamic_variables, duration, transcript, status } = body;

    // Create call log object
    const callLog = {
      bot: {
        connect: { id: 'bot_001' } 
      },
      visitor: dynamic_variables?.visitor_name || 'Unknown Visitor',
      employee: dynamic_variables?.employee_visited || 'Unknown Employee', 
      department: dynamic_variables?.department || 'Unknown Department',
      arrivalTime: new Date(),
      duration: duration || 0,
      transcript: transcript || null,
      status: status || 'completed'
    };

    
    const savedLog = await addCallLog(callLog);

    console.log('Call log saved:', savedLog);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Call logged successfully',
      callLog: savedLog
    });

  } catch (error) {
    console.error('Error in post-call webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process post-call webhook' },
      { status: 500 }
    );
  }
}
