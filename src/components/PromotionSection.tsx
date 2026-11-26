import { ArrowRight, Gift, GraduationCap, HeartHandshake, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { PLANNED_PROMOTIONS } from '../data/laundryData';

interface PromotionSectionProps {
  onAskPromo: (question: string) => void;
}

function PromoIcon({ id }: { id: string }) {
  switch (id) {
    case 'pelanggan-baru':
      return <Gift className="h-5 w-5 text-[#A8E6DC]" aria-hidden="true" />;
    case 'paket-anak-kost':
      return <GraduationCap className="h-5 w-5 text-[#A8E6DC]" aria-hidden="true" />;
    case 'paket-keluarga':
      return <Home className="h-5 w-5 text-[#A8E6DC]" aria-hidden="true" />;
    default:
      return <HeartHandshake className="h-5 w-5 text-[#A8E6DC]" aria-hidden="true" />;
  }
}

export function PromotionSection({ onAskPromo }: PromotionSectionProps) {
  return (
    <section id="promo" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#064E48] p-7 text-white sm:p-10 lg:p-12">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#A8E6DC]">
                Rencana Program Promo &amp; Langganan
              </p>
              <h2 className="mt-2 text-balance font-[Plus_Jakarta_Sans] text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Program yang Direncanakan untuk Kebutuhan Rutin Anda
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
                Seluruh program berikut merupakan bagian dari rencana pengembangan
                layanan Gleh Laundry. Ketentuan dan jadwal pelaksanaan akan
                diumumkan secara resmi saat beroperasi.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onAskPromo(
                  'Halo Gleh AI, boleh tahu informasi mengenai rencana program promo dan paket langganan di Gleh Laundry?'
                )
              }
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#064E48] transition-colors duration-150 hover:bg-[#A8E6DC] cursor-pointer"
            >
              <span>Tanyakan Program Promo</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANNED_PROMOTIONS.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col justify-between rounded-2xl border border-white/12 bg-white/6 p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <PromoIcon id={program.id} />
                    <span className="text-xs font-medium text-[#A8E6DC]">
                      Rencana Program
                    </span>
                  </div>
                  <h3 className="mt-4 font-[Plus_Jakarta_Sans] text-lg font-bold text-white">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {program.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
