'use client';

import React, { useState } from 'react';
import { LinkPreview } from '../ui/link-preview';
import { AnimatePresence, motion } from 'framer-motion';
import { TechBubble } from './TechBubble';
import LiquidGlassAvatar from './LiquidGlassAvatar';

export const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-2 pb-4 flow-root">
      {/* Avatar floated right with circular shape-outside text wrapping */}
      <div
        className="float-right ml-4 mb-3 sm:ml-6 sm:mb-4 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full"
        style={{
          shapeOutside: 'circle(50%)',
          shapeMargin: '1.25rem',
        }}
      >
        <LiquidGlassAvatar
          firstImageSrc="/images/image5.jpeg"
          secondImageSrc="/images/image2.jpg"
          alt="Ashutosh"
          className="w-full h-full"
        />
      </div>

      {/* Name at top left */}
      <h1 className="text-xl md:text-2xl text-foreground mb-3 sm:mb-4">
        <span className="font-bold">Ashutosh</span>{' '}
        <span className="text-foreground/50 text-sm">aka</span>{' '}
        <span className="italic text-base font-light">Intel 8085</span>
      </h1>

      {/* Para 1: Bio & Social links — wraps organically around the circular avatar */}
      <div className="text-base text-foreground leading-normal mb-3 sm:mb-4">
        I&apos;m a software engineer at heart, tinkering with the reliability,
        scalability, and performance optimization of backend systems almost 90%
        of the time. I&apos;m mostly active on{' '}
        <LinkPreview
          url="https://x.com/ashutosh_0406"
          title="X / Twitter"
          dotGap={8}
          dotOffset={-1}
        >
          X/Twitter
        </LinkPreview>
        {', '}
        <LinkPreview
          url="https://www.linkedin.com/in/ashutosh-kumar-2867182a2/"
          title="LinkedIn"
          dotGap={8}
          dotOffset={-1}
        >
          LinkedIn
        </LinkPreview>
        {' and '}
        <LinkPreview
          url="https://github.com/Ashutosh-Repos"
          title="GitHub"
          dotGap={8}
          dotOffset={-1}
        >
          GitHub
        </LinkPreview>{' '}
        where I share everything.
      </div>

      {/* Para 2: Hobbies / Interests */}
      <div className="text-base text-foreground leading-normal mb-4">
        When I&apos;m not coding, I usually watch{' '}
        <LinkPreview
          url="/about/hobbies/movies"
          title="Movies"
          dotGap={8}
          dotOffset={-1}
        >
          movies
        </LinkPreview>{' '}
        and{' '}
        <LinkPreview
          url="/about/hobbies/webseries"
          title="Web Series"
          dotGap={8}
          dotOffset={-1}
        >
          web-series
        </LinkPreview>
        {', '}
        <LinkPreview
          url="https://www.chess.com/member/ashu0442"
          title="Chess.com"
          dotGap={8}
          dotOffset={-1}
        >
          play chess
        </LinkPreview>{' '}
        or plan my next solo{' '}
        <LinkPreview
          url="/about/hobbies/travel"
          title="Travel"
          dotGap={8}
          dotOffset={-1}
        >
          trip
        </LinkPreview>
        .
      </div>

      {/* Para 3 (Tessera) - expandable section */}
      <div className="clear-both flex flex-col gap-2 leading-normal mb-4">
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="text-base text-foreground pb-2">
                I&apos;ve been building an open-source video engine,{' '}
                <LinkPreview
                  url="https://github.com/Ashutosh-Repos/Tessera"
                  title="Tessera"
                  dotGap={8}
                  dotOffset={-1}
                >
                  Tessera
                </LinkPreview>
                . It&apos;s a self-hosted alternative to AWS Elemental and Mux
                that reduces enterprise transcoding bills. I regularly update
                this engine with tighter memory and latency optimizations,
                keeping infrastructure costs as low as possible.
              </div>
              <div className="text-base text-foreground leading-loose pt-1">
                I mostly work with{' '}
                <TechBubble icon="/go.svg" name="Go" url="https://go.dev" />,{' '}
                <TechBubble
                  icon="/typescript.svg"
                  name="TypeScript"
                  url="https://www.typescriptlang.org"
                />
                ,{' '}
                <TechBubble
                  icon="/node.svg"
                  name="Node.js"
                  url="https://nodejs.org"
                />
                ,{' '}
                <TechBubble
                  icon="/react.svg"
                  name="React"
                  url="https://react.dev"
                />
                ,{' '}
                <TechBubble
                  icon="/next.svg"
                  name="Next.js"
                  url="https://nextjs.org/"
                  invertDark
                />
                ,{' '}
                <TechBubble
                  icon="/postgres.svg"
                  name="PostgreSQL"
                  url="https://www.postgresql.org/"
                />
                , and{' '}
                <TechBubble
                  icon="/mongodb.svg"
                  name="MongoDB"
                  url="https://www.mongodb.com/"
                />
                . I&apos;m a continuous learner, currently learning{' '}
                <TechBubble
                  icon="/rust.svg"
                  name="Rust"
                  url="https://www.rust-lang.org"
                  invertDark
                />{' '}
                and looking for a career in the HFT/Fintech space.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-foreground/50 hover:text-foreground transition-colors cursor-pointer text-left bg-transparent p-0 border-none inline-block font-normal font-mono"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'collapse ...' : 'know more ...'}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center"
              >
                <LinkPreview
                  url="/about"
                  title="About Ashutosh"
                  dotted={true}
                  dotGap={8}
                  dotOffset={-1}
                  className="text-xs text-foreground/50 hover:text-foreground transition-colors cursor-pointer text-left font-normal font-mono inline-block"
                >
                  know more -&gt;
                </LinkPreview>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer tech stack with liquid sphere bubbles */}
    </div>
  );
};

export default About;
