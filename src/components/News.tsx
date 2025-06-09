import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ShareButton from './ShareButton';
import ResponsiveImage from './ResponsiveImage';
import { Clock, User, ExternalLink, Sparkles } from 'lucide-react';

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

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Recently";
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(timestamp);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
          {newsType}
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
          Stay informed with AI-powered summaries of the latest news from trusted sources worldwide.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence mode="wait">
          {newsData.map((item, index) => (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={item.newsId}
              className="group bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-lg 
                       hover:from-slate-800/80 hover:to-slate-700/80 shadow-xl hover:shadow-2xl 
                       hover:shadow-cyan-500/20 transition-all duration-500 rounded-2xl sm:rounded-3xl overflow-hidden
                       border border-slate-700/50 hover:border-cyan-500/50 card-hover"
              role="article"
              aria-labelledby={`title-${item.newsId}`}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-video bg-slate-800 relative">
                  <ResponsiveImage
                    src={item.imageUrl}
                    alt={item.title}
                    width={800}
                    height={400}
                    className="w-full h-48 sm:h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    priority={index < 3}
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                                opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* AI Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-2 px-2 sm:px-3 py-1 
                                bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-sm 
                                rounded-full text-white text-xs sm:text-sm font-medium">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">AI Summary</span>
                    <span className="sm:hidden">AI</span>
                  </div>

                  {/* Time Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-3 py-1 bg-slate-900/80 backdrop-blur-sm 
                                rounded-full text-slate-300 text-xs sm:text-sm font-medium">
                    {getTimeAgo(item.timestamp)}
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <Link 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block group/link focus:outline-none focus:ring-2 focus:ring-cyan-500 
                             focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg touch-target"
                  >
                    <h3 
                      id={`title-${item.newsId}`}
                      className="text-lg sm:text-xl font-bold text-slate-100 line-clamp-2 group-hover/link:text-cyan-400 
                               transition-colors duration-300 leading-tight"
                    >
                      {item.title}
                    </h3>
                  </Link>
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <time dateTime={item.timestamp}>
                        {formatDate(item.timestamp)}
                      </time>
                    </div>
                    {item.author && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate max-w-[100px] sm:max-w-[120px]">{item.author}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose prose-sm prose-invert max-w-none">
                  {loadingSummaries[item.newsId] ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-slate-400 text-xs sm:text-sm">AI is crafting your summary...</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-700 rounded-full w-full shimmer"></div>
                        <div className="h-3 bg-slate-700 rounded-full w-4/5 shimmer"></div>
                        <div className="h-3 bg-slate-700 rounded-full w-3/5 shimmer"></div>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        {selectedNews === item.newsId 
                          ? (summaries[item.newsId] || item.content)
                          : (summaries[item.newsId] || item.content).slice(0, 150) + '...'}
                      </p>
                      
                      {(summaries[item.newsId] || item.content).length > 150 && (
                        <button
                          onClick={() => setSelectedNews(selectedNews === item.newsId ? null : item.newsId)}
                          className="mt-2 text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm font-medium 
                                   transition-colors duration-300 touch-target"
                        >
                          {selectedNews === item.newsId ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl 
                               bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
                               text-white font-medium transition-all duration-300 focus-ring
                               hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 text-xs sm:text-sm
                               touch-target"
                    >
                      <span className="hidden sm:inline">Read Full</span>
                      <span className="sm:hidden">Read</span>
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                    <ShareButton 
                      title={item.title}
                      summary={summaries[item.newsId] || item.content}
                      url={item.url}
                    />
                  </div>
                  {item.source && (
                    <span className="px-2 sm:px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-950/30 
                                   border border-cyan-500/30 rounded-full truncate max-w-[80px] sm:max-w-none">
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
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <div className="h-10 sm:h-12 bg-slate-800 rounded-lg w-1/2 sm:w-1/3 mx-auto mb-4 shimmer"></div>
        <div className="h-5 sm:h-6 bg-slate-800 rounded-lg w-3/4 sm:w-1/2 mx-auto shimmer"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-slate-800/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-700/50"
          >
            <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-cyan-500"></div>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="h-5 sm:h-6 bg-slate-700 rounded-lg w-3/4 shimmer"></div>
                <div className="flex items-center gap-3">
                  <div className="h-3 sm:h-4 bg-slate-700 rounded-lg w-1/4 shimmer"></div>
                  <div className="h-3 sm:h-4 bg-slate-700 rounded-lg w-1/4 shimmer"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 sm:h-4 bg-slate-700 rounded-lg shimmer"></div>
                <div className="h-3 sm:h-4 bg-slate-700 rounded-lg w-5/6 shimmer"></div>
                <div className="h-3 sm:h-4 bg-slate-700 rounded-lg w-4/6 shimmer"></div>
              </div>
              <div className="pt-3 sm:pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="h-7 sm:h-8 bg-slate-700 rounded-lg w-1/3 shimmer"></div>
                  <div className="h-5 sm:h-6 bg-slate-700 rounded-full w-1/4 shimmer"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}