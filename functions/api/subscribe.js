// Cloudflare Pages Function: POST /api/subscribe
//
// The Next.js route handler at src/app/api/subscribe/route.ts cannot run in
// production because the site is deployed as a static export (output: 'export')
// — this Function is its production counterpart and must stay behaviourally in
// sync with it.
//
// Requires BREVO_API_KEY (and optionally BREVO_LIST_ID) to be set in the
// Cloudflare Pages project environment variables.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  let email;
  try {
    const body = await request.json();
    email = body.email;
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Email is required' }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return Response.json({ error: 'Invalid email format' }, { status: 400 });
  }

  const apiKey = env.BREVO_API_KEY;
  const listId = env.BREVO_LIST_ID;

  if (!apiKey) {
    console.error('BREVO_API_KEY is not configured');
    return Response.json(
      { error: 'Newsletter service is not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        // JSON.stringify drops the key entirely when listId is unset
        listIds: listId ? [parseInt(listId, 10)] : undefined,
        updateEnabled: true, // Update if contact already exists
      }),
    });

    if (response.status === 201) {
      return Response.json({ success: true, message: 'Subscribed successfully!' });
    }

    if (response.status === 204) {
      return Response.json({ success: true, message: 'You are already subscribed!' });
    }

    // Brevo signals an existing contact as duplicate_parameter
    const data = await response.json().catch(() => ({}));
    if (data.code === 'duplicate_parameter') {
      return Response.json({ success: true, message: 'You are already subscribed!' });
    }

    console.error('Brevo API error:', response.status, data);
    return Response.json(
      { error: 'Subscription failed. Please try again.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Subscribe API error:', error);
    return Response.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
