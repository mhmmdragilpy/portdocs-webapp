# PRODUCT REQUIREMENT DOCUMENT (PRD)

## 1. Dokumen Kontrol & Ringkasan Eksekutif

*   **Nama Produk:** Web App Administrasi & Pelacakan Jasa Dokumen Pelaut & Paspor Super Cepat
*   **Versi:** 6.0 (Final - Opsi Spesifik Pergantian, Syarat Paspor, & Mekanisme Draft)
*   **Tanggal:** 27 Mei 2026
*   **Status:** *Ready for Execution*

### Ringkasan Eksekutif
Sistem ini memfasilitasi manajemen pendaftaran mandiri oleh Klien untuk berbagai jasa pengurusan dokumen maritim dan imigrasi dengan model *A la Carte* (layanan mandiri). 

Tujuan utama sistem ini adalah memotong waktu birokrasi admin secara drastis melalui mekanisme **Draft File Storage** (otomatisasi pengubahan nama file sejak disubmit) dan meminimalisasi kesalahan input klien melalui **Sistem Panduan Kontekstual** (*Tooltip & Helper Text*).

---

## 2. Struktur Pricelist & Katalog Layanan Utama (*A la Carte*)

Sistem akan menyimpan dan menampilkan daftar harga tetap berikut pada halaman utama kepada klien:

| No | Nama Layanan Utama | Keterangan Logistik / Berkas Khusus | Biaya (IDR) |
| :--- | :--- | :--- | :--- |
| 1 | **Buku Pelaut Baru** | Tanpa kirim fisik dokumen lama. | **Rp 800.000** |
| 2 | **Pergantian Buku Pelaut** | **Wajib kirim Buku Pelaut fisik lama.** Biaya tergantung sub-jenis pilihan. | *Dinamis* |
| 3 | **Perpanjangan Buku Pelaut** | **Wajib kirim Buku Pelaut fisik lama ke kantor.** | **Rp 250.000** |
| 4 | **Sertifikat BST Baru** | Pendaftaran diklat kompetensi awal. | **Rp 1.700.000** |
| 5 | **Revalidasi / Perpanjang BST** | **Wajib mengunggah foto Sertifikat BST lama.** | **Rp 1.200.000** |
| 6 | **Sertifikat CCM** | Crowd Management & Crisis Management. | **Rp 1.400.000** |
| 7 | **SAT** | Security Awareness Training. | **Rp 1.200.000** |
| 8 | **Paspor 5 Tahun** | **Wajib mengunggah Surat Rekomendasi.** | **Rp 1.100.000** |
| 9 | **Paspor 10 Tahun** | **Wajib mengunggah Surat Rekomendasi.** | **Rp 1.500.000** |

### 2.1 Opsi Percabangan: Jenis Pergantian Buku Pelaut
Jika layanan **"Pergantian Buku Pelaut"** dicentang oleh klien, sistem wajib menampilkan sub-opsi pilihan berikut yang akan mengubah nilai variabel harga utama secara dinamis:
*   **Hapus Data:** **Rp 1.200.000**
*   **CV:** **Rp 1.100.000**
*   **Hapus Data + CV:** **Rp 1.500.000**
*   **Reguler (Halaman Penuh/Rusak):** **Rp 900.000**

---

## 3. Alur Pengguna Akhir (*End-to-End User Journey*)
[Tahap 1: Pemasaran via DM] ➔ Klien klik link Web App
↓
[Tahap 2: Sisi Klien] ➔ Pilih Layanan Mandiri ➔ Isi Biodata, Jurusan, & Alamat Pengantaran ➔ Auto-Format Foto ➔ Upload Dokumen Sesuai Pilihan (Dipandu Helper Text) ➔ Bayar
↓
[Tahap 3: Sisi Admin] ➔ Berkas Otomatis Masuk ke "Draft File" (Auto-Rename Aktif) ➔ Terima Fisik Buku Lama (jika ada) ➔ Admin Unduh ZIP Rapi ➔ Input ke Portal Resmi (Dephub/Imigrasi)
↓
[Tahap 4: Penyelesaian] ➔ Admin Update Status ➔ Klien Track Online ➔ Cetak Label Alamat ➔ Kirim Fisik Dokumen Jadi ke Rumah Klien

---

## 4. Kebutuhan Fungsional (*Functional Requirements*)

### 4.1 Modul Klien (Front-Facing Web App)

#### **FR-01: Modul Katalog Layanan Interaktif & Multi-Kombinasi**
*   Sistem harus menyediakan komponen *checkbox* untuk 9 layanan utama.
*   Sistem harus dapat menghitung total kalkulasi biaya secara *real-time* di keranjang/invoice bawah saat pengguna menambah atau mengurangi layanan.

