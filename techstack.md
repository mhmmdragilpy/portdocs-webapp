# TECH STACK ARCHITECTURE DOCUMENT

## 1. Ringkasan Arsitektur
Aplikasi ini dibangun menggunakan arsitektur **Serverless** berbasis komponen modern yang berfokus pada efisiensi biaya (Zero Operational Cost di tahap awal), skalabilitas tinggi, keamanan data sipil, serta performa *mobile-responsive* yang optimal. 

Seluruh logika backend diintegrasikan langsung ke dalam arsitektur serverless Next.js, dipadukan dengan layanan Object Storage dan Database dari Supabase.

---

## 2. Komponen Tech Stack

### 2.1 Front-End & Core Framework
*   **Framework Utama:** Next.js (Versi Terbaru)
    *   *Alasan:* Memanfaatkan App Router untuk performa rendering yang cepat dan fitur **Route Handlers (API Routes)**. Hal ini mengeliminasi kebutuhan untuk mengelola server Node.js/Express.js terpisah, karena backend otomatis berjalan sebagai *Serverless Functions*.
*   **Styling UI:** Tailwind CSS
    *   *Alasan:* Menjamin antarmuka yang 100% *Mobile-Responsive* bagi klien yang masuk dari tautan media sosial, serta mendukung performa pemuatan halaman yang sangat ringan.
*   **Client-Side Image Processing:** Cropper.js / React-Avatar-Editor
    *   *Alasan:* Menangani fitur **Auto-Format Foto** langsung di browser klien (memotong ke ukuran 5x5 dan 3x4). Hal ini memotong konsumsi bandwidth unggah dan menghemat beban komputasi server.

### 2.2 Back-End (Serverless APIs)
*   **Runtime Environment:** Node.js (via Vercel Serverless Functions)
    *   *Alasan:* Mengeksekusi logika validasi jenis layanan, manajemen status tracking, dan integrasi API Supabase.
*   **Library File Compression:** `archiver` / `jszip`
    *   *Alasan:* Digunakan di sisi serverless API untuk menggabungkan dokumen-dokumen di folder *Draft File* menjadi satu file `.zip` terkompresi secara instan saat admin melakukan unduhan massal.

### 2.3 Database & Storage Layer (Supabase Free Tier)
*   **Database Relasional:** PostgreSQL (Supabase)
    *   *Alasan:* Mengelola data teks terstruktur seperti biodata klien, alamat pengantaran akhir, data logistik nomor resi, serta *milestone* status pelacakan berkas.
*   **Object Storage:** Supabase Storage (Kuota: 1 GB Free Tier)
    *   *Alasan:* Berperan sebagai **Draft File Storage**. Berkas sipil klien (KTP, KK, Ijazah, Surat Rekomendasi) diisolasi di dalam bucket privat. Akses unduhan hanya diizinkan untuk admin melalui mekanisme *Presigned URL* (token kedaluwarsa otomatis).

---

## 3. Alur Logika Data & Berkas (*Data & File Workflow*)

### 3.1 Alur Unggah Berkas Klien (Mengatasi Batasan Timeout Vercel 10s)
Untuk menghindari kendala *Serverless Timeout* pada Vercel Free Tier saat mengunggah banyak berkas sipil sekaligus, aplikasi menggunakan metode **Direct Upload to Storage via Presigned URL**:
1. Klien mengisi form dan mengunggah berkas.
2. Aplikasi (Next.js) meminta token unggah privat ke Supabase Storage via Vercel API.
3. Vercel API merespons dengan memberikan *Presigned Upload URL* sekaligus **memformat nama berkas secara otomatis** menjadi `[JenisLayanan/NamaSurat]_[NamaKlien].[ekstensi]`.
4. Browser klien mengunggah file langsung (*direct upload*) ke Supabase Storage menggunakan URL terformat tersebut.
5. Setelah unggahan sukses, metadata file dan biodata teks disimpan ke database PostgreSQL Supabase.

### 3.2 Alur Unduh Berkas Admin (Mekanisme Draft File)
1. Admin membuka dasbor internal dan memilih klien berstatus `Berkas Diverifikasi`.
2. Admin mengklik tombol "Download Semua Berkas".
3. API Route di Vercel menarik berkas-berkas ter-rename dari Supabase Storage privat, membungkusnya ke dalam satu file `.zip`, dan langsung melemparnya ke browser admin.
4. Berkas siap di-input ke portal resmi Dephub / Imigrasi.

---

## 4. Infrastruktur & Rencana Deployment

*   **Hosting Frontend & API:** Vercel (Hobby/Free Tier)
*   **Hosting Database & Storage:** Supabase (Free Tier)
*   **Protokol Keamanan:** HTTPS / SSL (Dikelola otomatis secara penuh oleh Vercel)
*   **Enkripsi Penyimpanan:** Enkripsi data *at-rest* pada bucket Supabase Storage untuk menjamin keamanan dokumen sensitif milik klien.

---

## 5. Rencana Skalabilitas Masa Depan (*Backlog Infrastructure*)
Jika kuota gratis atau batasan serverless telah tercapai seiring bertambahnya volume transaksi bisnis, berikut adalah langkah migrasi infrastruktur yang direncanakan:
1. **Upgrade Supabase ke Pro Tier ($25/bulan):** Menghilangkan jeda otomatis database (*inactivity pause*) dan meningkatkan kuota penyimpanan file menjadi 50 GB.
2. **Containerization (Docker):** Membungkus aplikasi ke dalam Docker image untuk di-deploy ke VPS mandiri jika membutuhkan waktu eksekusi API (*timeout*) yang lebih dari 10 detik tanpa batasan serverless.