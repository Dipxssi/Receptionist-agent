import { NextRequest, NextResponse } from 'next/server';
import { findEmployeeByName } from '@/lib/data-utils';

// Define response data structure
type ResponseData = {
  success?: boolean;
  error?: string;
  data?: Record<string, unknown>;
  message?: string;
  method?: string;
  timestamp?: string;
};

function createResponse(data: ResponseData, status = 200) {
  const response = NextResponse.json(data, { status });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  return response;
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 5000
): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log('Function call received:', payload);
    
    // Extract and validate employee name
    const employeeName = payload.arguments?.employee_name?.trim();
    
    if (!employeeName) {
      return createResponse({
        success: false,
        error: 'No employee name provided'
      }, 400);
    }
    
    // Search database with timeout
    const employee = await withTimeout(
      findEmployeeByName(employeeName),
      5000
    );
    
    if (employee) {
      return createResponse({
        success: true,
        data: {
          employee_found: true,
          name: employee.name,
          department: employee.department,
          location: `${employee.floor} floor, room ${employee.room}`,
          status: employee.status,
          directions: `Take the elevator to the ${employee.floor} floor, then look for room ${employee.room}`,
          message: `${employee.name} is in ${employee.department} department on the ${employee.floor} floor, room ${employee.room}. Current status: ${employee.status}`
        }
      });
    } else {
      return createResponse({
        success: true,
        data: {
          employee_found: false,
          suggested_action: "contact_reception",
          message: `I couldn't find ${employeeName} in our directory. Let me connect you with our main reception for assistance.`
        }
      });
    }
    
  } catch (error) {
    console.error('Function call error:', error);
  
    const isTimeout = error instanceof Error && error.message === 'Operation timed out';
    
    return createResponse({
      success: false,
      error: isTimeout ? 'Request timeout' : 'Database error in function call',
      data: {
        employee_found: false,
        message: isTimeout 
          ? "The system is taking too long to respond. Please try again or contact reception."
          : "System error - please contact reception directly"
      }
    }, 500);
  }
}

export async function GET() {
  return createResponse({ 
    message: "Function call webhook endpoint is active",
    method: "POST required",
    timestamp: new Date().toISOString()
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}