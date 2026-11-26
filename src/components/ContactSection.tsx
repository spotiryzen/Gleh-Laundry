import { Clock, ExternalLink, MapPin, MessageCircle, Phone } from 'lucide-react';
import {
  businessConfig,
  getSafeExternalUrl,
  getWhatsAppUrl,
} from '../config/business';

interface ContactSectionProps {
  onOpenChat: () => void;
}

export function ContactSection({ onOpenChat }: ContactSectionProps) {
  const whatsappUrl = getWhatsAppUrl(
    businessConfig.whatsappNumber,
    'Halo Gleh Laundry, saya ingin bertanya mengenai layanan laundry.'
  );
  const instagramUrl = getSafeExternalUrl(businessConfig.instagramUrl);
  const tiktokUrl = getSafeExternalUrl(businessConfig.tiktokUrl);
  const mapsUrl = getSafeExternalUrl(businessConfig.googleMapsUrl);
  const address = businessConfig.address.trim();
  const openingHours = businessConfig.openingHours.trim();

  const hasConfiguredLinks = Boolean(whatsappUrl || instagramUrl || tiktokUrl || mapsUrl);

  return (
    <section id="kontak" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 rounded-3xl border border-[#087F75]/15 bg-[#F0FAF8] p-7 sm:p-10 lg:grid-cols-12 lg:p-12">
          {/* Identity & Location */}
          <div className="lg:col-span-7">
            <p className="text-sm font-medium text-[#087F75]">Kontak &amp; Lokasi</p>
            <h2 className="mt-2 font-[Plus_Jakarta_Sans] text-3xl font-bold tracking-tight text-[#064E48] sm:text-4xl">
              {businessConfig.brandName}
            </h2>

            <div className="mt-5 space-y-3 text-sm text-[#173C38]/85 sm:text-base">
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#087F75]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#064E48]">{businessConfig.city}</p>
                  {address ? (
                    <p className="mt-0.5 text-sm text-[#173C38]/75">{address}</p>
                  ) : (
                    <p className="mt-0.5 text-sm text-[#173C38]/70">
                      Alamat lengkap outlet akan diperbarui setelah lokasi resmi ditetapkan.
                    </p>
                  )}
                </div>
              </div>

              {openingHours && (
                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#087F75]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[#064E48]">Jam Operasional</p>
                    <p className="mt-0.5 text-sm text-[#173C38]/75">{openingHours}</p>
                  </div>
                </div>
              )}
            </div>

            {hasConfiguredLinks && (
              <div className="mt-7 flex flex-wrap gap-3">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl bg-[#087F75] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#064E48]"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span>Hubungi via WhatsApp</span>
                  </a>
                )}

                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-[#087F75]/25 bg-white px-5 py-2.5 text-sm font-semibold text-[#064E48] transition-colors hover:border-[#087F75]"
                  >
                    <MapPin className="h-4 w-4 text-[#087F75]" aria-hidden="true" />
                    <span>Buka Google Maps</span>
                  </a>
                )}

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-[#087F75]/25 bg-white px-5 py-2.5 text-sm font-semibold text-[#064E48] transition-colors hover:border-[#087F75]"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#087F75]" aria-hidden="true" />
                  </a>
                )}

                {tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-[#087F75]/25 bg-white px-5 py-2.5 text-sm font-semibold text-[#064E48] transition-colors hover:border-[#087F75]"
                  >
                    <span>TikTok</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#087F75]" aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Virtual Assistant Direct Entry */}
          <div className="rounded-2xl border border-[#087F75]/12 bg-white p-6 shadow-sm lg:col-span-5">
            <h3 className="font-[Plus_Jakarta_Sans] text-lg font-bold text-[#064E48]">
              Butuh Informasi Layanan?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#173C38]/75">
              Gunakan Gleh AI Assistant untuk menanyakan detail layanan laundry
              express, laundry koin, setrika kiloan, maupun estimasi biaya kapan
              saja.
            </p>
            <button
              type="button"
              onClick={onOpenChat}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#087F75] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#064E48] cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Buka Gleh AI Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
