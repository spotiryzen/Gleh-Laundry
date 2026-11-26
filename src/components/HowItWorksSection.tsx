import { useState } from 'react';
import { motion } from 'motion/react';
import { FULL_SERVICE_STEPS, SELF_SERVICE_STEPS, type ProcessStep } from '../data/laundryData';

type WorkflowMode = 'full' | 'self';

function StepList({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="mt-6 space-y-5">
      {steps.map((step) => (
        <li key={step.stepNumber} className="flex items-start gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0FAF8] font-[Plus_Jakarta_Sans] text-sm font-bold tabular-nums text-[#087F75]">
            {step.stepNumber}
          </span>
          <div className="pt-0.5">
            <h4 className="font-[Plus_Jakarta_Sans] text-base font-bold text-[#064E48]">
              {step.title}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-[#173C38]/75">
              {step.detail}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function HowItWorksSection() {
  const [mobileMode, setMobileMode] = useState<WorkflowMode>('full');

  return (
    <section id="cara-kerja" className="bg-[#F0FAF8] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#087F75]">Alur Layanan</p>
            <h2 className="mt-2 text-balance font-[Plus_Jakarta_Sans] text-3xl font-bold tracking-tight text-[#064E48] sm:text-4xl">
              Laundry Jadi Lebih Mudah
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#173C38]/75">
              Pilih kenyamanan layanan penuh oleh petugas atau kendali mandiri
              menggunakan mesin koin dalam empat langkah sederhana.
            </p>
          </div>

          {/* Mobile Segmented Control */}
          <div
            role="tablist"
            aria-label="Pilih alur layanan"
            className="inline-flex w-full rounded-xl border border-[#087F75]/15 bg-white p-1 md:hidden"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mobileMode === 'full'}
              onClick={() => setMobileMode('full')}
              className={`min-h-10 flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                mobileMode === 'full'
                  ? 'bg-[#087F75] text-white'
                  : 'text-[#173C38]/75 hover:text-[#064E48]'
              }`}
            >
              Full-Service
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobileMode === 'self'}
              onClick={() => setMobileMode('self')}
              className={`min-h-10 flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                mobileMode === 'self'
                  ? 'bg-[#087F75] text-white'
                  : 'text-[#173C38]/75 hover:text-[#064E48]'
              }`}
            >
              Self-Service
            </button>
          </div>
        </div>

        {/* Desktop Side-by-Side Comparison / Mobile Active Tab */}
        <div className="mt-10 grid gap-7 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-2xl border border-[#087F75]/12 bg-white p-6 shadow-sm sm:p-8 ${
              mobileMode === 'full' ? 'block' : 'hidden md:block'
            }`}
          >
            <p className="text-xs font-medium text-[#087F75]">Ditangani Petugas</p>
            <h3 className="mt-1 font-[Plus_Jakarta_Sans] text-2xl font-bold text-[#064E48]">
              Full-Service
            </h3>
            <p className="mt-1.5 text-sm text-[#173C38]/70">
              Untuk Laundry Express, Cuci + Lipat, Cuci + Setrika, dan Setrika Kiloan.
            </p>
            <StepList steps={FULL_SERVICE_STEPS} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-2xl border border-[#087F75]/12 bg-white p-6 shadow-sm sm:p-8 ${
              mobileMode === 'self' ? 'block' : 'hidden md:block'
            }`}
          >
            <p className="text-xs font-medium text-[#087F75]">Cuci Mandiri</p>
            <h3 className="mt-1 font-[Plus_Jakarta_Sans] text-2xl font-bold text-[#064E48]">
              Self-Service (Laundry Koin)
            </h3>
            <p className="mt-1.5 text-sm text-[#173C38]/70">
              Praktis bagi Anda yang ingin mencuci langsung dengan mesin sendiri.
            </p>
            <StepList steps={SELF_SERVICE_STEPS} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
