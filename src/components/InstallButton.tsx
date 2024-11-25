"use client";

import { useState, useEffect } from 'react';
import { Download, Smartphone, Laptop, Chrome, Safari } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect mobile and iOS
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowInstructions(true);
      return;
    }
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstructions(true);
    }
  };

  if (!isInstallable && !showInstructions) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full right-0 mb-2 p-3 bg-green-500 text-white rounded-lg shadow-lg"
            >
              App installed successfully! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        {isInstallable && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Install App</span>
            </button>

            <div className="absolute bottom-full right-0 mb-2 w-64 p-4 bg-slate-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <h3 className="text-white font-medium mb-2">Available on:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile devices</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Laptop className="w-4 h-4" />
                  <span>Desktop browsers</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Installation Instructions</h2>
              
              {isIOS ? (
                <div className="space-y-4">
                  <p className="text-slate-300">To install on iOS:</p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300">
                    <li>Tap the &quot;Share&quot; button in Safari</li>
                    <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                    <li>Tap &quot;Add&quot; to confirm</li>
                  </ol>
                </div>
              ) : isMobile ? (
                <div className="space-y-4">
                  <p className="text-slate-300">To install on Android:</p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300">
                    <li>Tap the "Install App" button when prompted</li>
                    <li>Or tap the menu (⋮) in your browser</li>
                    <li>Select "Install App" or "Add to Home Screen"</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-300">To install on Desktop:</p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300">
                    <li>Click the install icon (⊕) in your browser's address bar</li>
                    <li>Or click the "Install App" button when prompted</li>
                  </ol>
                </div>
              )}

              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors w-full"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 