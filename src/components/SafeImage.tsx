import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  className = 'h-full w-full object-cover',
  loading = 'lazy',
  fallbackLabel = 'Gleh Laundry',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#F0FAF8] p-6 text-center text-[#064E48]"
      >
        <Sparkles className="h-7 w-7 text-[#087F75]" aria-hidden="true" />
        <span className="text-sm font-medium text-[#173C38]/80">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
