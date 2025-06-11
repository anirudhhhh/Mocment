import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Here you would typically:
    // 1. Validate the input
    // 2. Send an email notification
    // 3. Store the suggestion in your database
    // For now, we'll just simulate a successful submission

    // TODO: Implement actual email sending and database storage
    console.log('Received suggestion:', { name, email, message });

    return NextResponse.json({ 
      success: true, 
      message: 'Suggestion received successfully' 
    });
  } catch (error) {
    console.error('Error processing suggestion:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process suggestion' },
      { status: 500 }
    );
  }
} 