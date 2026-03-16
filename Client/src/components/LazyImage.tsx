import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

/**
 * LazyImage – renders images with native lazy loading + blur-up effect.
 * Falls back gracefully if the image fails to load.
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = '/images/placeholder.webp',
  className = '',
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use IntersectionObserver for browsers that don't support loading="lazy"
  useEffect(() => {
    const img = imgRef.current;
    if (!img || img.complete) {
      setLoaded(true);
    }
  }, []);

  const resolvedSrc = error ? placeholder : src;

  return (
    <img
      ref={imgRef}
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => { setError(true); setLoaded(true); }}
      className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      {...rest}
    />
  );
};

export default LazyImage;
