import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  skeletonClassName,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Centralised CDN/Backend URL Logic
  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder-product.jpg';
    if (path.startsWith('http') || path.startsWith('/')) return path;
    
    // In production, use VERCEL_URL or custom CDN
    const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    return `${apiBase}/${path.replace(/^\/+/, '')}`;
  };

  const finalSrc = getImageUrl(src);

  return (
    <div className={cn("relative overflow-hidden bg-muted", containerClassName)}>
      {!loaded && !error && (
        <div className={cn("absolute inset-0 flex items-center justify-center animate-pulse bg-muted", skeletonClassName)}>
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs">
          Image not found
        </div>
      ) : (
        <img
          src={finalSrc}
          alt={alt}
          loading="lazy" // Native browser lazy loading
          className={cn(
            "transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
