"use client";
import { topNews } from "@/lib/fetchNews";
import { useEffect, useState } from "react";
import { NewsComponent, NewsLoading, NewsNavigation } from "@/components/News";
import { motion, AnimatePresence } from "framer-motion";

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
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen"
      >
        <NewsComponent newsType="Top Stories" newsData={topStory} />
        <NewsNavigation 
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={loadMore}
        />
      </motion.div>
    </AnimatePresence>
  );
}
