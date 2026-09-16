import React from 'react';
import LinkPreview from '@/components/ui/link-preview';
import { MorphingText } from '../ui/morphing-text';

export default function Footer() {
  return (
    <footer className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center py-8 px-4 pb-24 border-t border-black/8 dark:border-white/10 select-none">
      {/* Signature in Alex Brush */}

      {/* <span
        className="text-4xl sm:text-5xl text-neutral-800 dark:text-neutral-100 tracking-wide inline-block drop-shadow-sm transition-transform duration-300 hover:scale-105 cursor-default select-none"
        style={{ fontFamily: 'var(--font-alex-brush), cursive' }}
      >
        Ashutosh
      </span> */}
      <MorphingText
        texts={['Ashutosh', 'Ram']}
        className="text-4xl sm:text-5xl font-semibold sm:font-bold text-neutral-800 dark:text-neutral-100 tracking-wide inline-block drop-shadow-sm transition-transform duration-300 hover:scale-105 cursor-default select-none h-12 sm:h-14"
        style={{ fontFamily: 'var(--font-alex-brush), cursive' }}
      />

      {/* Inspirations line */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2 max-w-lg">
        Website heavily inspired by{' '}
        <LinkPreview
          url="https://designerdada.com"
          dotted={true}
          dotGap={6}
          dotSize={2}
          className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Akash Bhadange
        </LinkPreview>
        {', '}
        <LinkPreview
          url="https://manuarora.in"
          dotted={true}
          dotGap={6}
          dotSize={2}
          className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Manu Arora
        </LinkPreview>
        {' & '}
        <LinkPreview
          url="https://arpitbhayani.me"
          dotted={true}
          dotGap={6}
          dotSize={2}
          className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Arpit Bhayani
        </LinkPreview>
      </div>

      {/* Discreet copyright subtext */}
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-6 tracking-tight">
        © {new Date().getFullYear()} Ashutosh Ram.
      </p>
    </footer>
  );
}
