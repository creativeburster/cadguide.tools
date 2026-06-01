import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listId = process.env.BREVO_LIST_ID;

    if (!apiKey) {
      console.error('BREVO_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 500 }
      );
    }

    // Use Brevo's standard POST /v3/contacts endpoint (single opt-in, no confirmation email)
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        // Add to the configured list(s)
        listIds: listId ? [parseInt(listId, 10)] : undefined,
        updateEnabled: true, // Update if contact already exists
      }),
    });

    if (response.status === 201) {
      // New contact created
      return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
    }

    if (response.status === 204) {
      // Contact already exists and was updated
      return NextResponse.json({ success: true, message: 'You are already subscribed!' });
    }

    // Handle duplicate_parameter error (contact already exists)
    const data = await response.json().catch(() => ({}));
    if (data.code === 'duplicate_parameter') {
      return NextResponse.json({ success: true, message: 'You are already subscribed!' });
    }

    console.error('Brevo API error:', response.status, data);
    return NextResponse.json(
      { error: 'Subscription failed. Please try again.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
