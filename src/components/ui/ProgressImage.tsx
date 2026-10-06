'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Image as ImageIcon } from 'lucide-react';

interface ProgressImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export const ProgressImage: React.FC<ProgressImageProps> = ({
  src,
  alt,
  fill = true,
  width,
  height,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={clsx('relative overflow-hidden bg-slate-900', fill && 'w-full h-full')}>
      {/* Skeleton Loading Pulse */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-[length:200%_100%] animate-pulse z-10 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-slate-700 animate-bounce opacity-40" />
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-600">
          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs font-mono">Image Unavailable</span>
        </div>
      ) : fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          unoptimized
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={clsx(
            'object-cover transition-all duration-700 ease-in-out',
            isLoaded ? 'scale-100 blur-0 opacity-100' : 'scale-105 blur-lg opacity-0',
            className
          )}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 600}
          height={height || 400}
          priority={priority}
          unoptimized
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={clsx(
            'object-cover transition-all duration-700 ease-in-out',
            isLoaded ? 'scale-100 blur-0 opacity-100' : 'scale-105 blur-lg opacity-0',
            className
          )}
        />
      )}
    </div>
  );
};
