export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: 'express' | 'koin' | 'setrika';
  number: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  promptQuestion: string;
  imageSrc: string;
  imageAlt: string;
  highlights: string[];
}

export type PricingMode = 'per_kg' | 'per_cycle';

export interface PricingItem {
  id: string;
  name: string;
  category: 'Full-Service' | 'Express' | 'Setrika' | 'Self-Service';
  mode: PricingMode;
  unitPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  displayPrice: string;
  unitLabel: string;
  note: string;
}

export interface AdvantageItem {
  id: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  detail: string;
}

export interface PromotionProgram {
  id: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface QuickReplyItem {
  label: string;
  message: string;
}

export const HERO_IMAGE = {
  src: '/src/assets/images/hero_laundry_studio_1795660748966.jpg',
  alt: 'Interior studio laundry modern Gleh Laundry dengan deretan mesin cuci front-load stainless steel dan tumpukan handuk bersih terlipat rapi',
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Harga', href: '#harga' },
  { label: 'Keunggulan', href: '#keunggulan' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontak', href: '#kontak' },
];

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: 'express',
    number: '01',
    title: 'Laundry Express',
    subtitle: 'Full-Service · Reguler & Express',
    description:
      'Layanan pencucian oleh petugas dengan pilihan waktu pengerjaan reguler atau express.',
    ctaLabel: 'Tanya Laundry Express',
    promptQuestion:
      'Halo Gleh AI, bisa jelaskan detail layanan Laundry Express dan pilihan waktu pengerjaannya?',
    imageSrc: '/src/assets/images/service_laundry_express_1795660748930.jpg',
    imageAlt: 'Tumpukan pakaian katun bersih yang dilipat rapi di atas meja laundry yang cerah',
    highlights: ['Pilihan 24 jam, 12 jam, dan 6 jam', 'Pemisahan cucian per pelanggan'],
  },
  {
    id: 'koin',
    number: '02',
    title: 'Laundry Koin',
    subtitle: 'Self-Service · Per Siklus',
    description:
      'Cuci pakaian secara mandiri menggunakan mesin dengan pembayaran per siklus.',
    ctaLabel: 'Tanya Laundry Koin',
    promptQuestion:
      'Halo Gleh AI, bagaimana sistem penggunaan Laundry Koin dan estimasi biayanya per siklus?',
    imageSrc: '/src/assets/images/service_laundry_koin_1795660751066.jpg',
    imageAlt: 'Deretan mesin cuci dan pengering koin modern berwarna perak di ruang laundry mandiri',
    highlights: ['Kontrol penuh atas waktu cuci Anda', 'Pembayaran transparan per siklus'],
  },
  {
    id: 'setrika',
    number: '03',
    title: 'Setrika Kiloan',
    subtitle: 'Rapi & Siap Pakai · Per Kilogram',
    description:
      'Layanan setrika berdasarkan berat pakaian agar pakaian lebih rapi dan siap digunakan.',
    ctaLabel: 'Tanya Setrika',
    promptQuestion:
      'Halo Gleh AI, bagaimana ketentuan dan estimasi biaya untuk layanan Setrika Kiloan?',
    imageSrc: '/src/assets/images/service_setrika_kiloan_1795660750858.jpg',
    imageAlt: 'Kemeja bersih yang telah disetrika rapi tergantung di gantungan kayu minimalis',
    highlights: ['Hasil setrika licin dan rapi', 'Cocok untuk kemeja kerja & harian'],
  },
];

