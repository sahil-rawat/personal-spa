import { Resend } from 'resend';

interface Env {
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body: any = await request.json();
    const { email, turnstileToken } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'Turnstile verification token missing.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Verify Cloudflare Turnstile token
    const clientIp = request.headers.get('CF-Connecting-IP') || '';
    const turnstileFormData = new FormData();
    turnstileFormData.append('secret', env.TURNSTILE_SECRET_KEY);
    turnstileFormData.append('response', turnstileToken);
    if (clientIp) turnstileFormData.append('remoteip', clientIp);

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileFormData,
    });
    const turnstileOutcome: any = await turnstileRes.json();

    if (!turnstileOutcome.success) {
      return new Response(JSON.stringify({ error: 'Bot challenge failed. Please retry.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Add Contact to Resend
    const resend = new Resend(env.RESEND_API_KEY);
    const contactPayload: any = {
      email,
      unsubscribed: false,
    };
    if (env.RESEND_AUDIENCE_ID) {
      contactPayload.audienceId = env.RESEND_AUDIENCE_ID;
    }

    const { error } = await resend.contacts.create(contactPayload);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Subscribed successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};