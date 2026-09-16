'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

export interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  filename?: string;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  pdfUrl = '/Resume.pdf',
  filename = 'Ashutosh_Resume.pdf',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 md:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center gap-2.5 sm:gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls Bar */}
            <div className="w-full flex items-center justify-between text-white font-mono text-xs px-1 sm:px-2 select-none gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                <span id="resume-modal-title" className="font-semibold tracking-tight text-xs sm:text-sm truncate">
                  Ashutosh &bull; Resume
                </span>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 whitespace-nowrap">
                  PDF &bull; Software Engineer
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Download Button */}
                <a
                  href={pdfUrl}
                  download={filename}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white font-mono text-xs cursor-pointer border border-white/10 hover:border-white/25 active:scale-95"
                  title="Download Resume PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden min-[400px]:inline">Download</span>
                </a>

                {/* Open in New Tab Button */}
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer border border-white/10"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer border border-white/10"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Frame */}
            <div className="relative w-full h-[74vh] sm:h-[82vh] rounded-2xl overflow-hidden border border-white/15 bg-neutral-950 flex flex-col shadow-2xl">
              <iframe
                src={`${pdfUrl}#view=FitH`}
                className="w-full h-full border-0 bg-white"
                title="Ashutosh — Resume PDF"
              />

              {/* Mobile Quick Action Footer */}
              <div className="sm:hidden px-3.5 py-2.5 bg-neutral-900 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/80 shrink-0">
                <span className="text-white/60">Ashutosh — Systems & Backend</span>
                <a
                  href={pdfUrl}
                  download={filename}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ResumeModal;
