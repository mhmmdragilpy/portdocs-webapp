# ARCHITECTURE REFACTORING SPECIFICATION (refactor.md)

## 1. Ringkasan Refaktor
Dokumen ini memandu proses transformasi arsitektur dari model *Multi-Tier Middleware* (menggunakan Express.js terpisah) menuju model **Direct Client-to-Backend/Storage** yang jauh lebih optimal. 

### Target Efisiensi:
*   **Menghapus Express.js sepenuhnya** dari infrastruktur backend.
*   Mengalihkan seluruh proses penulisan data dan unggah berkas klien langsung dari browser ke Supabase SDK (`@supabase/supabase-js`).
*   Mengamankan data sipil langsung di level database menggunakan **Supabase Row Level Security (RLS)**.
*   Memanfaatkan **Next.js Route Handlers** (Serverless) *hanya* untuk kebutuhan krusial admin (seperti ekspor ZIP).

---

## 2. Perbandingan Alur Kerja (Sebelum vs Sesudah)

**Alur Lama (Inefisien & Risiko Timeout 10s Vercel):**

```

Klien HP ➔ Vercel Serverless (Express.js) ➔ Pemrosesan Berkas ➔ Supabase API ➔ Response

```

**Alur Baru (Optimized & Beban Kerja Rp 0):**

```

Klien HP ➔ Supabase Storage & Database via Client SDK (Menggunakan RLS & Presigned URL)

```

---

## 3. Langkah-Langkah Eksekusi Refaktor (Action Items)

### Langkah 1: Pembersihan Dependensi & Penghapusan Express.js
*   **Aksi:** Hapus folder `server/` atau file konfigurasi Express.js terpisah dari proyek Antigravity.
*   **Dependensi Baru:** Pastikan proyek Next.js menginstal SDK resmi Supabase:
```bash
    npm install @supabase/supabase-js
    ```

### Langkah 2: Migrasi Form Klien ke Direct Client SDK
Ubah fungsi *handling submit* pada halaman order klien agar tidak lagi menembak API Express (`fetch('/api/v1/submit')`), melainkan langsung memanggil fungsi bawaan Supabase:

1.  **Proses Unggah Berkas Berstatus Draft (Auto-Rename otomatis terjadi di browser):**
```javascript
    // Contoh implementasi di sisi klien
    const namaKlienClean = namaKlien.replace(/\s+/g, '_');
    const { data, error } = await supabase.storage
      .from('draft-berkas')
      .upload(`KTP_${namaKlienClean}.pdf`, fileKtp);
    ```
2.  **Proses Input Biodata & Alamat Pengantaran:**
```javascript
    const { error } = await supabase
      .from('pesanan')
      .insert([{ 
         nama_klien: namaKlien, 
         alamat_pengantaran: alamatLengkap,
         status_tracking: 'Menunggu Pembayaran'
      }]);
    ```

### Langkah 3: Konfigurasi Keamanan di Dasbor Supabase (Wajib)
Karena `SUPABASE_ANON_KEY` terekspos di sisi frontend klien, keamanan dipindahkan sepenuhnya ke level database:
1.  Masuk ke dasbor Supabase ➔ **Database** ➔ **Tables** ➔ Pilih tabel `pesanan` dan bucket `draft-berkas`.
2.  Klik **Enable Row Level Security (RLS)**.
3.  Buat **Policies (Aturan Akses)** baru:
*   *Aturan Klien:* Izinkan akses `INSERT` untuk semua pengguna umum (anonim). Sembunyikan akses `SELECT` massal.
*   *Aturan Admin:* Izinkan akses `ALL` (Select, Update, Delete) hanya jika pengguna terautentikasi sebagai role `Admin`.

### Langkah 4: Pengalihan Fungsi Admin ke Next.js Route Handlers
Fungsi kompresi ZIP untuk kebutuhan admin tidak boleh diletakkan di frontend. Buat file baru pada struktur Next.js App Router di `app/api/download-zip/route.js` untuk menggantikan tugas Express.js sebelumnya:

```javascript
// app/api/download-zip/route.js
import { NextResponse } from 'next/server';
import archiver from 'archiver';

export async function GET(request) {
    // 1. Validasi token sesi Admin di sini
    // 2. Tarik berkas dari Supabase Storage Privat
    // 3. Gabungkan berkas menjadi ZIP menggunakan 'archiver'
    // 4. Return file ZIP sebagai respons download
}

```

---

## 4. Keuntungan Hasil Refaktor bagi Proyek `portdocs-express`

1. **Bebas dari Timeout Error:** Mengunggah file KTP, KK, Ijazah, dan Surat Rekomendasi secara langsung ke Supabase Storage tidak akan memakan kuota *Serverless Timeout* 10 detik dari Vercel Free Tier.
2. **Performa Instan:** Mengeliminasi satu lapisan server (*Express.js middleware*) memotong waktu tunggu respons (*latency*) aplikasi hingga 40-50%.
3. **Struktur Kode Bersih:** Seluruh kode aplikasi kini berada di dalam satu repositori tunggal Next.js (*Monorepo*), memudahkan tim Antigravity untuk melakukan pelacakan bug dan pemeliharaan jangka panjang.

```
