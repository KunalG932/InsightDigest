import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

  const items = newsData.map((item, index) => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      key={item.newsId}
      className="bg-gradient-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 
                 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden"
    >
      <div className="relative group">
        <div className="aspect-video overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={800}
            height={400}
            className="w-full h-48 object-cover rounded-t-2xl"
            priority={index < 3}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-100 line-clamp-2 hover:text-cyan-400 transition-colors">
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
      </div>
    </motion.article>
  ));

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            InsightDigest
          </h1>
          <p className="text-slate-400 text-lg">{newsType}</p>
          <div className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items}
        </div>
      </div>
    </main>
  );
}

export function NewsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-16">
          <div className="text-center space-y-4">
            <div className="h-12 w-64 bg-slate-800 rounded-lg mx-auto"></div>
            <div className="h-4 w-32 bg-slate-800 rounded mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl overflow-hidden">
                <div className="h-48 bg-slate-700"></div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-700 rounded"></div>
                    <div className="h-4 bg-slate-700 rounded"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
