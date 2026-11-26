import { ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_IMAGE } from '../data/laundryData';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  onOpenChat: () => void;
}

export function HeroSection({ onOpenChat }: HeroSectionProps) {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-[#F0FAF8] py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-6"
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-[#087F75] uppercase">
              LAUNDRY MODERN DI BANDA ACEH
            </p>

            <h1 className="mt-4 text-balance font-[Plus_Jakarta_Sans] text-[clamp(2.35rem,4.5vw,3.85rem)] font-extrabold leading-[1.1] tracking-tight text-[#064E48]">
              Bersih, Harum dan Cepat.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#173C38]/80 sm:text-lg">
              Solusi laundry praktis dan fleksibel untuk keluarga, mahasiswa, dan
              aktivitas sehari-hari Anda.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#layanan"
                className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-xl bg-[#087F75] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#064E48]"
              >
                <span>Lihat Layanan</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-xl border border-[#087F75]/25 bg-white px-6 py-3 text-sm font-semibold text-[#064E48] transition-colors duration-150 hover:border-[#087F75] hover:bg-[#F0FAF8] cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 text-[#087F75]" aria-hidden="true" />
                <span>Tanya Gleh AI</span>
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#087F75]/12 pt-6 text-sm text-[#173C38]/75">
              <span>Laundry Express</span>
              <span aria-hidden="true" className="text-[#087F75]/40">·</span>
              <span>Laundry Koin Mandiri</span>
              <span aria-hidden="true" className="text-[#087F75]/40">·</span>
              <span>Setrika Kiloan</span>
            </div>
          </motion.div>

          {/* Photography Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#087F75]/12 bg-white shadow-sm lg:h-full lg:aspect-auto">
              <SafeImage
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                loading="eager"
                fallbackLabel="Gleh Laundry — Banda Aceh"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
