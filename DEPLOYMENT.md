# Panduan Konfigurasi & Deployment AI Diagno

## 1. Arsitektur Backend & Database
Aplikasi ini menggunakan **Firebase (Firestore & Firebase Authentication)** untuk penyimpanan data persisten, otentikasi administrator berbasis peran (RBAC), serta keamanan aturan Firestore (`firestore.rules`).

Konfigurasi proyek Firebase didefinisikan di `firebase-applet-config.json`.

## 2. Koleksi Firestore & Skema Data
Struktur entitas dan koleksi terdokumentasi di `firebase-blueprint.json`:
- `admins`: Daftar akun administrator terotorisasi (`SUPER_ADMIN` / `EDITOR`).
- `site_settings`: Pengaturan global brand, kontak, dan metadata SEO.
- `homepage_content`: Konten beranda, halaman Tentang, serta kontrol visibilitas Demo.
- `products`: Kategori solusi (Smart LIS, Quality Intelligence, Laboratory Automation) beserta status fitur (`available`, `planned`, `custom_integration`).
- `pricing_plans`: Paket Starter, Professional, dan Enterprise (mendukung visibilitas harga, bulanan, tahunan, biaya implementasi, dan penawaran kustom).
- `articles`: Artikel edukasi pada halaman `/wawasan`.
- `media_assets`: Pustaka media CMS.
- `consultation_leads`: Permintaan konsultasi dari formulir `/kontak` (penulisan publik diperbolehkan dengan validasi ketat dan status awal `Baru`; pembacaan & pengelolaan dibatasi khusus administrator).
- `audit_logs`: Riwayat perubahan konten CMS yang bersifat *append-only*.

## 3. Pengaturan Administrator Awal (SUPER_ADMIN)
1. Buka rute `/admin`.
2. Masuk menggunakan akun Google terverifikasi (`manparta0101@gmail.com` dikonfigurasi sebagai `SUPER_ADMIN` awal di `firestore.rules`).
3. Pada Dashboard CMS, klik **Simpan Data Awal ke Firestore** untuk menyinkronkan konten awal ke database produksi.
4. Untuk menambahkan editor/admin tambahan, gunakan panel **Pengaturan Situs -> Kontrol Akses Berbasis Peran (RBAC)** dengan memasukkan Firebase UID dan email terverifikasi pengguna tersebut.

## 4. Deploy ke Vercel
1. Framework Preset: **Vite** (`Build Command`: `npm run build`, `Output Directory`: `dist`).
2. File `vercel.json` sudah disertakan agar seluruh rute SPA (`/admin`, `/kontak`, `/demo`, `/solusi/*`, dll.) tidak menghasilkan 404 saat di-refresh.
3. **Wajib untuk Login `/admin` di Vercel**: Buka **Firebase Console → Project `analog-platform-3bcxw` → Authentication → Settings → Authorized domains**, lalu tambahkan domain Vercel Anda (misalnya `nama-app.vercel.app` atau domain kustom Anda) agar tombol login Google di `/admin` diizinkan.

## 5. Validasi Aturan Keamanan & Build
- Lint aturan Firestore:
  `npx eslint firestore.rules`
- Verifikasi TypeScript:
  `npm run lint`
- Build produksi:
  `npm run build`
