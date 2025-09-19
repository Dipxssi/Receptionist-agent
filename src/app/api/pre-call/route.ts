import { NextRequest, NextResponse } from 'next/server';
import { findVisitorByPhone } from '@/lib/data-utils';
import { PreCallPayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming webhook payload from OpenMic
    const payload: PreCallPayload = await request.json();
    
    console.log('Pre-call webhook received:', payload);
    
    // Get visitor data based on the incoming phone number
    const expectedVisitor = await findVisitorByPhone(payload.from_number);
    
    // Prepare response data for the AI agent
    const responseData = {
      visitor_info: expectedVisitor ? {
        name: expectedVisitor.name,
        appointment_time: expectedVisitor.appointment,
        expected_employee: expectedVisitor.expectedEmployee,
        status: "expected"
      } : {
        name: "Unknown visitor",
        appointment_time: null,
        expected_employee: null,
        status: "unexpected"
      },
      greeting_context: expectedVisitor 
        ? `${expectedVisitor.name} has a ${expectedVisitor.appointment} appointment with ${expectedVisitor.expectedEmployee}`
        : "Unexpected visitor - please ask for details",
      call_metadata: {
        call_id: payload.call_id,
        direction: payload.direction,
        timestamp: new Date().toISOString()
      }
    };
    
    // Return data that OpenMic will use to personalize the conversation
    return NextResponse.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('Pre-call webhook error:', error);
    
    // Always return success to prevent OpenMic retries on our bugs
    return NextResponse.json({
      success: false,
      error: 'Failed to process pre-call webhook',
      data: {
        visitor_info: {
          name: "Unknown visitor",
          status: "error"
        },
        greeting_context: "System error - please proceed with standard greeting"
      }
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ 
    message: "Pre-call webhook endpoint is active",
    method: "POST required" 
  });
}
