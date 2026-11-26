import { Info } from 'lucide-react';
import { motion } from 'motion/react';
import { PRICING_ITEMS } from '../data/laundryData';
import { PriceCalculator } from './PriceCalculator';

interface PricingSectionProps {
  onAskEstimate: (question: string) => void;
}

export function PricingSection({ onAskEstimate }: PricingSectionProps) {
  return (
    <section id="harga" className="bg-[#F0FAF8] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#087F75]">Daftar Rencana Tarif</p>
          <h2 className="mt-2 text-balance font-[Plus_Jakarta_Sans] text-3xl font-bold tracking-tight text-[#064E48] sm:text-4xl">
            Estimasi Harga Transparan
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#173C38]/75">
            Rincian rencana harga awal untuk memudahkan Anda memperkirakan biaya
            laundry harian maupun express.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-12">
          {/* Price List Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between rounded-2xl border border-[#087F75]/15 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#087F75]/12 pb-3 text-xs font-semibold tracking-wide text-[#173C38]/60 uppercase">
                <span>Jenis Layanan</span>
                <span>Estimasi Tarif</span>
              </div>

              <ul className="divide-y divide-[#087F75]/10">
                {PRICING_ITEMS.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div>
                      <p className="font-[Plus_Jakarta_Sans] text-base font-semibold text-[#064E48]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#173C38]/65">
                        {item.category} · {item.note}
                      </p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <span className="font-[Plus_Jakarta_Sans] text-base font-bold tabular-nums text-[#087F75] sm:text-lg">
                        {item.displayPrice}
                      </span>
                      <span className="text-xs font-medium text-[#173C38]/65">
                        {item.unitLabel}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#F0FAF8] p-4 text-xs leading-relaxed text-[#173C38]/85">
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-[#087F75]"
                aria-hidden="true"
              />
              <p>
                Harga merupakan estimasi awal dan dapat berubah setelah konfirmasi
                dengan pengelola.
              </p>
            </div>
          </motion.div>

          {/* Interactive Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <PriceCalculator onAskEstimate={onAskEstimate} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
