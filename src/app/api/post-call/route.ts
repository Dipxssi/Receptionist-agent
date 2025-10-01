import { NextRequest, NextResponse } from 'next/server';
import { addCallLog } from '@/lib/data-utils';
import { Prisma, CallLog as PrismaCallLog } from '@prisma/client';
import { z } from 'zod';

const PostCallSchema = z.object({
  call_id: z.string().min(1, "Call ID is required"),
  bot_id: z.string().min(1, "Bot ID is required"),
  duration: z.number().min(0).optional(),
  transcript: z.string().nullable().optional(),
  status: z.enum(['completed', 'failed', 'no-answer', 'busy']).default('completed'),
  timestamp: z.string().optional(),
  dynamic_variables: z.object({
    visitor_name: z.string().optional(),
    employee_visited: z.string().optional(),
    department: z.string().optional()
  }).optional()
});

type ResponseData = {
  success?: boolean;
  message?: string;
  callLog?: PrismaCallLog; 
  error?: string;
  details?: Array<{ field: string; message: string }> | string;
  method?: string;
  timestamp?: string;
};

// Helper for response
function createResponse(data: ResponseData, status = 200) {
  const response = NextResponse.json(data, { status });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  return response;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    console.log('Post-call webhook received:', {
      call_id: body.call_id,
      bot_id: body.bot_id,
      timestamp: new Date().toISOString()
    });

    const validatedData = PostCallSchema.parse(body);
    const { call_id, bot_id, duration, transcript, status, timestamp, dynamic_variables } = validatedData;

    // FIXED: Use CallLogUncheckedCreateInput instead of CallLogCreateInput
    const callLog: Prisma.CallLogUncheckedCreateInput = {
      callId: call_id,
      botId: bot_id, // Direct foreign key reference instead of connect
      visitor: dynamic_variables?.visitor_name || 'Unknown Visitor',
      employee: dynamic_variables?.employee_visited || 'Unknown Employee',
      department: dynamic_variables?.department || 'Unknown Department',
      arrivalTime: timestamp ? new Date(timestamp) : new Date(),
      duration: duration ?? 0, 
      transcript: transcript ?? null,
      status
    };

    const savedLog = await addCallLog(callLog);

    console.log('Call log saved successfully:', {
      id: savedLog.id,
      call_id: savedLog.callId,
      processingTime: `${Date.now() - startTime}ms`
    });
    
    return createResponse({ 
      success: true, 
      message: 'Call logged successfully',
      callLog: savedLog
    });

  } catch (error) {
    console.error('Error in post-call webhook:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      processingTime: `${Date.now() - startTime}ms`
    });

    if (error instanceof z.ZodError) {
      return createResponse(
        { 
          success: false,
          error: 'Invalid request payload',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        400
      );
    }

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return createResponse(
        { 
          success: false,
          error: 'Call log with this ID already exists'
        },
        409
      );
    }

    const errorResponse: ResponseData = {
      success: false,
      error: 'Failed to process post-call webhook'
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = error instanceof Error ? error.message : 'Unknown error';
    }

    return createResponse(errorResponse, 500);
  }
}
