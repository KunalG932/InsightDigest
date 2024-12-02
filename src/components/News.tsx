import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ShareButton from './ShareButton';
import Image from 'next/image';
import { Share2, Bookmark, BookmarkCheck } from 'lucide-react';

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

// Add animation variants at the top level
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const scaleUp = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { duration: 0.3 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardHover = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeOut"
    }
  }
};

const imageHover = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeOut"
    }
  }
};

// Add new animation variants
const swipeAnimation = {
  swipeRight: {
    x: [-20, 0],
    opacity: [0, 1],
    transition: { duration: 0.3 }
  },
  swipeLeft: {
    x: [20, 0],
    opacity: [0, 1],
    transition: { duration: 0.3 }
  }
};

// Add these new animation variants at the top
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export function NewsComponent({ newsType, newsData }: newsProps) {
  const [summaries, setSummaries] = useState<{[key: string]: string}>({});
  const [loadingSummaries, setLoadingSummaries] = useState<{[key: string]: boolean}>({});
  const [savedArticles, setSavedArticles] = useState<{[key: string]: boolean}>({});

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
      return "Recent"; // Fallback for invalid dates
    }
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Add save article functionality
  const toggleSaveArticle = (newsId: string) => {
    setSavedArticles(prev => {
      const newState = { ...prev, [newsId]: !prev[newsId] };
      // Save to localStorage
      localStorage.setItem('savedArticles', JSON.stringify(newState));
      return newState;
    });
  };

  // Load saved articles on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, []);

  const items = newsData.map((item, index) => (
    <motion.article
      variants={fadeInUp}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHover}
      key={item.newsId}
      className="bg-gradient-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 
                 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden"
    >
      <div className="relative group">
        <motion.div 
          className="aspect-video"
          variants={imageHover}
        >
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={800}
            height={400}
            className="w-full h-full object-cover rounded-t-2xl transition-transform duration-300"
            priority={index < 3}
          />
        </motion.div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleSaveArticle(item.newsId)}
            className="p-2 rounded-full bg-slate-900/80 backdrop-blur-sm text-white hover:bg-slate-800"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {savedArticles[item.newsId] ? (
                <BookmarkCheck className="w-5 h-5 text-cyan-400" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-100 md:line-clamp-2 hover:text-cyan-400 transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <time dateTime={item.timestamp}>
              {formatDate(item.timestamp)}
            </time>
            {item.author && (
              <>
                <span>•</span>
                <span>{item.author}</span>
              </>
            )}
          </div>
        </div>

        <div className="prose prose-sm prose-invert">
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
            <p className="text-slate-300 leading-relaxed">
              {summaries[item.newsId] || item.content}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Read Full Story
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <span className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-800/50 rounded-full">
              {item.source}
            </span>
          )}
        </div>

        {/* Add mobile-optimized actions */}
        <div className="md:hidden px-6 py-3 border-t border-slate-700/50">
          <div className="flex justify-around">
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cyan-400"
            >
              <span>Read</span>
            </Link>
            <button
              onClick={() => toggleSaveArticle(item.newsId)}
              className="flex items-center gap-2 text-slate-300"
            >
              {savedArticles[item.newsId] ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
            <ShareButton 
              title={item.title}
              summary={summaries[item.newsId] || item.content}
              url={item.url}
              isMobile={true}
            />
          </div>
        </div>
      </div>
    </motion.article>
  ));

  return (
    <motion.main
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12"
    >
      <div className="container mx-auto px-4">
        <motion.header 
          variants={fadeInUp}
          className="text-center mb-16 space-y-4"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            InsightDigest
          </motion.h1>
          <motion.p 
            className="text-slate-400 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {newsType}
          </motion.p>
          <motion.div 
            className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.header>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {items}
        </motion.div>
      </div>
    </motion.main>
  );
}

// Update NewsLoading component for better loading states
export function NewsLoading() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12"
    >
      <div className="container mx-auto px-4">
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <motion.div 
              variants={shimmer}
              animate="animate"
              className="h-12 w-64 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-lg mx-auto"
              style={{ backgroundSize: "200% 100%" }}
            />
            <motion.div 
              variants={shimmer}
              animate="animate"
              className="h-4 w-32 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded mx-auto"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-slate-800 rounded-2xl overflow-hidden"
              >
                <motion.div 
                  variants={shimmer}
                  animate="animate"
                  className="h-48 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <motion.div 
                      variants={shimmer}
                      animate="animate"
                      className="h-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded w-3/4"
                      style={{ backgroundSize: "200% 100%" }}
                    />
                    <motion.div 
                      variants={shimmer}
                      animate="animate"
                      className="h-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded w-1/2"
                      style={{ backgroundSize: "200% 100%" }}
                    />
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, idx) => (
                      <motion.div 
                        key={idx}
                        variants={shimmer}
                        animate="animate"
                        className="h-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded"
                        style={{ backgroundSize: "200% 100%" }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function NewsNavigation({ 
  onLoadMore, 
  hasMore, 
  isLoading,
  currentPage,
  onPrevPage,
  onNextPage,
  showPagination = false
}: {
  onLoadMore?: () => void,
  hasMore?: boolean,
  isLoading?: boolean,
  currentPage?: number,
  onPrevPage?: () => void,
  onNextPage?: () => void,
  showPagination?: boolean
}) {
  if (showPagination) {
    return (
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800 safe-bottom"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200
                ${currentPage === 1 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                }`}
            >
              Previous Page
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextPage}
              disabled={!hasMore}
              className={`px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200
                ${!hasMore
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                }`}
            >
              Next Page
            </motion.button>
          </div>
          {/* Add page indicator for mobile */}
          <div className="mt-2 text-center text-sm text-slate-400">
            Page {currentPage}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex justify-center pb-12"
    >
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2"
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
          </div>
          <span className="text-slate-400">Loading more stories...</span>
        </motion.div>
      ) : hasMore && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLoadMore}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transform transition-all duration-200"
        >
          Load More Stories
        </motion.button>
      )}
    </motion.div>
  );
}
