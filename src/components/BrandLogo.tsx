import { businessConfig, getSafeExternalUrl } from '../config/business';

interface BrandLogoProps {
  inverted?: boolean;
}

/**
 * Logo resmi Gleh Laundry (ikon mesin cuci, gelombang air, dan kilauan bintang)
 * sesuai identitas brand. Tetap mendukung penggantian lewat `businessConfig.logoUrl`.
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
        className="h-9 w-auto object-contain"
        referrerPolicy="no-referrer"
      />
    );
  }

  const machineMain = inverted ? '#A8E6DC' : '#087F75';
  const machineDeep = inverted ? '#FFFFFF' : '#064E48';
  const waveLight = inverted ? '#E0F9F5' : '#26C6DA';
  const waveMid = inverted ? '#7CE5D8' : '#00A9C6';
  const sparkleColor = inverted ? '#A8E6DC' : '#12B5CB';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <svg
        width="40"
        height="40"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-9 w-9 shrink-0"
      >
        {/* Mesin Cuci - Rangka Utama */}
        <path
          d="M14 17C14 13.6863 16.6863 11 20 11H38C41.3137 11 44 13.6863 44 17V36.5C44 45.6127 36.6127 53 27.5 53C20.0442 53 14 46.9558 14 39.5V17Z"
          fill={machineMain}
        />
        {/* Bagian atas panel kontrol mesin */}
        <path
          d="M17 18.5C17 15.7386 19.2386 13.5 22 13.5H36C38.7614 13.5 41 15.7386 41 18.5V20.5H17V18.5Z"
          fill={machineDeep}
        />
        {/* Titik indikator panel */}
        <circle cx="21.5" cy="17" r="1.4" fill={inverted ? '#064E48' : '#FFFFFF'} />
        <circle cx="25.5" cy="17" r="1.4" fill={inverted ? '#064E48' : '#FFFFFF'} />
        <circle cx="34" cy="17" r="1.1" fill={inverted ? '#064E48' : '#A8E6DC'} />
        <circle cx="37.2" cy="17" r="1.1" fill={inverted ? '#064E48' : '#A8E6DC'} />

        {/* Pintu Drum Lingkaran */}
        <circle
          cx="29"
          cy="34"
          r="11.5"
          fill={inverted ? '#064E48' : '#FFFFFF'}
        />
        <circle cx="29" cy="34" r="8.6" fill={machineDeep} />
        <circle cx="29" cy="34" r="6.2" fill={waveMid} />
        <path
          d="M23.5 34.5C25.5 31.8 28.8 31.5 31.5 33.4C33 34.5 34.2 34.3 35.1 33.3C34.8 36.8 32.2 39.8 28.9 39.8C26 39.8 23.8 37.5 23.5 34.5Z"
          fill={waveLight}
        />

        {/* Percikan air kiri */}
        <path
          d="M9.5 34.5C7.2 33 5.5 30.2 6.8 28.4C8.1 26.6 11.4 29 12.2 32.8C12.5 34.2 11.2 35.5 9.5 34.5Z"
          fill={waveLight}
        />
        <circle cx="7" cy="37.5" r="2.2" fill={waveMid} />

        {/* Gelombang Air Utama */}
        <path
          d="M8.5 41.2C14.5 44.5 22 43.2 28.2 39.2C34 35.4 40.5 34.8 47.8 38.6C50.4 39.9 52.3 41.8 53.5 43.5C47.5 41.8 42.2 42.6 36.6 45.8C29.5 49.8 20 50.4 11.6 45.2C10 44.2 9 42.8 8.5 41.2Z"
          fill={waveLight}
        />
        <path
          d="M12.5 46.8C19.8 50.8 29.2 50.2 36.8 45.6C41.2 42.9 45.8 42 50.5 43.2C45.8 47.8 38.4 53.5 28.4 53.8C21.2 54 15.8 50.8 12.5 46.8Z"
          fill={waveMid}
        />

        {/* Kilauan Bintang (3 Sparkles) */}
        <path
          d="M50 12L51.5 16.5L56 18L51.5 19.5L50 24L48.5 19.5L44 18L48.5 16.5L50 12Z"
          fill={sparkleColor}
        />
        <path
          d="M56.5 22L57.5 25L60.5 26L57.5 27L56.5 30L55.5 27L52.5 26L55.5 25L56.5 22Z"
          fill={sparkleColor}
        />
        <path
          d="M44.5 9L45.2 11.1L47.3 11.8L45.2 12.5L44.5 14.6L43.8 12.5L41.7 11.8L43.8 11.1L44.5 9Z"
          fill={sparkleColor}
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-[Plus_Jakarta_Sans] text-[1.2rem] font-extrabold tracking-tight ${
            inverted ? 'text-white' : 'text-[#064E48]'
          }`}
        >
          Gleh
        </span>
        <span
          className={`mt-0.5 font-[Plus_Jakarta_Sans] text-[0.62rem] font-bold tracking-[0.26em] ${
            inverted ? 'text-[#A8E6DC]' : 'text-[#087F75]'
          }`}
        >
          LAUNDRY
        </span>
      </span>
    </span>
  );
}
