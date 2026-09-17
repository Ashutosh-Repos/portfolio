'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/liquid/Container';
import { GLASS_OPTICS } from '@/lib/glass-config';
import {
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { StatBubble } from '@/components/ui/stat-bubble';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactMePage() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    _hp: '',
  });
  const email = 'clashutosh04@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailtoFallback = () => {
    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${formData.name || 'Visitor'}`,
    );
    const body = encodeURIComponent(
      `${formData.message}\n\nFrom: ${formData.name} (${formData.email})`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmittedName(formData.name.trim());
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          message: '',
          _hp: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(
          data.error || 'Unable to send message. Please try again or reach out directly.',
        );
      }
    } catch (err) {
      console.error('[contact-page] Submit error:', err);
      setStatus('error');
      setErrorMessage(
        'A network connection error occurred while sending. Please try again or use direct email.',
      );
    }
  };

  const channels = [
    {
      title: 'Email',
      value: email,
      action: copyEmail,
      actionLabel: copied ? 'Copied!' : 'Copy',
      icon: () => {
        return (
          <StatBubble
            image={{ src: '/gmail.svg', alt: 'Email' }}
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
          />
        );
      },
      href: `mailto:${email}`,
    },
    {
      title: 'Instagram',
      value: '@itz_ashutosh.222',
      href: 'https://www.instagram.com/itz_ashutosh.222/',
      icon: () => {
        return (
          <StatBubble
            image={{ src: '/insta.svg', alt: 'Instagram' }}
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
          />
        );
      },
    },
    {
      title: 'LinkedIn',
      value: 'ashutosh-kumar-2867182a2',
      href: 'https://www.linkedin.com/in/ashutosh-kumar-2867182a2/',
      icon: () => {
        return (
          <StatBubble
            image={{ src: '/linkedin.svg', alt: 'Linkedin' }}
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
          />
        );
      },
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between gap-6 pt-4 pb-16">
      <Link
        href="/"
        className="text-sm text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      {/* Grid: Direct Channels & Message Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4 w-full">
        {/* Direct Channels (2 cols) */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <h2 className="text-sm text-foreground/45">Social handles</h2>

          <div className="flex flex-col gap-2.5">
            {channels.map((ch) => (
              <div
                key={ch.title}
                className="p-4 rounded-2xl flex items-center justify-between gap-2"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs text-foreground/50">
                    <ch.icon />
                  </span>
                  <a
                    href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      ch.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="text-sm font-medium text-foreground hover:underline truncate max-w-45"
                  >
                    {ch.value}
                  </a>
                </div>

                {ch.action ? (
                  <button
                    type="button"
                    onClick={ch.action}
                    className="p-2 rounded-xl bg-foreground/6 hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all flex items-center gap-1 text-xs cursor-pointer"
                    title="Copy Email"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{ch.actionLabel}</span>
                  </button>
                ) : (
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-foreground/6 hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all"
                    title={`Open ${ch.title}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Form (3 cols) */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h2 className="text-sm text-foreground/45 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send a Direct Message</span>
          </h2>
          <Container {...GLASS_OPTICS}>
            {status === 'success' ? (
              <div className="p-8 rounded-[28px] flex flex-col items-center justify-center text-center gap-4 animate-in fade-in-50 zoom-in-95 duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-foreground">
                    Message Sent Directly!
                  </h3>
                  <p className="text-xs text-foreground/70 max-w-sm leading-relaxed">
                    Thank you{submittedName ? `, ${submittedName}` : ''}! Your
                    message was dispatched directly to Ashutosh&apos;s inbox.
                    You will receive a response shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setErrorMessage('');
                  }}
                  className="mt-2 py-2 px-4 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Send another message</span>
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 rounded-[28px] flex flex-col gap-4"
              >
                {/* Honeypot field for bot suppression */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData._hp}
                    onChange={(e) =>
                      setFormData({ ...formData, _hp: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-xs text-foreground/70"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    disabled={status === 'submitting'}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ada Lovelace"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-xs text-foreground/70"
                  >
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    autoComplete="email"
                    disabled={status === 'submitting'}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="ada@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-msg"
                    className="text-xs text-foreground/70"
                  >
                    Message / Proposal
                  </label>
                  <textarea
                    id="contact-msg"
                    name="message"
                    required
                    rows={4}
                    minLength={5}
                    maxLength={5000}
                    disabled={status === 'submitting'}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Hey Ashutosh, I loved your work and wanted to discuss..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none disabled:opacity-50"
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex flex-col gap-1.5 animate-in fade-in-50 duration-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleMailtoFallback}
                      className="text-xs font-semibold underline hover:opacity-80 text-left pl-6 cursor-pointer"
                    >
                      Open in Email Client instead &rarr;
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-1 w-full py-3 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60 text-xs font-semibold active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending directly...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </Container>
        </div>
      </div>
      <p className="text-xs text-foreground/40">
        Timezone: IST (UTC+5:30) &bull; Usually responds within 24 hours.
      </p>
    </div>
  );
}