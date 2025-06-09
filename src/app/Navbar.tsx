"use client";
import { getCategories } from "@/lib/fetchNews";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [categories, setCategories] = useState<string[] | undefined>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-lg shadow-lg' 
          : 'bg-slate-950/80 backdrop-blur-lg'
      } border-b border-slate-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent 
                       hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-cyan-500 
                       focus:ring-offset-2 focus:ring-offset-slate-950 rounded-lg"
            >
              InsightDigest
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {categories?.slice(0, 6).map((category) => (
              <Link
                key={category}
                href={`/${category.toLowerCase()}`}
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-cyan-400 
                         hover:bg-slate-800/50 transition-all hover:scale-105 focus:outline-none 
                         focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {category}
              </Link>
            ))}
            {isInstallable && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 
                         text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                         focus:ring-offset-slate-950"
              >
                <Download size={18} />
                Install App
              </motion.button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center gap-4">
            {isInstallable && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleInstallClick}
                className="p-2 rounded-md text-cyan-400 hover:bg-slate-800/50 focus:outline-none 
                         focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                aria-label="Install App"
              >
                <Download size={24} />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                       focus:ring-offset-slate-950"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {categories?.slice(0, 8).map((category) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/${category.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 
                             hover:text-cyan-400 hover:bg-slate-800/50 transition-all 
                             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                             focus:ring-offset-slate-950"
                  >
                    {category}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
