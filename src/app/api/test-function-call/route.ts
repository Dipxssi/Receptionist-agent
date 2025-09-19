import { NextResponse } from 'next/server';

export async function GET() {
  const testPayload = {
    call_id: "test_function_123",
    function_name: "find_employee",
    arguments: {
      employee_name: "Sarah Johnson"
    }
  };
  
  try {
    const response = await fetch(`http://localhost:3000/api/function-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    const result = await response.json();
    
    return NextResponse.json({
      test_payload: testPayload,
      webhook_response: result,
      status: response.status
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error
    });
  }
}
