import { useMemo, useState } from 'react';
import { Calculator, MessageCircle, Minus, Plus } from 'lucide-react';
import { formatRupiah, PRICING_ITEMS } from '../data/laundryData';

interface PriceCalculatorProps {
  onAskEstimate: (question: string) => void;
}

const MAX_KG = 100;
const MAX_CYCLES = 20;

export function PriceCalculator({ onAskEstimate }: PriceCalculatorProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(PRICING_ITEMS[0].id);
  const [quantityInput, setQuantityInput] = useState<string>('3');

  const selectedService = useMemo(
    () => PRICING_ITEMS.find((item) => item.id === selectedServiceId) ?? PRICING_ITEMS[0],
    [selectedServiceId]
  );

  const isCoinService = selectedService.mode === 'per_cycle';

  const handleServiceChange = (nextId: string) => {
    const nextService = PRICING_ITEMS.find((item) => item.id === nextId);
    setSelectedServiceId(nextId);
    if (nextService?.mode === 'per_cycle') {
      const parsed = Number(quantityInput);
      if (!Number.isFinite(parsed) || parsed < 1) {
        setQuantityInput('1');
      } else {
        setQuantityInput(String(Math.min(MAX_CYCLES, Math.max(1, Math.round(parsed)))));
      }
    } else if (!quantityInput || Number(quantityInput) <= 0) {
      setQuantityInput('3');
    }
  };

  const handleQuantityChange = (rawValue: string) => {
    // Izinkan field kosong sementara saat pengguna mengetik, tetapi blokir tanda minus/eksponen
    const cleaned = rawValue.replace(/[^0-9.,]/g, '').replace(',', '.');
    setQuantityInput(cleaned);
  };

  const parsedQuantity = useMemo(() => {
    if (quantityInput.trim() === '') return NaN;
    return Number(quantityInput);
  }, [quantityInput]);

  const validationError = useMemo(() => {
    if (quantityInput.trim() === '') {
      return isCoinService
        ? 'Masukkan jumlah siklus terlebih dahulu.'
        : 'Masukkan estimasi berat cucian dalam kilogram.';
    }
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return isCoinService
        ? 'Jumlah siklus minimal 1 siklus.'
        : 'Berat pakaian harus lebih dari 0 kg.';
    }
    if (isCoinService && !Number.isInteger(parsedQuantity)) {
      return 'Jumlah siklus harus berupa bilangan bulat (contoh: 1, 2, 3).';
    }
    if (isCoinService && parsedQuantity > MAX_CYCLES) {
      return `Maksimal simulasi adalah ${MAX_CYCLES} siklus.`;
    }
    if (!isCoinService && parsedQuantity > MAX_KG) {
      return `Maksimal simulasi adalah ${MAX_KG} kg.`;
    }
    return null;
  }, [isCoinService, parsedQuantity, quantityInput]);

  const adjustQuantity = (delta: number) => {
    const step = isCoinService ? 1 : 0.5;
    const base = Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : isCoinService ? 1 : 1;
    const maxVal = isCoinService ? MAX_CYCLES : MAX_KG;
    const minVal = isCoinService ? 1 : 0.5;
    const next = Math.min(maxVal, Math.max(minVal, Math.round((base + delta * step) * 10) / 10));
    setQuantityInput(String(next));
  };

  const estimateResult = useMemo(() => {
    if (validationError || !Number.isFinite(parsedQuantity)) {
      return null;
    }
    if (isCoinService && selectedService.minPrice && selectedService.maxPrice) {
      return {
        isRange: true,
        minTotal: selectedService.minPrice * parsedQuantity,
        maxTotal: selectedService.maxPrice * parsedQuantity,
      };
    }
    if (selectedService.unitPrice) {
      return {
        isRange: false,
        total: selectedService.unitPrice * parsedQuantity,
      };
    }
    return null;
  }, [isCoinService, parsedQuantity, selectedService, validationError]);

  const handleAskAboutEstimate = () => {
    if (!estimateResult) return;

    const qtyLabel = isCoinService
      ? `${parsedQuantity} siklus`
      : `${parsedQuantity} kg`;
    const priceLabel = estimateResult.isRange
      ? `${formatRupiah(estimateResult.minTotal!)}–${formatRupiah(estimateResult.maxTotal!)}`
      : formatRupiah(estimateResult.total!);

    onAskEstimate(
      `Halo Gleh AI, saya menghitung estimasi layanan ${selectedService.name} untuk ${qtyLabel} sekitar ${priceLabel}. Apakah ada informasi tambahan terkait layanan ini?`
    );
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#087F75]/15 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FAF8] text-[#087F75]">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-[Plus_Jakarta_Sans] text-lg font-bold text-[#064E48]">
              Kalkulator Estimasi Biaya
            </h3>
            <p className="text-xs text-[#173C38]/65">
              Simulasi cepat berdasarkan rencana tarif awal
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {/* Service Select */}
          <div>
            <label
              htmlFor="calculator-service"
              className="block text-sm font-medium text-[#173C38]"
            >
              Pilih Layanan Laundry
            </label>
            <select
              id="calculator-service"
              value={selectedServiceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="mt-2 block min-h-11 w-full rounded-xl border border-[#087F75]/20 bg-[#F0FAF8]/50 px-3.5 py-2.5 text-sm font-medium text-[#173C38] transition-colors focus:border-[#087F75] focus:bg-white"
            >
              {PRICING_ITEMS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.displayPrice}
                  {item.unitLabel})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Input (kg or cycles) */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="calculator-quantity"
                className="block text-sm font-medium text-[#173C38]"
              >
                {isCoinService ? 'Jumlah Siklus Mesin' : 'Perkiraan Berat Pakaian (kg)'}
              </label>
              <span className="text-xs text-[#173C38]/60">
                {isCoinService ? 'Satuan siklus' : 'Kelipatan 0,5 kg'}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                aria-label={isCoinService ? 'Kurangi 1 siklus' : 'Kurangi 0,5 kilogram'}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#087F75]/20 bg-white text-[#064E48] transition-colors hover:bg-[#F0FAF8] cursor-pointer"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="relative flex-1">
                <input
                  id="calculator-quantity"
                  type="text"
                  inputMode={isCoinService ? 'numeric' : 'decimal'}
                  value={quantityInput}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? 'calculator-error' : 'calculator-help'}
                  className="min-h-11 w-full rounded-xl border border-[#087F75]/20 bg-white px-4 py-2.5 pr-16 text-center text-base font-semibold tabular-nums text-[#064E48] focus:border-[#087F75]"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#173C38]/60">
                  {isCoinService ? 'siklus' : 'kg'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                aria-label={isCoinService ? 'Tambah 1 siklus' : 'Tambah 0,5 kilogram'}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#087F75]/20 bg-white text-[#064E48] transition-colors hover:bg-[#F0FAF8] cursor-pointer"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {validationError ? (
              <p
                id="calculator-error"
                role="alert"
                className="mt-2 text-xs font-medium text-red-700"
              >
                {validationError}
              </p>
            ) : (
              <p id="calculator-help" className="mt-2 text-xs text-[#173C38]/65">
                {selectedService.note}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Result Area */}
      <div className="mt-7 border-t border-[#087F75]/12 pt-6">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium text-[#173C38]/70">
            Total Estimasi Awal
          </span>
          <span className="text-xs font-medium text-[#087F75]">
            Bukan tagihan resmi
          </span>
        </div>

        <div
          aria-live="polite"
          className="mt-2 font-[Plus_Jakarta_Sans] text-2xl font-extrabold tabular-nums tracking-tight text-[#064E48] sm:text-3xl"
        >
          {estimateResult ? (
            estimateResult.isRange ? (
              <>
                {formatRupiah(estimateResult.minTotal!)}
                <span className="mx-1.5 font-normal text-[#087F75]/60">–</span>
                {formatRupiah(estimateResult.maxTotal!)}
              </>
            ) : (
              formatRupiah(estimateResult.total!)
            )
          ) : (
            <span className="text-[#173C38]/35">—</span>
          )}
        </div>

        <p className="mt-2 text-xs leading-relaxed text-[#173C38]/70">
          Hasil di atas hanya merupakan simulasi estimasi awal berdasarkan rencana
          harga, bukan tagihan atau konfirmasi pesanan resmi.
        </p>

        <button
          type="button"
          disabled={!estimateResult}
          onClick={handleAskAboutEstimate}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#087F75] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#064E48] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Tanyakan Estimasi ke Gleh AI</span>
        </button>
      </div>
    </div>
  );
}
