/**
 * Konfigurasi Bisnis Gleh Laundry
 *
 * Nilai yang belum ditetapkan sengaja dibiarkan kosong ("").
 * Tombol dan tautan untuk field yang kosong akan otomatis disembunyikan
 * hingga informasi resmi diisi oleh pengelola.
 */
export interface BusinessConfig {
  brandName: string;
  tagline: string;
  city: string;
  /** URL gambar logo resmi (opsional). Kosongkan untuk menampilkan logo teks bawaan. */
  logoUrl: string;
  /** Nomor WhatsApp dalam format internasional tanpa tanda +, mis. "6281234567890" */
  whatsappNumber: string;
  /** URL profil Instagram lengkap, mis. "https://instagram.com/glehlaundry" */
  instagramUrl: string;
  /** URL profil TikTok lengkap, mis. "https://www.tiktok.com/@glehlaundry" */
  tiktokUrl: string;
  /** URL lokasi Google Maps lengkap */
  googleMapsUrl: string;
  /** Alamat lengkap outlet setelah ditetapkan */
  address: string;
  /** Jam operasional resmi setelah ditetapkan */
  openingHours: string;
}

export const businessConfig: BusinessConfig = {
  brandName: 'Gleh Laundry',
  tagline: 'Bersih, Harum dan Cepat.',
  city: 'Banda Aceh, Indonesia',
  logoUrl: '',
  whatsappNumber: '',
  instagramUrl: '',
  tiktokUrl: '',
  googleMapsUrl: '',
  address: '',
  openingHours: '',
};

/**
 * Validasi URL eksternal agar hanya protokol https:// atau http:// yang diizinkan.
 */
export function getSafeExternalUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Membangun tautan WhatsApp aman jika nomor sudah dikonfigurasi.
 */
export function getWhatsAppUrl(rawNumber: string, defaultMessage?: string): string | null {
  const digitsOnly = rawNumber.replace(/[^\d]/g, '');
  if (digitsOnly.length < 9 || digitsOnly.length > 16) {
    return null;
  }

  const baseUrl = `https://wa.me/${digitsOnly}`;
  if (!defaultMessage) {
    return baseUrl;
  }
  return `${baseUrl}?text=${encodeURIComponent(defaultMessage)}`;
}
