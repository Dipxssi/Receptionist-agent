import { NextRequest, NextResponse } from 'next/server';
import { addCallLog } from '@/lib/data-utils';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log('Post-call webhook received:', payload);
    
    // Extract call information
    const callLog = {
      id: uuidv4(),
      botId: 'bot_1', // Default bot for now
      visitor: payload.dynamic_variables?.visitor_name || 'Unknown Visitor',
      employee: payload.dynamic_variables?.employee_visited || 'Unknown Employee',
      department: payload.dynamic_variables?.department || 'Unknown Department',
      arrivalTime: new Date(),
      duration: payload.duration || 0,
      transcript: payload.transcript || '',
      status: payload.status || 'completed'
    };
    
    // Save to database
    const savedLog = await addCallLog(callLog);
    
    console.log('Call log saved:', savedLog);
    
    return NextResponse.json({
      success: true,
      message: 'Call log processed successfully',
      data: {
        call_id: payload.call_id,
        log_id: savedLog.id,
        visitor: callLog.visitor,
        employee: callLog.employee,
        duration: callLog.duration
      }
    });
    
  } catch (error) {
    console.error('Post-call webhook error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process post-call webhook'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Post-call webhook endpoint is active",
    method: "POST required" 
  });
}
