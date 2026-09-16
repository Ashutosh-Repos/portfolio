'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/liquid/Container';
import {
  Home,
  User,
  Briefcase,
  Mail,
  NotebookPenIcon,
  NotebookPen,
  PencilSparkles,
} from 'lucide-react';
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About Me', href: '/about', icon: User },
  { label: 'My Works', href: '/myworks', icon: Briefcase },
  { label: 'Writings', href: '/writings', icon: PencilSparkles },
  { label: 'Contact me', href: '/contactme', icon: Mail },
] as const;

export const Navbar = () => {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  return (
    <header
      ref={headerRef}
      className="sticky top-4 z-50 w-full flex justify-center px-3 sm:px-4 pointer-events-none"
    >
      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Sticky Primary Navbar Pill */}
        <Container
          className="pointer-events-auto w-full px-6 py-2.5 rounded-[32px] transition-all duration-300 flex items-center justify-between"
          contentClassName="flex flex-row items-center justify-between w-full gap-2 sm:gap-4 flex-nowrap min-w-0"
          radius={32}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          optics={{
            strength: 0.18,
            curvature: 1.0,
            bend: 0.85,
            bendWidth: 0.22,
            dispersion: 0,
            specular: 1.2,
            frost: 1.4,
          }}
        >
          {/* Navigation Links */}
          <nav className="flex items-center gap-2.5 sm:gap-1.5 w-full relative">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Container
                    className={`relative px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full transition-colors duration-200 whitespace-nowrap flex items-center justify-center ${
                      isActive
                        ? 'text-neutral-900 dark:text-white font-semibold bg-black/10 dark:bg-white/10'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                    optics={{
                      strength: 0.5,
                      curvature: 2.0,
                      bendWidth: 0.3,
                      bend: 1.8,
                      dispersion: 1.0,
                      specular: 2.0,
                      frost: 0,
                    }}
                  >
                    <Icon className="sm:hidden shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline text-base">
                      {item.label}
                    </span>
                  </Container>
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="gap-2 sm:gap-2.5 shrink-0 flex items-center justify-between">
            <span className="h-5 border-l"></span>
            <Container
              className="pointer-events-auto w-max  hover:bg-black/10 hover:dark:bg-white/10 rounded-full transition-all duration-300"
              contentClassName="flex flex-row items-center justify-center w-full min-w-0"
              radius={32}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              optics={{
                strength: 0.18,
                curvature: 1.0,
                bend: 0.85,
                bendWidth: 0.22,
                dispersion: 0,
                specular: 1.2,
                frost: 1.4,
              }}
            >
              <AnimatedThemeToggler
                className="px-2.5 py-1.5 sm:p-2 rounded-full text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-all active:scale-90 focus:outline-none flex items-center justify-center cursor-pointer"
                lightIconClassName="w-6 h-6 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.5)] transition-transform hover:rotate-45"
                darkIconClassName="w-6 h-6 text-indigo-600 transition-transform hover:-rotate-12"
              />
            </Container>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Navbar;
