"use client";

import { Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  title: string;
  summary: string;
  url: string;
  isMobile?: boolean;
}

export default function ShareButton({ title, summary, url, isMobile = false }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary,
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (isMobile) {
    return (
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-slate-300"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-colors"
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
} 