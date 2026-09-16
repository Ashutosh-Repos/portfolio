'use client';

import React, { useState } from 'react';
import { FileText, Eye, Download } from 'lucide-react';
import { Container } from '@/components/liquid/Container';
import { ResumeModal } from './ResumeModal';
import { cn } from '@/lib/utils';

export interface ResumeViewerProps {
  className?: string;
  pdfUrl?: string;
  filename?: string;
}

interface BubbleButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  ringColor: string;
  onClick?: () => void;
  href?: string;
  download?: string;
}

const BubbleItem: React.FC<BubbleButtonProps> = ({
  icon: Icon,
  label,
  color,
  ringColor,
  onClick,
  href,
  download,
}) => {
  const content = (
    <Container
      radius={9999}
      interactive={true}
      elasticity={0.35}
      activationZone={50}
      optics={{
        strength: 0.28,
        curvature: 1.6,
        bend: 1.15,
        bendWidth: 0.22,
        specular: 1.4,
        specularAngle: 45,
        frost: 0.6,
      }}
      overlayClassName="border-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_5px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.35)]"
      className="w-7.5 h-7.5 sm:w-8 sm:h-8 aspect-square rounded-full inline-flex items-center justify-center p-0 shrink-0 select-none cursor-pointer"
      contentClassName="relative flex items-center justify-center w-full h-full p-1.5"
      aria-label={label}
    >
      {/* Coloured droplet core */}
      <span className={cn('absolute inset-0 rounded-full z-0', color)} />

      {/* 3D Convex Sphere Glint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full z-1 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.15)_35%,transparent_65%)] dark:bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.08)_35%,transparent_65%)]"
      />

      {/* Icon */}
      <Icon className="relative z-10 w-4 h-4 text-black dark:text-zinc-950 stroke-[2.2] pointer-events-none drop-shadow-sm" />
    </Container>
  );

  const sharedClasses = cn(
    'relative inline-flex items-center justify-center rounded-full',
    'transition-transform duration-200 hover:scale-110 active:scale-95',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    ringColor,
  );

  if (href) {
    return (
      <a
        href={href}
        download={download}
        title={label}
        aria-label={label}
        className={sharedClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={sharedClasses}
    >
      {content}
    </button>
  );
};

export const ResumeViewer: React.FC<ResumeViewerProps> = ({
  className,
  pdfUrl = '/Resume.pdf',
  filename = 'Ashutosh_Resume.pdf',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 select-none align-middle',
        className,
      )}
    >
      {/* 1. Resume Icon Bubble */}
      {/* <BubbleItem
        icon={FileText}
        label="Resume"
        color="bg-amber-400 dark:bg-amber-500"
        ringColor="focus-visible:ring-amber-500"
        onClick={() => setIsModalOpen(true)}
      /> */}

      {/* 2. View Icon Bubble */}
      <BubbleItem
        icon={Eye}
        label="View Resume"
        color="bg-sky-400 dark:bg-sky-500"
        ringColor="focus-visible:ring-sky-500"
        onClick={() => setIsModalOpen(true)}
      />

      {/* 3. Download Icon Bubble */}
      <BubbleItem
        icon={Download}
        label="Download Resume (PDF)"
        color="bg-emerald-400 dark:bg-emerald-500"
        ringColor="focus-visible:ring-emerald-500"
        href={pdfUrl}
        download={filename}
      />

      {/* Modal Lightbox */}
      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfUrl={pdfUrl}
        filename={filename}
      />
    </div>
  );
};

export default ResumeViewer;
