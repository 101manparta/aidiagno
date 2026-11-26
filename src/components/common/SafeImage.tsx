import { useState } from 'react';
import { TestTubes } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({ src, alt, className = '', fallbackLabel }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 border border-slate-200 flex flex-col items-center justify-center gap-2 text-[#0F2747]/70 p-6 ${className}`}
      >
        <TestTubes className="w-8 h-8 text-[#0756B8]" strokeWidth={1.6} />
        <span className="text-xs font-medium text-center text-slate-600 max-w-xs">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
