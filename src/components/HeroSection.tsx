"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Clock, Globe, Zap } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  trendingTopics: string[];
}

export default function HeroSection({ onSearch, trendingTopics }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const stats = [
    { icon: Globe, label: 'Global Sources', value: '500+' },
    { icon: Zap, label: 'AI Summaries', value: '10K+' },
    { icon: Clock, label: 'Real-time Updates', value: '24/7' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100, null],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                InsightDigest
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Stay informed with AI-powered news summaries that cut through the noise. 
              Get the insights that matter, when they matter.
            </motion.p>
          </div>

          {/* Current Time Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-slate-400"
          >
            <Clock size={20} />
            <span className="text-lg font-mono">
              {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
            </span>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={24} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for news, topics, or keywords..."
                className="w-full pl-12 pr-6 py-4 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl 
                         text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 
                         focus:border-transparent transition-all duration-300 text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r 
                         from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl 
                         font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                Search
              </button>
            </div>
          </motion.form>

          {/* Trending Topics */}
          {trendingTopics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <TrendingUp size={20} />
                <span className="font-medium">Trending Topics</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {trendingTopics.slice(0, 6).map((topic, index) => (
                  <motion.button
                    key={topic}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSearch(topic)}
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 
                             hover:border-cyan-500 rounded-full text-slate-300 hover:text-cyan-400 
                             transition-all duration-300 backdrop-blur-sm"
                  >
                    #{topic}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.2 }}
                className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 
                         hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <Link
              href="#news"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 
                       hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-2xl 
                       shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 
                       transform hover:-translate-y-1 text-lg"
            >
              Explore Latest News
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-slate-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}