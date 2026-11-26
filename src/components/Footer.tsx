import {
  businessConfig,
  getSafeExternalUrl,
  getWhatsAppUrl,
} from '../config/business';
import { NAV_ITEMS } from '../data/laundryData';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const whatsappUrl = getWhatsAppUrl(businessConfig.whatsappNumber);
  const instagramUrl = getSafeExternalUrl(businessConfig.instagramUrl);
  const tiktokUrl = getSafeExternalUrl(businessConfig.tiktokUrl);
  const mapsUrl = getSafeExternalUrl(businessConfig.googleMapsUrl);

  const socialLinks = [
    whatsappUrl ? { label: 'WhatsApp', href: whatsappUrl } : null,
    instagramUrl ? { label: 'Instagram', href: instagramUrl } : null,
    tiktokUrl ? { label: 'TikTok', href: tiktokUrl } : null,
    mapsUrl ? { label: 'Google Maps', href: mapsUrl } : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  return (
    <footer className="border-t border-[#087F75]/12 bg-[#064E48] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm">
            <BrandLogo inverted />
            <p className="mt-3 font-[Plus_Jakarta_Sans] text-base font-medium text-[#A8E6DC]">
              &ldquo;{businessConfig.tagline}&rdquo;
            </p>
            <p className="mt-2 text-sm text-white/70">{businessConfig.city}</p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-14">
            <div>
              <p className="font-[Plus_Jakarta_Sans] text-sm font-semibold text-white">
                Navigasi
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-white/75">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="transition-colors hover:text-[#A8E6DC]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {socialLinks.length > 0 && (
              <div>
                <p className="font-[Plus_Jakarta_Sans] text-sm font-semibold text-white">
                  Tautan Resmi
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-[#A8E6DC]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-white/12 pt-6 text-xs text-white/60 sm:flex sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {businessConfig.brandName}. Seluruh
            hak cipta dilindungi.
          </p>
          <p className="mt-2 sm:mt-0">
            Informasi layanan dan estimasi harga disusun berdasarkan konsep rencana
            usaha.
          </p>
        </div>
      </div>
    </footer>
  );
}
