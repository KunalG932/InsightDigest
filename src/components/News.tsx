import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ShareButton from './ShareButton';
import Image from 'next/image';

interface newsProps {
  newsType: string;
  newsData: {
    newsId: string;
    title: string;
    content: string;
    url: string;
    imageUrl: string;
    timestamp: string;
    author?: string;
    source?: string;
  }[];
}

export function NewsComponent({ newsType, newsData }: newsProps) {
  const [summaries, setSummaries] = useState<{[key: string]: string}>({});
  const [loadingSummaries, setLoadingSummaries] = useState<{[key: string]: boolean}>({});
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    newsData.forEach(item => {
      if (!summaries[item.newsId]) {
        getSummary(item.newsId, item.content);
      }
    });
  }, [newsData]); // eslint-disable-line react-hooks/exhaustive-deps

  const getSummary = async (newsId: string, content: string) => {
    if (summaries[newsId]) return;
    setLoadingSummaries(prev => ({...prev, [newsId]: true}));
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      const data = await response.json();
      setSummaries(prev => ({...prev, [newsId]: data.summary}));
    } catch (error) {
      console.error('Error getting summary:', error);
    } finally {
      setLoadingSummaries(prev => ({...prev, [newsId]: false}));
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Recent";
    }
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl md:text-4xl font-bold text-slate-100 mb-8 tracking-tight"
      >
        {newsType}
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence mode="wait">
          {newsData.map((item, index) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={item.newsId}
              className="bg-gradient-to-br from-slate-900 to-slate-800 group hover:from-slate-800 hover:to-slate-700 
                       shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 rounded-2xl overflow-hidden
                       transform hover:-translate-y-1 relative cursor-pointer"
              onClick={() => setSelectedNews(selectedNews === item.newsId ? null : item.newsId)}
              role="article"
              aria-labelledby={`title-${item.newsId}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedNews(selectedNews === item.newsId ? null : item.newsId);
                }
              }}
            >
              <div className="relative">
                <div className="aspect-video overflow-hidden bg-slate-800">
                  {imageLoading[item.newsId] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    </div>
                  )}
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={800}
                    height={400}
                    className={`w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500
                              ${imageLoading[item.newsId] ? 'opacity-0' : 'opacity-100'}`}
                    priority={index < 3}
                    onLoadingComplete={() => setImageLoading(prev => ({...prev, [item.newsId]: false}))}
                    onLoadStart={() => setImageLoading(prev => ({...prev, [item.newsId]: true}))}
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Link 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 
                      id={`title-${item.newsId}`}
                      className="text-xl font-bold text-slate-100 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300"
                    >
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <time dateTime={item.timestamp} className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(item.timestamp)}
                    </time>
                    {item.author && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {item.author}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="prose prose-sm prose-invert max-w-none">
                  {loadingSummaries[item.newsId] ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse flex space-x-2">
                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-slate-400">Crafting summary...</span>
                    </div>
                  ) : (
                    <motion.p 
                      className="text-slate-300 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {selectedNews === item.newsId 
                        ? (summaries[item.newsId] || item.content)
                        : (summaries[item.newsId] || item.content).slice(0, 150) + '...'}
                    </motion.p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 
                               text-slate-900 font-medium transition-all duration-300 focus:outline-none focus:ring-2 
                               focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 hover:shadow-lg
                               hover:shadow-cyan-500/20 active:scale-95"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read More
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </Link>
                    <ShareButton 
                      title={item.title}
                      summary={summaries[item.newsId] || item.content}
                      url={item.url}
                    />
                  </div>
                  {item.source && (
                    <span className="px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-950/30 rounded-full">
                      {item.source}
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function NewsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse mb-8">
        <div className="h-10 bg-slate-800 rounded-lg w-1/3"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="animate-pulse">
              <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="h-6 bg-slate-700 rounded-lg w-3/4"></div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 bg-slate-700 rounded-lg w-1/4"></div>
                    <div className="h-4 bg-slate-700 rounded-lg w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded-lg"></div>
                  <div className="h-4 bg-slate-700 rounded-lg w-5/6"></div>
                  <div className="h-4 bg-slate-700 rounded-lg w-4/6"></div>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="h-8 bg-slate-700 rounded-lg w-1/3"></div>
                    <div className="h-6 bg-slate-700 rounded-full w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
