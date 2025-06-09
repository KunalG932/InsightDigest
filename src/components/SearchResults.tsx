"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { NewsComponent } from './News';

interface SearchResultsProps {
  query: string;
  onClose: () => void;
  newsData: any[];
}

export default function SearchResults({ query, onClose, newsData }: SearchResultsProps) {
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filterNews = () => {
      setLoading(true);
      
      // Simulate search delay for better UX
      setTimeout(() => {
        const filtered = newsData.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase()) ||
          (item.author && item.author.toLowerCase().includes(query.toLowerCase())) ||
          (item.source && item.source.toLowerCase().includes(query.toLowerCase()))
        );

        // Sort results
        const sorted = [...filtered].sort((a, b) => {
          if (sortBy === 'date') {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
          } else {
            // Simple relevance scoring based on query matches
            const scoreA = (a.title.toLowerCase().match(new RegExp(query.toLowerCase(), 'g')) || []).length;
            const scoreB = (b.title.toLowerCase().match(new RegExp(query.toLowerCase(), 'g')) || []).length;
            return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
          }
        });

        setFilteredNews(sorted);
        setLoading(false);
      }, 500);
    };

    filterNews();
  }, [query, newsData, sortBy, sortOrder]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-50 overflow-y-auto"
    >
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <Search className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-3xl font-bold text-slate-100">
                  Search Results for "{query}"
                </h1>
                <p className="text-slate-400 mt-1">
                  {loading ? 'Searching...' : `Found ${filteredNews.length} results`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6 text-slate-400 hover:text-slate-100" />
            </button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-800/50 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <span className="text-slate-300 font-medium">Sort by:</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('relevance')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'relevance'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Relevance
              </button>
              <button
                onClick={() => setSortBy('date')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'date'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Date
              </button>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 
                       text-slate-300 rounded-lg font-medium transition-all"
            >
              {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-slate-400 text-lg">Searching through articles...</span>
                </div>
              </motion.div>
            ) : filteredNews.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <NewsComponent 
                  newsType={`Search Results (${filteredNews.length})`} 
                  newsData={filteredNews} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-300 mb-2">No Results Found</h3>
                  <p className="text-slate-400 mb-6">
                    We couldn't find any articles matching "{query}". Try different keywords or browse our categories.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 
                             hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300"
                  >
                    Browse All News
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}