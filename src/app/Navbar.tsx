"use client";
import { getCategories } from "@/lib/fetchNews";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Download, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [categories, setCategories] = useState<string[] | undefined>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-lg shadow-lg' 
          : 'bg-slate-950/80 backdrop-blur-lg'
      } border-b border-slate-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent 
                       hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-cyan-500 
                       focus:ring-offset-2 focus:ring-offset-slate-950 rounded-lg touch-target"
            >
              InsightDigest
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {categories?.slice(0, 6).map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/${category.toLowerCase()}`}
                  className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                           focus:ring-offset-slate-950 ${
                             activeCategory === category
                               ? 'text-cyan-400 bg-slate-800/50'
                               : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50'
                           }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Link>
              </motion.div>
            ))}
            {isInstallable && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 
                         text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                         focus:ring-offset-slate-950 shadow-lg hover:shadow-cyan-500/20 text-sm"
              >
                <Download size={16} />
                <span className="hidden lg:inline">Install App</span>
                <span className="lg:hidden">Install</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center gap-2 sm:gap-4">
            {isInstallable && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleInstallClick}
                className="p-2 rounded-md text-cyan-400 hover:bg-slate-800/50 focus:outline-none 
                         focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950
                         touch-target"
                aria-label="Install App"
              >
                <Download size={20} />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                       focus:ring-offset-slate-950 touch-target"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
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
            <div className="px-2 pt-2 pb-3 space-y-1 safe-bottom">
              {categories?.slice(0, 8).map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    href={`/${category.toLowerCase()}`}
                    onClick={() => {
                      setIsOpen(false);
                      setActiveCategory(category);
                    }}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-all duration-300
                             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                             focus:ring-offset-slate-950 touch-target ${
                               activeCategory === category
                                 ? 'text-cyan-400 bg-slate-800/50'
                                 : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50'
                             }`}
                  >
                    {category}
                  </Link>
                </motion.div>
              ))}
              {isInstallable && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.4 }}
                  className="pt-2"
                >
                  <button
                    onClick={() => {
                      handleInstallClick();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md 
                             bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium 
                             hover:from-cyan-600 hover:to-blue-600 transition-all focus:outline-none 
                             focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950
                             touch-target"
                  >
                    <Download size={18} />
                    Install App
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}