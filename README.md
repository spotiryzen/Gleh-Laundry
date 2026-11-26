# Gleh Laundry — Website Bisnis & Asisten Virtual (n8n)

Website resmi konsep usaha **Gleh Laundry** (*"Bersih, Harum dan Cepat."*) untuk wilayah **Banda Aceh, Indonesia**. Dibangun menggunakan React, TypeScript, Tailwind CSS, Lucide React, dan backend Express sebagai proxy aman untuk chatbot **Gleh AI Assistant** berbasis **n8n**.

---

## Fitur Utama

- **Single-Page Responsif (Mobile-First)**: Navigasi sticky dengan menu drawer seluler, Hero, Layanan, Estimasi Harga & Kalkulator Interaktif, Keunggulan, Cara Kerja (Full-Service & Self-Service), Rencana Program Promo, FAQ Akordeon Aksesibel, Kontak Konfigurabel, dan Footer.
- **Kalkulator Estimasi Biaya Laundry**: Mendukung perhitungan per kilogram (Reguler, Express 24/12/6 Jam, Setrika Kiloan) dan per siklus (Laundry Koin dengan rentang harga minimum–maksimum), format Rupiah (`id-ID`), serta validasi input.
- **Gleh AI Assistant (Integrasi n8n)**: Widget chat mengambang di kanan bawah dengan ID sesi unik (`crypto.randomUUID()`), tombol pertanyaan cepat, indikator mengetik, batas 1.000 karakter, pencegahan pengiriman ganda, serta rendering teks polos (tanpa raw HTML).
- **Proxy Server-Side (`/api/chat`)**: Menyimpan URL webhook dan kredensial autentikasi n8n tetap di sisi server, dilengkapi validasi input, rate limiting, timeout, dan proteksi URL keluar.

---

## Konfigurasi Lingkungan (`.env`)

Salin `.env.example` menjadi `.env`, lalu sesuaikan nilai berikut:

```env
# URL Webhook n8n (Server-side — Direkomendasikan)
N8N_WEBHOOK_URL="https://YOUR-N8N-INSTANCE.app.n8n.cloud/webhook/gleh-chat"

# Opsional: Header autentikasi webhook n8n (hanya disimpan di server)
N8N_WEBHOOK_AUTH_HEADER=""
N8N_WEBHOOK_AUTH_TOKEN=""

# Opsional: Hanya jika di-deploy sebagai static site tanpa server Node.js
VITE_N8N_WEBHOOK_URL=""
```

> **Catatan:** Selama `N8N_WEBHOOK_URL` belum diisi dengan URL n8n yang aktif, chatbot tidak menampilkan balasan tiruan (mock) dan akan menampilkan pesan fallback resmi secara aman.

---

## Kontrak Integrasi Webhook n8n

Konfigurasikan node **Webhook** di n8n dengan metode `POST` dan **Respond to Webhook** dengan format JSON berikut:

### Request yang dikirim ke n8n (`POST`, `Content-Type: application/json`)

```json
{
  "message": "Berapa harga laundry express 6 jam?",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Response yang diharapkan dari n8n (`200 OK`, `application/json`)

```json
{
  "success": true,
  "reply": "Estimasi harga express 6 jam adalah Rp18.000/kg.",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Jika menggunakan hosting statis dengan `VITE_N8N_WEBHOOK_URL`, pastikan header CORS (`Access-Control-Allow-Origin`) telah diaktifkan pada node Webhook n8n untuk domain website Anda.

---

## Mengisi Informasi Kontak & Logo Resmi

Buka file `src/config/business.ts` untuk mengisi informasi operasional begitu sudah resmi ditetapkan:

```ts
export const businessConfig: BusinessConfig = {
  brandName: 'Gleh Laundry',
  tagline: 'Bersih, Harum dan Cepat.',
  city: 'Banda Aceh, Indonesia',
  logoUrl: '',        // Contoh: '/logo-gleh.png' (letakkan di folder public/)
  whatsappNumber: '', // Contoh: '6281234567890'
  instagramUrl: '',   // Contoh: 'https://instagram.com/glehlaundry'
  tiktokUrl: '',      // Contoh: 'https://www.tiktok.com/@glehlaundry'
  googleMapsUrl: '',  // Contoh: 'https://maps.google.com/?q=...'
  address: '',        // Alamat lengkap outlet
  openingHours: '',   // Contoh: 'Setiap hari, 08.00 – 21.00 WIB'
};
```

Bidang yang dibiarkan kosong akan otomatis disembunyikan pada halaman Kontak dan Footer.

---

## Pengembangan Lokal & Deployment

### Instalasi & Pengembangan Lokal

```bash
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:3000` (frontend Vite + endpoint `/api/chat` Express).

### Build & Produksi

```bash
npm run build
NODE_ENV=production npm start
```

Untuk deployment pada layanan Node.js (Cloud Run, Railway, Render, VPS):
1. Atur variabel lingkungan `N8N_WEBHOOK_URL` (serta `N8N_WEBHOOK_AUTH_HEADER` & `N8N_WEBHOOK_AUTH_TOKEN` bila diperlukan).
2. Jalankan perintah build: `npm run build`.
3. Jalankan perintah start: `NODE_ENV=production npm start` (mendengarkan pada `PORT`, bawaan `3000`).