export const PRICING_ITEMS: PricingItem[] = [
  {
    id: 'cuci-lipat-reguler',
    name: 'Cuci + Lipat Reguler',
    category: 'Full-Service',
    mode: 'per_kg',
    unitPrice: 7000,
    displayPrice: 'Rp7.000',
    unitLabel: '/kg',
    note: 'Pencucian, pengeringan, dan pelipatan rapi oleh petugas.',
  },
  {
    id: 'cuci-setrika-reguler',
    name: 'Cuci + Setrika Reguler',
    category: 'Full-Service',
    mode: 'per_kg',
    unitPrice: 12000,
    displayPrice: 'Rp12.000',
    unitLabel: '/kg',
    note: 'Lengkap dari pencucian hingga setrika siap pakai.',
  },
  {
    id: 'express-24-jam',
    name: 'Express 24 Jam',
    category: 'Express',
    mode: 'per_kg',
    unitPrice: 12000,
    displayPrice: 'Rp12.000',
    unitLabel: '/kg',
    note: 'Rencana estimasi selesai dalam 24 jam.',
  },
  {
    id: 'express-12-jam',
    name: 'Express 12 Jam',
    category: 'Express',
    mode: 'per_kg',
    unitPrice: 15000,
    displayPrice: 'Rp15.000',
    unitLabel: '/kg',
    note: 'Rencana estimasi selesai lebih cepat dalam 12 jam.',
  },
  {
    id: 'express-6-jam',
    name: 'Express 6 Jam',
    category: 'Express',
    mode: 'per_kg',
    unitPrice: 18000,
    displayPrice: 'Rp18.000',
    unitLabel: '/kg',
    note: 'Prioritas pengerjaan singkat dalam estimasi 6 jam.',
  },
  {
    id: 'setrika-kiloan',
    name: 'Setrika Kiloan',
    category: 'Setrika',
    mode: 'per_kg',
    unitPrice: 6000,
    displayPrice: 'Rp6.000',
    unitLabel: '/kg',
    note: 'Khusus penyetrikaan pakaian bersih berdasarkan berat.',
  },
  {
    id: 'laundry-koin',
    name: 'Laundry Koin',
    category: 'Self-Service',
    mode: 'per_cycle',
    minPrice: 20000,
    maxPrice: 35000,
    displayPrice: 'Rp20.000–35.000',
    unitLabel: '/siklus',
    note: 'Cuci mandiri menggunakan mesin dengan tarif per siklus.',
  },
];

export const ADVANTAGES: AdvantageItem[] = [
  {
    id: 'cepat',
    title: 'Cepat',
    description: 'Estimasi pengerjaan jelas.',
  },
  {
    id: 'bersih',
    title: 'Bersih',
    description: 'Deterjen sesuai kebutuhan pakaian.',
  },
  {
    id: 'harum',
    title: 'Harum',
    description: 'Pewangi dengan aroma nyaman.',
  },
  {
    id: 'rapi',
    title: 'Rapi',
    description: 'Pakaian dilipat dan disetrika dengan baik.',
  },
  {
    id: 'fleksibel',
    title: 'Fleksibel',
    description: 'Full-service dan self-service.',
  },
  {
    id: 'terpercaya',
    title: 'Terpercaya',
    description: 'Pencatatan dan pemeriksaan pakaian.',
  },
];

export const FULL_SERVICE_STEPS: ProcessStep[] = [
  {
    stepNumber: '01',
    title: 'Pilih layanan',
    detail: 'Tentukan layanan reguler, express, atau setrika kiloan sesuai kebutuhan waktu Anda.',
  },
  {
    stepNumber: '02',
    title: 'Serahkan pakaian',
    detail: 'Pakaian ditimbang, dicatat, dan diberi label pesanan terpisah per pelanggan.',
  },
  {
    stepNumber: '03',
    title: 'Proses pencucian dan pemeriksaan',
    detail: 'Pencucian dengan deterjen sesuai jenis kain serta pemeriksaan kerapian sebelum selesai.',
  },
  {
    stepNumber: '04',
    title: 'Ambil pakaian',
    detail: 'Pakaian selesai dalam kondisi bersih, harum, terlipat atau terseterika rapi.',
  },
];

export const SELF_SERVICE_STEPS: ProcessStep[] = [
  {
    stepNumber: '01',
    title: 'Pilih mesin',
    detail: 'Pilih unit mesin cuci koin yang tersedia sesuai kapasitas muatan cucian Anda.',
  },
  {
    stepNumber: '02',
    title: 'Masukkan pakaian',
    detail: 'Masukkan pakaian serta deterjen yang sesuai ke dalam mesin dengan praktis.',
  },
  {
    stepNumber: '03',
    title: 'Jalankan siklus pencucian',
    detail: 'Lakukan pembayaran per siklus dan aktifkan mode pencucian pilihan Anda.',
  },
  {
    stepNumber: '04',
    title: 'Selesaikan proses laundry',
    detail: 'Keluarkan pakaian setelah siklus selesai dan lanjutkan pengeringan bila diperlukan.',
  },
];

