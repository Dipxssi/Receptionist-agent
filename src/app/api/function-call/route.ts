import { NextRequest, NextResponse } from 'next/server';
import { findEmployeeByName } from '@/lib/data-utils';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log('Function call received:', payload);
    
   
    const employeeName = payload.arguments?.employee_name;
    
    if (!employeeName) {
      return NextResponse.json({
        success: false,
        error: 'No employee name provided'
      });
    }
    
    // Search database for employee
    const employee = await findEmployeeByName(employeeName);
    
    if (employee) {
      return NextResponse.json({
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
      return NextResponse.json({
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
    return NextResponse.json({
      success: false,
      error: 'Database error in function call',
      data: {
        employee_found: false,
        message: "System error - please contact reception directly"
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Function call webhook endpoint is active",
    method: "POST required" 
  });
}
