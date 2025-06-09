"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  onLoadingComplete?: () => void;
  onLoadStart?: () => void;
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  loading = "lazy",
  onLoadingComplete,
  onLoadStart
}: ResponsiveImageProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleLoadStart = () => {
    setImageLoading(true);
    onLoadStart?.();
  };

  const handleLoadComplete = () => {
    setImageLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Loading Skeleton */}
      {imageLoading && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error State */}
      {imageError && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="w-12 h-12 mx-auto mb-2 bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          loading={loading}
          onLoadStart={handleLoadStart}
          onLoad={handleLoadComplete}
          onError={handleError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>
    </div>
  );
}