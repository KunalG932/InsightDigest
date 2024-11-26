"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // First wait 10 seconds before redirecting
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => {
      clearTimeout(redirectTimeout);
      clearInterval(countdownInterval);
    };
  }, [router]);

  // Loading dots animation
  const loadingContainer = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const loadingDot = {
    start: {
      y: "0%",
    },
    end: {
      y: "100%",
    },
  };

  const loadingDotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          404 - Page Not Found
        </motion.h1>
        
        <motion.p 
          className="text-slate-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          className="flex justify-center items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-slate-500">
            Redirecting to home page in {countdown} seconds
          </p>
          <motion.div
            className="flex gap-1"
            variants={loadingContainer}
            initial="start"
            animate="end"
          >
            {[...Array(3)].map((_, index) => (
              <motion.span
                key={index}
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                variants={loadingDot}
                transition={loadingDotTransition}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium shadow-lg transition-all duration-200 hover:scale-105"
          >
            Return Home Now
          </Link>
        </motion.div>

        {/* Progress bar */}
        <motion.div 
          className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
} 