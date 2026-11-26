import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/laundryData';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="bg-[#F0FAF8] py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#087F75]">Pertanyaan Umum</p>
          <h2 className="mt-2 text-balance font-[Plus_Jakarta_Sans] text-3xl font-bold tracking-tight text-[#064E48] sm:text-4xl">
            Informasi Seputar Gleh Laundry
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#173C38]/75">
            Jawaban ringkas mengenai konsep layanan, estimasi harga, dan standar
            perawatan yang direncanakan.
          </p>
        </div>

        <div className="mt-10 divide-y divide-[#087F75]/12 rounded-2xl border border-[#087F75]/12 bg-white shadow-sm">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-button-${item.id}`;

            return (
              <div key={item.id} className="px-5 sm:px-7">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => handleToggle(item.id)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-[#087F75] cursor-pointer"
                  >
                    <span className="flex items-baseline gap-3 font-[Plus_Jakarta_Sans] text-base font-semibold text-[#064E48]">
                      <span className="text-xs font-semibold tabular-nums text-[#087F75]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{item.question}</span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#087F75] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-5 pl-7 pr-4 text-sm leading-relaxed text-[#173C38]/80"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
