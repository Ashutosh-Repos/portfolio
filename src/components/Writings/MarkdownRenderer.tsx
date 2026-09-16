'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './CodeBlock';
import { Highlighter } from '@/components/ui/highlighter';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Preprocesses markdown to convert highlight syntax into semantic <mark> tags:
 * - ==highlighted text== -> <mark data-action="highlight">highlighted text</mark>
 * - ==[action] text== -> <mark data-action="action">text</mark> (e.g. underline, circle, box, bracket)
 * - ==[action:color] text== -> <mark data-action="action" data-color="color">text</mark>
 * Ignores content inside code blocks and inline backticks.
 */
function preprocessMarkdownHighlights(content: string): string {
  if (!content) return '';
  const parts = content.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  return parts
    .map((part) => {
      if (part.startsWith('`')) return part;
      return part
        .replace(
          /(?<!=)==\[([a-z-]+)(?::([^\]]+))?\]\s*((?:(?!\n\n)[^=])+?)==/gi,
          (_, action, color, text) => {
            const colorAttr = color ? ` data-color="${color.trim()}"` : '';
            return `<mark data-action="${action.trim()}"${colorAttr}>${text.trim()}</mark>`;
          },
        )
        .replace(
          /(?<!=)==((?:(?!\n\n)[^=])+?)==/g,
          '<mark data-action="highlight">$1</mark>',
        );
    })
    .join('');
}

export const MarkdownRenderer = ({
  content,
  className,
}: MarkdownRendererProps) => {
  const processedContent = useMemo(
    () => preprocessMarkdownHighlights(content),
    [content],
  );

  return (
    <div
      className={cn(
        'markdown-body flex flex-col gap-5 text-foreground/85 leading-relaxed text-base',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Semantic rough-notation highlighter
          mark({ children, ...props }) {
            const anyProps = props as Record<string, any>;
            const action =
              anyProps['data-action'] || anyProps.action || 'highlight';
            const color = anyProps['data-color'] || anyProps.color;
            return (
              <Highlighter
                action={action}
                color={color}
                isView={false}
                multiline={true}
                className="font-medium text-foreground inline-block"
              >
                {children}
              </Highlighter>
            );
          },
          // Headings with clean anchor styling
          h1({ children }) {
            return (
              <h1 className="relative text-2xl sm:text-3xl font-bold tracking-tight text-foreground pt-4 pb-1">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            const id =
              typeof children === 'string'
                ? children
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
                : undefined;

            return (
              <h2
                id={id}
                className="relative group text-xl sm:text-2xl font-bold tracking-tight text-foreground pt-6 pb-2 border-b border-black/6 dark:border-white/6 flex items-baseline gap-2 scroll-mt-20"
              >
                <span>{children}</span>
                {id && (
                  <a
                    href={`#${id}`}
                    aria-label={`Link to ${children}`}
                    className="opacity-0 group-hover:opacity-40 hover:opacity-100! text-foreground text-sm font-mono transition-opacity"
                  >
                    #
                  </a>
                )}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="relative text-lg sm:text-xl font-semibold tracking-tight text-foreground pt-4 pb-1">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="relative text-base sm:text-lg font-semibold tracking-tight text-foreground pt-2">
                {children}
              </h4>
            );
          },

          // Paragraphs
          p({ children }) {
            return (
              <p className="relative leading-relaxed text-foreground/85 text-base sm:text-[17px]">
                {children}
              </p>
            );
          },

          // Strong / Bold
          strong({ children }) {
            return (
              <strong className="font-semibold text-foreground">
                {children}
              </strong>
            );
          },

          // Emphasis / Italic
          em({ children }) {
            return <em className="italic text-foreground/90">{children}</em>;
          },

          // Blockquotes matching Arpit Bhayani & liquid glass palette
          blockquote({ children }) {
            return (
              <blockquote className="relative my-4 border-l-2 border-emerald-500/70 pl-4 py-2 bg-emerald-500/4 rounded-r-xl italic text-foreground/90 text-base sm:text-[17px]">
                {children}
              </blockquote>
            );
          },

          // Lists
          ul({ children }) {
            return (
              <ul className="list-disc list-outside ml-6 space-y-2 text-foreground/85">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-outside ml-6 space-y-2 text-foreground/85">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return (
              <li className="relative leading-relaxed pl-1">{children}</li>
            );
          },

          // Links
          a({ href, children }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-foreground underline decoration-foreground/30 hover:decoration-foreground transition-colors font-medium underline-offset-4"
              >
                {children}
              </a>
            );
          },

          // Code blocks & inline code
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const rawContent = String(children).replace(/\n$/, '');

            if (match) {
              return <CodeBlock language={match[1]}>{rawContent}</CodeBlock>;
            }

            // Inline code
            return (
              <code
                className="px-1.5 py-0.5 rounded-md font-mono text-[13px] bg-foreground/[0.07] border border-black/5 dark:border-white/5 text-foreground/95"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Tables
          table({ children }) {
            return (
              <div className="overflow-x-auto my-6 rounded-2xl border border-black/8 dark:border-white/8 bg-foreground/2">
                <table className="w-full text-left text-sm font-mono divide-y divide-black/8 dark:divide-white/8">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-foreground/4 text-foreground font-semibold">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return (
              <tbody className="divide-y divide-black/4 dark:divide-white/4">
                {children}
              </tbody>
            );
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-foreground/2 transition-colors">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="relative px-4 py-3 text-xs uppercase tracking-wider font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="relative px-4 py-3 text-xs sm:text-sm text-foreground/80">
                {children}
              </td>
            );
          },

          // Horizontal rule
          hr() {
            return (
              <hr className="my-8 border-t border-black/10 dark:border-white/10" />
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
