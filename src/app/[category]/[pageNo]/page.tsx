"use client";
import { NewsComponent, NewsLoading, NewsNavigation } from "@/components/News";
import { getCategories, getNewsByCategory } from "@/lib/fetchNews";
import { usePathname, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function News() {
  const [categories, setCategories] = useState<string[] | undefined>([]);
  const [category, setCategory] = useState<string>("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const pathname = usePathname();
  useEffect(() => {
    const [newCategory, newPageNo] = [
      pathname.split("/")[1],
      pathname.split("/")[2],
    ];
    setCategory(newCategory.charAt(0).toUpperCase() + newCategory.slice(1));
    setPageNo(parseInt(newPageNo || "1"));
  }, [pathname]);

  const fetchNews = async () => {
    try {
      const res = await getNewsByCategory(category, pageNo);
      setNews(res);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category !== "") {
      fetchNews();
    }
  }, [category]);

  if (loading || categories === undefined) {
    return <NewsLoading />;
  }
  if (categories.length === 0 || !categories.includes(category)) {
    return notFound();
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${category}-${pageNo}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pb-24"
      >
        <NewsComponent newsType={category} newsData={news} />
        <NewsNavigation 
          showPagination={true}
          currentPage={pageNo}
          hasMore={news.length >= 6}
          onPrevPage={() => window.location.href = `/${category}/${pageNo - 1}`}
          onNextPage={() => window.location.href = `/${category}/${pageNo + 1}`}
        />
      </motion.div>
    </AnimatePresence>
  );
}
