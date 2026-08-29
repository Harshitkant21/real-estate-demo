import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'hero' | 'card' | 'floorplan' | 'square';
  className?: string;
}

export const ImageWithFallback: React.FC<Props> = ({
  src,
  alt,
  aspectRatio = 'card',
  className = '',
  loading = 'lazy',
  ...rest
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const aspectClass = {
    hero: 'aspect-hero',
    card: 'aspect-card',
    floorplan: 'aspect-floorplan',
    square: 'aspect-square',
  }[aspectRatio];

  if (error || !src) {
    return (
      <div
        className={`w-full ${aspectClass} bg-stone-100 flex flex-col items-center justify-center p-4 text-stone-400 border border-stone-200 rounded-lg ${className}`}
      >
        <Building2 className="w-8 h-8 text-amber-800/40 mb-1" />
        <span className="text-xs font-medium text-stone-500">AM Estates Editorial Media</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden bg-stone-100 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  );
};
