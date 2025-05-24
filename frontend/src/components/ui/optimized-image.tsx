"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  aspectRatio?: number;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  aspectRatio,
  priority = false,
  sizes,
  fallbackSrc = "/images/placeholders/placeholder-campaign.jpg",
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    onError?.();
  };

  const responsiveSizes =
    sizes ||
    (fill
      ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      : width
        ? `(max-width: 768px) ${Math.min(width, 640)}px, ${width}px`
        : "100vw");

  if (fill) {
    return (
      <div className="relative overflow-hidden" style={{ aspectRatio }}>
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading && "opacity-0",
            !isLoading && "opacity-100",
            className,
          )}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          sizes={responsiveSizes}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoading && "opacity-0",
          !isLoading && "opacity-100",
          className,
        )}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        sizes={responsiveSizes}
      />
      {isLoading && width && height && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
    </div>
  );
};
