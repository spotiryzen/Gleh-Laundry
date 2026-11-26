import {
  Clock,
  Droplets,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wind,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ADVANTAGES } from '../data/laundryData';

function AdvantageIcon({ id }: { id: string }) {
  switch (id) {
    case 'cepat':
      return <Clock className="h-5 w-5 text-[#087F75]" aria-hidden="true" />;
    case 'bersih':
      return <Droplets className="h-5 w-5 text-[#087F75]" aria-hidden="true" />;
    case 'harum':
      return <Wind className="h-5 w-5 text-[#087F75]" aria-hidden="true" />;
    case 'rapi':
      return <Sparkles className="h-5 w-5 text-[#087F75]" aria-hidden="true" />;
    case 'fleksibel':
      return <SlidersHorizontal className="h-5 w-5 text-[#087F75]" aria-hidden="true" />;
    default:
      return <ShieldCheck className="h-5 w-5 text-[#087F75]" aria-hidden="true" />;
  }
}

export function AdvantagesSection() {
  return (
    <section id="keunggulan" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#087F75]">Keunggulan Layanan</p>
          <h2 className="mt-2 text-balance font-[Plus_Jakarta_Sans] text-3xl font-bold tracking-tight text-[#064E48] sm:text-4xl">
            Standar Perawatan yang Rapi dan Terukur
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#173C38]/75">
            Setiap tahapan dirancang agar pakaian Anda diproses terpisah, bersih,
            dan terjaga kualitasnya sejak diterima hingga siap diambil.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-4 rounded-2xl border border-[#087F75]/12 bg-[#F0FAF8]/50 p-6 transition-colors duration-150 hover:border-[#087F75]/25 hover:bg-[#F0FAF8]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs">
                <AdvantageIcon id={item.id} />
              </div>
              <div>
                <h3 className="font-[Plus_Jakarta_Sans] text-lg font-bold text-[#064E48]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#173C38]/80">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
