import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="markdown-body flex flex-col gap-5 text-foreground/85 leading-relaxed text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings with clean anchor styling
          h1({ children }) {
            return (
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground pt-4 pb-1">
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
                className="group text-xl sm:text-2xl font-bold tracking-tight text-foreground pt-6 pb-2 border-b border-black/[0.06] dark:border-white/[0.06] flex items-baseline gap-2 scroll-mt-20"
              >
                <span>{children}</span>
                {id && (
                  <a
                    href={`#${id}`}
                    aria-label={`Link to ${children}`}
                    className="opacity-0 group-hover:opacity-40 hover:!opacity-100 text-foreground text-sm font-mono transition-opacity"
                  >
                    #
                  </a>
                )}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground pt-4 pb-1">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-base sm:text-lg font-semibold tracking-tight text-foreground pt-2">
                {children}
              </h4>
            );
          },

          // Paragraphs
          p({ children }) {
            return (
              <p className="leading-relaxed text-foreground/85 text-base sm:text-[17px]">
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
              <blockquote className="my-4 border-l-2 border-emerald-500/70 pl-4 py-2 bg-emerald-500/[0.04] rounded-r-xl italic text-foreground/90 text-base sm:text-[17px]">
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
            return <li className="leading-relaxed pl-1">{children}</li>;
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
              <div className="overflow-x-auto my-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-foreground/[0.02]">
                <table className="w-full text-left text-sm font-mono divide-y divide-black/[0.08] dark:divide-white/[0.08]">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-foreground/[0.04] text-foreground font-semibold">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return (
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {children}
              </tbody>
            );
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-foreground/[0.02] transition-colors">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-3 text-xs uppercase tracking-wider font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-3 text-xs sm:text-sm text-foreground/80">
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
        {content}
      </ReactMarkdown>
    </div>
  );
};
