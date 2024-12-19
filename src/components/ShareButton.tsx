"use client";

import { useState } from 'react';
import { Share2, Check, Copy, Twitter, Facebook, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  title: string;
  summary: string;
  url: string;
}

export default function ShareButton({ title, summary, url }: ShareButtonProps) {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `${title}\n\nAI Summary: ${summary}\n\nRead more at:`;

  const handleShare = async (platform: string) => {
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${shareText} ${url}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share({
              title: title,
              text: shareText,
              url: url
            });
          } catch (err) {
            console.error('Share failed:', err);
          }
        }
    }
    setShowShare(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="p-2 rounded-full hover:bg-slate-800/50 transition-colors"
        aria-label="Share"
      >
        <Share2 className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
      </button>

      <AnimatePresence>
        {showShare && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowShare(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 bottom-full mb-2 p-2 bg-slate-800 rounded-lg shadow-xl z-50 min-w-[200px]"
            >
              <div className="space-y-1">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 w-full p-2 rounded hover:bg-slate-700 text-left text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Twitter size={18} />
                  <span>Share on Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2 w-full p-2 rounded hover:bg-slate-700 text-left text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Facebook size={18} />
                  <span>Share on Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-2 w-full p-2 rounded hover:bg-slate-700 text-left text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <MessageCircle size={18} />
                  <span>Share on WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 w-full p-2 rounded hover:bg-slate-700 text-left text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                {navigator.share && (
                  <button
                    onClick={() => handleShare('native')}
                    className="flex items-center gap-2 w-full p-2 rounded hover:bg-slate-700 text-left text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <LinkIcon size={18} />
                    <span>More Options</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 