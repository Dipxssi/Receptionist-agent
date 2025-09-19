import { NextResponse } from 'next/server';

export async function GET() {
  const testPayload = {
    call_id: "test_call_123",
    from_number: "+1234567890",
    to_number: "+1555123456",
    direction: "inbound" as const
  };
  
  try {
    const response = await fetch(`http://localhost:3000/api/pre-call`, {
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