export const PLANNED_PROMOTIONS: PromotionProgram[] = [
  {
    id: 'pelanggan-baru',
    title: 'Diskon pelanggan baru',
    description:
      'Direncanakan bagi pelanggan yang pertama kali mencoba layanan Gleh Laundry saat beroperasi.',
  },
  {
    id: 'paket-anak-kost',
    title: 'Paket anak kost',
    description:
      'Dirancang untuk kebutuhan cuci rutin mahasiswa dan penghuni kost dengan pengelolaan lebih hemat.',
  },
  {
    id: 'paket-keluarga',
    title: 'Paket keluarga',
    description:
      'Rencana solusi berlangganan berkala untuk volume cucian rumah tangga yang lebih besar.',
  },
  {
    id: 'pelanggan-loyal',
    title: 'Program pelanggan loyal',
    description:
      'Apresiasi khusus yang direncanakan bagi pelanggan tetap yang menggunakan layanan secara berkala.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Apa itu Gleh Laundry?',
    answer:
      'Gleh Laundry adalah konsep layanan laundry modern di Banda Aceh dengan layanan express, laundry koin, dan setrika kiloan.',
  },
  {
    id: 'faq-2',
    question: 'Berapa harga cuci dan lipat?',
    answer: 'Estimasi harga Rp7.000 per kilogram.',
  },
  {
    id: 'faq-3',
    question: 'Berapa harga cuci dan setrika?',
    answer: 'Estimasi harga Rp12.000 per kilogram.',
  },
  {
    id: 'faq-4',
    question: 'Apakah tersedia laundry express?',
    answer: 'Rencana layanan express tersedia dalam pilihan 24 jam, 12 jam, dan 6 jam.',
  },
  {
    id: 'faq-5',
    question: 'Bagaimana sistem laundry koin?',
    answer: 'Pelanggan mencuci sendiri menggunakan mesin dengan pembayaran per siklus.',
  },
  {
    id: 'faq-6',
    question: 'Berapa harga laundry koin?',
    answer: 'Estimasi Rp20.000 hingga Rp35.000 per siklus.',
  },
  {
    id: 'faq-7',
    question: 'Apakah tersedia layanan setrika saja?',
    answer:
      'Ya, dalam rencana layanan setrika kiloan dengan estimasi Rp6.000 per kilogram.',
  },
  {
    id: 'faq-8',
    question: 'Bagaimana mencegah pakaian tertukar?',
    answer:
      'Standar operasional yang direncanakan meliputi pelabelan, pemisahan, pencatatan, dan pemeriksaan.',
  },
  {
    id: 'faq-9',
    question: 'Di mana lokasi Gleh Laundry?',
    answer: 'Wilayah Banda Aceh. Alamat lengkap belum ditetapkan.',
  },
  {
    id: 'faq-10',
    question: 'Apakah tersedia paket langganan?',
    answer:
      'Paket anak kost, keluarga, dan program loyalitas merupakan bagian dari rencana pengembangan usaha.',
  },
];

export const CHATBOT_WELCOME_MESSAGE =
  'Halo! Selamat datang di Gleh Laundry. Saya Gleh AI, asisten virtual yang siap membantu Anda mengetahui layanan, estimasi harga, dan informasi seputar laundry. Ada yang bisa saya bantu?';

export const CHATBOT_FALLBACK_MESSAGE =
  'Maaf, layanan asisten virtual sedang tidak dapat diakses. Silakan coba kembali beberapa saat lagi.';

export const CHATBOT_QUICK_REPLIES: QuickReplyItem[] = [
  { label: 'Daftar Harga', message: 'Boleh lihat daftar estimasi harga layanan Gleh Laundry?' },
  { label: 'Laundry Express', message: 'Bagaimana detail layanan Laundry Express 24 jam, 12 jam, dan 6 jam?' },
  { label: 'Laundry Koin', message: 'Bagaimana cara kerja dan estimasi biaya Laundry Koin?' },
  { label: 'Setrika Kiloan', message: 'Berapa estimasi harga layanan Setrika Kiloan?' },
  { label: 'Hitung Biaya Laundry', message: 'Bantu saya menghitung estimasi biaya laundry pakaian saya.' },
  { label: 'Promo & Langganan', message: 'Apa saja rencana program promo dan paket langganan di Gleh Laundry?' },
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(Math.round(amount))
    .replace(/\s+/g, '');
}
