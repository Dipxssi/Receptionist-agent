import { NextRequest, NextResponse } from 'next/server';
import { findVisitorByPhone } from '@/lib/data-utils';
import { PreCallPayload } from '@/lib/types';


function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, ''); 
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming webhook payload from OpenMic
    const payload: PreCallPayload = await request.json();

    console.log('Pre-call webhook received:', payload);

    // Normalize phone number
    const phone = normalizePhone(payload.from_number);

    // Get visitor data based on the incoming phone number
    const expectedVisitor = await findVisitorByPhone(phone);

    // Prepare response data for the AI agent
    const responseData = {
      visitor_info: expectedVisitor
        ? {
            name: expectedVisitor.name ?? 'Unknown Visitor',
            appointment_time: expectedVisitor.appointment ?? null,
            expected_employee: expectedVisitor.expectedEmployee ?? 'Unknown',
            status: "expected"
          }
        : {
            name: "Unknown visitor",
            appointment_time: null,
            expected_employee: null,
            status: "unexpected"
          },
      greeting_context: expectedVisitor
        ? `${expectedVisitor.name ?? 'Visitor'} has a ${expectedVisitor.appointment ?? 'unknown'} appointment with ${expectedVisitor.expectedEmployee ?? 'Unknown'}`
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

    // Always return structured JSON to prevent OpenMic retries
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

// Healthcheck endpoint
export async function GET() {
  return NextResponse.json({
    message: "Pre-call webhook endpoint is active",
    method: "POST required"
  });
}
