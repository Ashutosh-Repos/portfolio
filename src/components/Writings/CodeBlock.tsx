'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  children: string;
}

export const CodeBlock = ({ language, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failures
    }
  };

  const displayLanguage = language || 'text';

  return (
    <div className="relative my-6 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-[#0d1117] text-[#c9d1d9] shadow-sm">
      {/* Top bar with language badge and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/[0.08] text-xs font-mono select-none">
        <span className="text-foreground/50 lowercase tracking-wider font-semibold">
          {displayLanguage}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-foreground/50 hover:text-foreground hover:bg-white/[0.08] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed selection:bg-emerald-500/30">
        <code>{children}</code>
      </pre>
    </div>
  );
};
