import { businessConfig, getSafeExternalUrl } from '../config/business';

interface BrandLogoProps {
  inverted?: boolean;
}

/**
 * Placeholder logo berbasis teks untuk Gleh Laundry.
 * Untuk mengganti dengan logo resmi, cukup isi `businessConfig.logoUrl`
 * di `src/config/business.ts` atau tempatkan file gambar di folder `public/`.
 */
export function BrandLogo({ inverted = false }: BrandLogoProps) {
  const safeLogoUrl = businessConfig.logoUrl.startsWith('/')
    ? businessConfig.logoUrl
    : getSafeExternalUrl(businessConfig.logoUrl);

  if (safeLogoUrl) {
    return (
      <img
        src={safeLogoUrl}
        alt={businessConfig.brandName}
        className="h-8 w-auto object-contain"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold tracking-tight ${
          inverted
            ? 'bg-white text-[#064E48]'
            : 'bg-[#087F75] text-white'
        }`}
      >
        G
      </span>
      <span
        className={`font-[Plus_Jakarta_Sans] text-lg font-bold tracking-tight ${
          inverted ? 'text-white' : 'text-[#064E48]'
        }`}
      >
        {businessConfig.brandName}
      </span>
    </span>
  );
}
