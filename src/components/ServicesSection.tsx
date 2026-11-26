import { ArrowUpRight, Shirt, Timer, WashingMachine } from 'lucide-react';
import { motion } from 'motion/react';
import { CORE_SERVICES, type ServiceItem } from '../data/laundryData';
import { SafeImage } from './SafeImage';

interface ServicesSectionProps {
  onAskService: (question: string) => void;
}

function ServiceIcon({ id }: { id: ServiceItem['id'] }) {
  switch (id) {
    case 'express':
      return <Timer className="h-5 w-5 text-[#087F75]" aria-hidden="true" />;
    case 'koin':
      return <WashingMachine className="h-5 w-5 text-[#087F75]" aria-hidden="true" />;
    case 'setrika':
      return <Shirt className="h-5 w-5 text-[#087F75]" aria-hidden="true" />;
  }
}

export function ServicesSection({ onAskService }: ServicesSectionProps) {
  return (
    <section id="layanan" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#087F75]">Layanan Utama</p>
          <h2 className="mt-2 text-balance font-[Plus_Jakarta_Sans] text-3xl font-bold tracking-tight text-[#064E48] sm:text-4xl">
            Pilihan Laundry Sesuai Kebutuhan Anda
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#173C38]/75">
            Tersedia opsi layanan penuh oleh petugas maupun cuci mandiri agar Anda
            dapat menyesuaikan waktu dan kenyamanan sesuai rutinitas harian.
          </p>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {CORE_SERVICES.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#087F75]/12 bg-white transition-shadow duration-200 hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F0FAF8]">
                <SafeImage
                  src={service.imageSrc}
                  alt={service.imageAlt}
                  fallbackLabel={service.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#173C38]/60">
                    {service.number}. {service.subtitle}
                  </span>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0FAF8]">
                    <ServiceIcon id={service.id} />
                  </div>
                </div>

                <h3 className="mt-3 font-[Plus_Jakarta_Sans] text-xl font-bold text-[#064E48]">
                  {service.title}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-[#173C38]/80">
                  {service.description}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-[#087F75]/10 pt-4 text-xs text-[#173C38]/70">
                  {service.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => onAskService(service.promptQuestion)}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#087F75]/25 bg-[#F0FAF8] px-4 py-2.5 text-sm font-semibold text-[#064E48] transition-colors duration-150 hover:border-[#087F75] hover:bg-[#087F75] hover:text-white cursor-pointer"
                  >
                    <span>{service.ctaLabel}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
