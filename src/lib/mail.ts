import nodemailer from 'nodemailer';

export interface SendContactEmailParams {
  name: string;
  email: string;
  message: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getMailTransporter() {
  const user = process.env.EMAIL_USER || process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  // Custom SMTP server configuration
  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: { user, pass },
    });
  }

  // Default Gmail service configuration
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export async function sendContactEmail({ name, email, message }: SendContactEmailParams) {
  const transporter = getMailTransporter();
  const receiverEmail =
    process.env.CONTACT_RECEIVER_EMAIL ||
    process.env.EMAIL_USER ||
    process.env.GMAIL_USER ||
    'clashutosh04@gmail.com';

  if (!transporter) {
    throw new Error(
      'Email service is not configured. Please set EMAIL_USER and EMAIL_PASS (or Gmail App Password) in your environment variables.',
    );
  }

  const senderUser =
    process.env.EMAIL_USER || process.env.GMAIL_USER || process.env.SMTP_USER || receiverEmail;

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br />');
  const submissionDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const subject = `Portfolio Inquiry from ${name.trim()}`;

  const textContent = `New Contact Form Submission on Portfolio

From: ${name.trim()} (${email.trim()})
Date: ${submissionDate} IST

Message:
${message.trim()}

---
You can reply directly to this email to respond to ${name.trim()}.`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background-color: #18181b; padding: 24px 32px; color: #ffffff;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em;">New Portfolio Inquiry</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #a1a1aa;">Received via portfolio contact form</p>
    </div>

    <!-- Content Body -->
    <div style="padding: 32px;">
      <!-- Sender Metadata Box -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 10px;">
        <tr>
          <td style="padding: 12px 16px; font-size: 13px; color: #71717a; width: 80px; font-weight: 500;">Sender:</td>
          <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #18181b;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; font-size: 13px; color: #71717a; border-top: 1px solid #f4f4f5; font-weight: 500;">Email:</td>
          <td style="padding: 12px 16px; font-size: 14px; border-top: 1px solid #f4f4f5;">
            <a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${safeEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; font-size: 13px; color: #71717a; border-top: 1px solid #f4f4f5; font-weight: 500;">Received:</td>
          <td style="padding: 12px 16px; font-size: 13px; color: #52525b; border-top: 1px solid #f4f4f5;">${submissionDate} (IST)</td>
        </tr>
      </table>

      <!-- Message Section -->
      <div style="margin-bottom: 28px;">
        <h2 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; margin: 0 0 10px 0;">Message Content</h2>
        <div style="padding: 20px; background-color: #fcfcfc; border: 1px solid #e4e4e7; border-radius: 10px; font-size: 14px; line-height: 1.65; color: #27272a; white-space: pre-wrap; font-family: inherit;">
${safeMessage}
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${safeEmail}?subject=Re:%20Portfolio%20Inquiry" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 8px;">
          Reply to ${safeName} &rarr;
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 32px; background-color: #f4f4f5; border-top: 1px solid #e4e4e7; font-size: 12px; color: #a1a1aa; text-align: center;">
      Delivered directly to ${escapeHtml(receiverEmail)} from portfolio contact form.
    </div>

  </div>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: `"${name.trim()} via Portfolio" <${senderUser}>`,
    to: receiverEmail,
    replyTo: email.trim(),
    subject,
    text: textContent,
    html: htmlContent,
  });

  return {
    success: true,
    messageId: info.messageId,
  };
}
