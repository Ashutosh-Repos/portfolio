import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/mail';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: 'Invalid request payload. Expected JSON format.' },
        { status: 400 },
      );
    }

    const { name, email, message, _hp } = body || {};

    // 1. Honeypot check: If the hidden honeypot field is filled, silently ignore spam
    if (_hp && typeof _hp === 'string' && _hp.trim().length > 0) {
      console.warn('[api/contact] Honeypot triggered, ignoring spam submission');
      return NextResponse.json(
        { success: true, message: 'Message sent successfully.' },
        { status: 200 },
      );
    }

    // 2. Field validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide your name.' },
        { status: 400 },
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name cannot exceed 100 characters.' },
        { status: 400 },
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a message of at least 5 characters.' },
        { status: 400 },
      );
    }

    if (message.trim().length > 5000) {
      return NextResponse.json(
        { error: 'Message cannot exceed 5000 characters.' },
        { status: 400 },
      );
    }

    // 3. Dispatch email
    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('[api/contact] Error sending message:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to send message. Please try again or reach out directly.';

    // Check if error is due to missing configuration
    const isConfigMissing =
      errorMessage.includes('EMAIL_USER') ||
      errorMessage.includes('Email service is not configured');

    return NextResponse.json(
      {
        error: isConfigMissing
          ? 'Email dispatch service is currently being configured. Please use the direct email link or copy the email address below.'
          : errorMessage,
        isConfigMissing,
      },
      { status: 500 },
    );
  }
}
