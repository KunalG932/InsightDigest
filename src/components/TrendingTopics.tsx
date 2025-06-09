"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Hash, ArrowRight } from 'lucide-react';

interface TrendingTopicsProps {
  onTopicClick: (topic: string) => void;
}

export default function TrendingTopics({ onTopicClick }: TrendingTopicsProps) {
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    // Simulate trending topics - in a real app, this would come from an API
    const trendingTopics = [
      'Technology', 'Climate Change', 'AI Revolution', 'Space Exploration',
      'Cryptocurrency', 'Healthcare', 'Politics', 'Sports', 'Entertainment',
      'Science', 'Economy', 'Education'
    ];
    setTopics(trendingTopics);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
              Trending Topics
            </h2>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover what's making headlines across different categories and stay ahead of the conversation.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topics.map((topic, index) => (
            <motion.button
              key={topic}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTopicClick(topic)}
              className="group relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 
                       hover:from-slate-700 hover:to-slate-800 rounded-2xl border border-slate-700 
                       hover:border-cyan-500/50 transition-all duration-300 text-left overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-xl" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-slate-400 font-medium">TRENDING</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
                  {topic}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span className="text-sm">Explore articles</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-6">
            Can't find what you're looking for? Try our advanced search.
          </p>
          <button
            onClick={() => onTopicClick('')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 
                     border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 
                     rounded-lg font-medium transition-all duration-300"
          >
            <TrendingUp className="w-5 h-5" />
            View All Categories
          </button>
        </motion.div>
      </div>
    </section>
  );
}