#### **FR-02: Sistem Panduan Kontekstual (*Tooltip & Helper Text*)**
Setiap field input wajib memiliki teks panduan yang jelas tepat di bawah kolom input:
*   *Input Nama:* "Isi sesuai e-KTP dengan huruf kapital. Hindari typo."
*   *Dropdown Jurusan:* "Nautika/Dek (Wajib foto latar **Biru**). Teknika/Mesin (Wajib foto latar **Merah**)."
*   *Input Alamat:* "Tulis alamat rumah lengkap saat ini untuk kurir mengirimkan dokumen fisik yang sudah jadi."
*   *Upload Pas Foto:* "Kemeja putih lengan panjang, dasi hitam polos. Tajam dan tidak blur. Sistem otomatis memotong ke ukuran 5x5 dan 3x4."
*   *Upload Surat Rekomendasi:* "Wajib diisi jika mengurus Paspor. Unggah surat keterangan resmi dari perusahaan/agen/sekolah diklat Anda (PDF/JPG)."

#### **FR-03: Fitur Auto-Format Foto**
*   Sistem mengintegrasikan fungsi *client-side cropping*. Saat pas foto diunggah, sistem otomatis memproses dan menyimpannya langsung ke dalam dua ukuran standar secara simultan: **5x5** dan **3x4**.

#### **FR-04: Manajemen Unggah Dokumen Dinamis & Alur Logistik**
*   **Kondisi Paspor:** Munculkan slot upload `Surat Rekomendasi` jika layanan Paspor dipilih.
*   **Kondisi Revalidasi BST:** Munculkan slot upload `Foto Sertifikat BST Lama` jika layanan Revalidasi dipilih.
*   **Kondisi Logistik Fisik:** Jika memilih layanan Perpanjangan/Pergantian Buku Pelaut, setelah data disubmit, sistem memunculkan halaman petunjuk alamat kantor pengumpulan fisik dokumen lama beserta form input `Nomor Resi Pengiriman Dokumen Lama`.

### 4.2 Modul Admin & Dasbor Internal (Back-End Dashboard)

#### **FR-05: Mekanisme Penyimpanan Berkas (*Draft File Storage*) & Auto-Rename**
*   Begitu klien melakukan submit, sistem langsung menyimpan berkas ke folder penyimpanan internal berstatus **Draft File**.
*   Sistem secara otomatis mengeksekusi fungsi pengubahan nama berkas (*Auto-Rename*) berdasarkan rumus baku: `[JenisLayanan/NamaSurat]_[NamaKlien].[ekstensi]`.
*   *Contoh Draft Terformat:* `KTP_Muhammad_Ragil.pdf`, `Surat_Rekomendasi_Paspor_Muhammad_Ragil.pdf`.
*   Saat Admin mengklik tombol **"Download Semua Berkas"**, sistem membungkus berkas-berkas ter-rename tersebut ke dalam satu file `.zip`. Admin menerima dokumen yang sudah rapi dan siap diunggah ke portal Dephub/Imigrasi tanpa edit manual.

#### **FR-06: Manajemen Status Pelacakan (*Tracking System*)**
*   Admin dibekali tombol kontrol untuk mengubah *milestone* progres klien (`Menunggu Pembayaran` ➔ `Menunggu Fisik Buku Lama` ➔ `Berkas Diverifikasi` ➔ `Proses Input Portal` ➔ `Selesai & Dalam Pengiriman`). Status ini merefleksikan tampilan halaman pelacakan klien secara *real-time*.

#### **FR-07: Fitur Cetak Label Pengiriman**
*   Menyediakan tombol satu kali klik untuk mengekspor data **Alamat Pengantaran Akhir** klien ke dalam format label siap cetak untuk ditempel pada amplop pengiriman dokumen jadi.

---

## 5. Kebutuhan Non-Fungsional (*Non-Functional Requirements*)

*   **Keamanan Data Sipil (Security):** Wajib menggunakan protokol HTTPS/SSL penuh. Dokumen di dalam folder *Draft File* harus diproteksi secara ketat dari akses publik luar menggunakan token enkripsi atau *Presigned URL*.
*   **Kecepatan & Responsivitas (UI/UX):** Antarmuka klien harus dioptimalkan secara penuh untuk perangkat seluler (*Mobile-Responsive*), mengingat link pemesanan diakses langsung dari konversi iklan media sosial (DM Instagram/WhatsApp).
*   **Validasi Tipe Berkas:** Sistem backend harus membatasi format file yang masuk ke folder *draft* hanya berupa `.pdf`, `.jpg`, `.jpeg`, dan `.png` dengan ukuran maksimal 5MB per file.

---

## 6. Rencana Pengembangan Masa Depan (*Backlog*)

*   **Integrasi Webhooks Notifikasi WhatsApp:** Sistem otomatis mengirimkan pesan WhatsApp ke nomor klien setiap kali admin memperbarui status pengerjaan dokumen.
*   **Ekstensi Chrome Form-Filler:** Pembuatan ekstensi browser khusus admin untuk menyuntikkan data dari folder *Draft File* ke situs resmi Dephub secara otomatis guna mengeliminasi proses *copy-paste* manual.