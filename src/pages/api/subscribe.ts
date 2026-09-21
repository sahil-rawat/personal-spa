import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false; // Must run dynamically on request

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const { email, turnstileToken } = data;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email address required.' }), {
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

    // Access env vars via Cloudflare runtime context or import.meta.env
    const env = (locals as any)?.runtime?.env || process.env;
    const TURNSTILE_SECRET_KEY = env.TURNSTILE_SECRET_KEY;
    const RESEND_API_KEY = env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = env.RESEND_AUDIENCE_ID;

    // 1. Verify Cloudflare Turnstile token
    const clientIp = request.headers.get('CF-Connecting-IP') || '';
    const turnstileFormData = new FormData();
    turnstileFormData.append('secret', TURNSTILE_SECRET_KEY);
    turnstileFormData.append('response', turnstileToken);
    if (clientIp) turnstileFormData.append('remoteip', clientIp);

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileFormData,
    });
    const turnstileOutcome = await turnstileRes.json();

    if (!turnstileOutcome.success) {
      return new Response(JSON.stringify({ error: 'Bot challenge failed. Please refresh and try again.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Add Contact to Resend Audience
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
    });

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
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};