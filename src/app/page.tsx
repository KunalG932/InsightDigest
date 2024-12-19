"use client";
import { topNews } from "@/lib/fetchNews";
import { useEffect, useState } from "react";
import { NewsComponent, NewsLoading } from "@/components/News";
import { motion } from "framer-motion";

type TopStories = {
  newsId: string;
  title: string;
  author: string;
  source: string;
  url: string;
  content: string;
  description: string;
  imageUrl: string;
  timestamp: string;
  author_url: string;
};

export default function Home() {
  const [topStory, setTopStory] = useState<TopStories[]>([]);
  const [counts, setCounts] = useState(6);
  const [loadMore, setLoadMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchTStory = async () => {
    try {
      setLoadMore(true);
      const res = await topNews(counts);
      if (!res) {
        throw new Error("Failed to fetch news");
      }
      if (res.length < counts) {
        setHasMore(false);
      }
      setTopStory(res);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
      setLoadMore(false);
    }
  };

  useEffect(() => {
    fetchTStory();
  }, [counts]);

  const handleLoadMore = () => {
    setCounts(prev => prev + 3);
  };

  if (loading) return <NewsLoading />;

  return (
    <div className="min-h-screen">
      <NewsComponent newsType="Top Stories" newsData={topStory} />
      
      <div className="flex justify-center pb-12">
        {loadMore ? (
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
            onClick={handleLoadMore}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transform transition-all duration-200"
          >
            Load More Stories
          </motion.button>
        )}
      </div>
    </div>
  );
}
