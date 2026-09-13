'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/liquid/Container';
import { GLASS_OPTICS } from '@/lib/glass-config';
import { Mail, Check, Copy, ExternalLink, MessageSquare, Send } from 'lucide-react';

export default function ContactMePage() {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const email = 'ashutoshkumar8352@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-fill a mailto link as seamless zero-backend contact action
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name || 'Visitor'}`);
    const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name} (${formData.email})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
  };

  const channels = [
    {
      title: 'Email',
      value: email,
      action: copyEmail,
      actionLabel: copied ? 'Copied!' : 'Copy',
      icon: Mail,
      href: `mailto:${email}`,
    },
    {
      title: 'GitHub',
      value: 'Ashutosh-Repos',
      href: 'https://github.com/Ashutosh-Repos',
      icon: ExternalLink,
    },
    {
      title: 'LinkedIn',
      value: 'ashutosh-kumar-0406',
      href: 'https://www.linkedin.com/in/ashutosh-kumar-0406/',
      icon: ExternalLink,
    },
    {
      title: 'LeetCode',
      value: 'ashutosh0406',
      href: 'https://leetcode.com/u/ashutosh0406/',
      icon: ExternalLink,
    },
    {
      title: 'Chess.com',
      value: 'ashu0442',
      href: 'https://www.chess.com/member/ashu0442',
      icon: ExternalLink,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4 pb-16">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      {/* Hero Header */}
      <Container
        className="p-6 sm:p-8 rounded-[32px] bg-[#d5ede6]/25 dark:bg-[#1a3832]/25 transition-all duration-300 w-full"
        radius={36}
        optics={GLASS_OPTICS}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Let&apos;s Build Together
            </h1>
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for Opportunities
            </span>
          </div>

          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            Whether you are discussing distributed systems, low-latency architectures, AI applications, or looking to collaborate on high-impact software, my inbox is always open.
          </p>
        </div>
      </Container>

      {/* Grid: Direct Channels & Message Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Direct Channels (2 cols) */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/45">
            Direct Reach
          </h2>

          <div className="flex flex-col gap-2.5">
            {channels.map((ch) => (
              <div
                key={ch.title}
                className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.02] flex items-center justify-between gap-2"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-foreground/50">
                    {ch.title}
                  </span>
                  <a
                    href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined}
                    rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm font-medium text-foreground hover:underline truncate max-w-[180px]"
                  >
                    {ch.value}
                  </a>
                </div>

                {ch.action ? (
                  <button
                    type="button"
                    onClick={ch.action}
                    className="p-2 rounded-xl bg-foreground/[0.06] hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all flex items-center gap-1 text-xs font-mono cursor-pointer"
                    title="Copy Email"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{ch.actionLabel}</span>
                  </button>
                ) : (
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-foreground/[0.06] hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all"
                    title={`Open ${ch.title}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl border border-black/[0.04] dark:border-white/[0.04] bg-black/[0.01] dark:bg-white/[0.01] text-xs font-mono text-foreground/60 leading-relaxed">
            <strong className="text-foreground">Timezone:</strong> IST (UTC+5:30) &bull; Usually responds within 24 hours.
          </div>
        </div>

        {/* Message Form (3 cols) */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/45 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send a Direct Message</span>
          </h2>

          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-[28px] border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.02] flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-xs font-mono text-foreground/70">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ada Lovelace"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 font-sans"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-xs font-mono text-foreground/70">
                Your Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ada@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 font-sans"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-msg" className="text-xs font-mono text-foreground/70">
                Message / Proposal
              </label>
              <textarea
                id="contact-msg"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Hey Ashutosh, I loved your write-up on Bloom Filters and wanted to discuss..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 font-sans resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full py-3 px-4 rounded-xl bg-foreground text-background font-mono text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>

            {formSubmitted && (
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 text-center pt-1">
                ✓ Opening your email client to dispatch the message. Thank you!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
