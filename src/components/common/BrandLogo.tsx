import { useState } from 'react';

interface BrandLogoProps {
  brandName?: string;
  logoUrl?: string;
  darkText?: boolean;
}

export function BrandLogo({
  brandName = 'AI Diagno',
  logoUrl = '/assets/aistudio/image_15ff9196.png',
  darkText = true,
}: BrandLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      {!imgFailed && logoUrl ? (
        <img
          src={logoUrl}
          alt={brandName}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-8 h-8 object-contain rounded-md shrink-0"
        />
      ) : (
        <span className="w-8 h-8 rounded-md bg-[#0756B8] text-white flex items-center justify-center font-bold text-sm shrink-0">
          AD
        </span>
      )}
      <span
        className={`text-lg font-bold tracking-tight whitespace-nowrap shrink-0 ${
          darkText ? 'text-[#0F2747]' : 'text-white'
        }`}
      >
        {brandName}
      </span>
    </span>
  );
}
