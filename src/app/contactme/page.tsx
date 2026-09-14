'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/liquid/Container';
import { GLASS_OPTICS } from '@/lib/glass-config';
import {
  Mail,
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
  Send,
} from 'lucide-react';
import Image from 'next/image';
import { StatBubble } from '@/components/ui/stat-bubble';

export default function ContactMePage() {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const email = 'clashutosh04@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-fill a mailto link as seamless zero-backend contact action
    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${formData.name || 'Visitor'}`,
    );
    const body = encodeURIComponent(
      `${formData.message}\n\nFrom: ${formData.name} (${formData.email})`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
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
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 "
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
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 "
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
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 "
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
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
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-[28px] flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-name"
                  className="text-xs text-foreground/70"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ada Lovelace"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
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
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="ada@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
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
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Hey Ashutosh, I loved your write-up on Bloom Filters and wanted to discuss..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-1 w-full py-3 px-4 rounded-xl bg-foreground/20 text-background hover:bg-foreground/25 text-xs font-semibold active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>

              {formSubmitted && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center pt-1">
                  ✓ Opening your email client to dispatch the message. Thank
                  you!
                </p>
              )}
            </form>
          </Container>
        </div>
      </div>
      <p className="text-xs text-foreground/40">
        Timezone: IST (UTC+5:30) &bull; Usually responds within 24 hours.
      </p>
    </div>
  );
}
