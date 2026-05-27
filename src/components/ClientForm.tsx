"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calculator, CreditCard } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useRouter } from "next/navigation";

const SERVICES = [
  { id: 'buku_pelaut_baru', label: 'Buku Pelaut Baru', price: 800000, desc: 'Tanpa kirim fisik dokumen lama.' },
  { id: 'pergantian_buku_pelaut', label: 'Pergantian Buku Pelaut', price: 0, hasSubOptions: true, desc: 'Wajib kirim Buku Pelaut fisik lama.' },
  { id: 'perpanjangan_buku_pelaut', label: 'Perpanjangan Buku Pelaut', price: 250000, logistics: true, desc: 'Wajib kirim Buku Pelaut fisik lama ke kantor.' },
  { id: 'bst_baru', label: 'Sertifikat Basic Safety Training (BST) Baru', price: 1700000, desc: 'Pendaftaran diklat kompetensi awal.' },
  { id: 'revalidasi_bst', label: 'Revalidasi / Perpanjang Sertifikat Basic Safety Training (BST)', price: 1200000, desc: 'Wajib mengunggah foto Sertifikat BST lama.' },
  { id: 'ccm', label: 'Sertifikat Crowd and Crisis Management (CCM)', price: 1400000, desc: 'Crowd Management & Crisis Management.' },
  { id: 'sat', label: 'Sertifikat Security Awareness Training (SAT)', price: 1200000, desc: 'Security Awareness Training.' },
  { id: 'paspor_5', label: 'Paspor 5 Tahun', price: 1100000, desc: 'Wajib mengunggah Surat Rekomendasi.' },
  { id: 'paspor_10', label: 'Paspor 10 Tahun', price: 1500000, desc: 'Wajib mengunggah Surat Rekomendasi.' },
];

const SUB_OPTIONS = [
  { id: 'hapus_data', label: 'Hapus Data', price: 1200000 },
  { id: 'cv', label: 'CV', price: 1100000 },
  { id: 'hapus_cv', label: 'Hapus Data + CV', price: 1500000 },
  { id: 'reguler', label: 'Reguler (Halaman Penuh/Rusak)', price: 900000 },
];

type FormData = {
  name: string;
  phone: string;
  address: string;
  major: string;
  selectedServices: string[];
  subOptionPergantian: string;
  logisticResi?: string;
};

export default function ClientForm() {
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: { selectedServices: [], subOptionPergantian: '' }
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [step, setStep] = useState(1);

  const router = useRouter();

  const selectedServices = watch('selectedServices');
  const subOptionPergantian = watch('subOptionPergantian');

  // Dynamic conditions
  const requiresRecommendation = selectedServices.includes('paspor_5') || selectedServices.includes('paspor_10');
  const requiresBSTUpload = selectedServices.includes('revalidasi_bst');
  const requiresLogistics = selectedServices.includes('pergantian_buku_pelaut') || selectedServices.includes('perpanjangan_buku_pelaut');

  const handleFileChange = (key: string, fileData: any) => {
    if (fileData instanceof File) {
      setFiles(prev => ({ ...prev, [key]: fileData }));
    } else if (fileData.file5x5 && fileData.file3x4) {
      setFiles(prev => ({ 
        ...prev, 
        [`${key}_5x5`]: fileData.file5x5,
        [`${key}_3x4`]: fileData.file3x4
      }));
    }
  };

  useEffect(() => {
    let total = 0;
    selectedServices.forEach(srvId => {
      const srv = SERVICES.find(s => s.id === srvId);
      if (srv) {
        if (srv.id === 'pergantian_buku_pelaut' && subOptionPergantian) {
          const subOpt = SUB_OPTIONS.find(so => so.id === subOptionPergantian);
          if (subOpt) total += subOpt.price;
        } else {
          total += srv.price;
        }
      }
    });
    setTotalPrice(total);
  }, [selectedServices, subOptionPergantian]);

  const onSubmit = async (data: FormData) => {
    if (step === 1) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step === 2) {
      if (!files['payment_proof']) {
        alert("Mohon unggah bukti pembayaran / transfer.");
        return;
      }
      try {
        setIsSubmitting(true);
        const payload = { ...data, totalPrice };
        const formData = new window.FormData();
        formData.append('data', JSON.stringify(payload));
        Object.entries(files).forEach(([key, file]) => formData.append(key, file));

        const res = await fetch('/api/orders', { method: 'POST', body: formData });
        if (!res.ok) throw new Error("Gagal membuat pesanan");
        const result = await res.json();
        if (result.success) {
          alert("Pesanan berhasil dibuat! Anda akan dialihkan ke Riwayat Pesanan.");
          router.push(`/history`);
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat memproses pesanan.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Step 1: Formulir Data */}
      <div className={step === 1 ? 'space-y-10 animate-in fade-in' : 'hidden'}>
      {/* 1. Biodata */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-2">1. Informasi Pribadi</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Nama Lengkap</label>
            <input 
              {...register('name', { required: true })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Sesuai KTP"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Nomor WhatsApp</label>
            <input 
              {...register('phone', { required: true })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0812xxxx"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Alamat Pengiriman Domisili</label>
            <textarea 
              {...register('address', { required: true })}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Alamat lengkap beserta kodepos"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Jurusan</label>
            <select 
              {...register('major', { required: true })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
            >
              <option value="">Pilih Jurusan...</option>
              <option value="nautika">Nautika / Dek</option>
              <option value="teknika">Teknika / Mesin</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Layanan A la Carte */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-2 flex items-center justify-between">
          <span>2. Pilih Layanan (A la Carte)</span>
          <span className="text-sm font-normal text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-100 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
            <Calculator className="w-4 h-4" /> Kalkulasi Otomatis
          </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(srv => (
            <div key={srv.id} className={`relative p-4 rounded-xl border ${selectedServices.includes(srv.id) ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:border-slate-400 dark:hover:border-slate-500'} cursor-pointer transition-all`}>
              <label className="flex items-start gap-3 cursor-pointer w-full h-full">
                <div className="flex-shrink-0 mt-1">
                  <input 
                    type="checkbox" 
                    value={srv.id}
                    {...register('selectedServices')}
                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 bg-white dark:bg-slate-800"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{srv.label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{srv.desc}</p>
                  {srv.price > 0 && (
                    <p className="text-blue-600 dark:text-blue-400 font-semibold mt-2 text-sm">Rp {srv.price.toLocaleString('id-ID')}</p>
                  )}
                  {srv.price === 0 && <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-2 text-sm">Harga menyesuaikan sub-opsi</p>}
                </div>
              </label>
            </div>
          ))}
        </div>

        {selectedServices.includes('pergantian_buku_pelaut') && (
          <div className="mt-6 p-5 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/10 animate-in fade-in slide-in-from-top-4">
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-3">Pilih Jenis Pergantian Buku Pelaut:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUB_OPTIONS.map(sub => (
                <label key={sub.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer">
                  <input 
                    type="radio" 
                    value={sub.id} 
                    {...register('subOptionPergantian', { required: true })}
                    className="text-blue-600 focus:ring-blue-500 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{sub.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Rp {sub.price.toLocaleString('id-ID')}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Upload Dokumen */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-2">3. Unggah Dokumen</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader 
            label="Pas Foto" 
            isPassportPhoto 
            onImageProcessed={(f) => handleFileChange('pas_foto', f)}
            helperText="Kemeja putih lengan panjang, dasi hitam polos. Tajam dan tidak blur."
          />
          <ImageUploader label="KTP (Kartu Tanda Penduduk)" onImageProcessed={(f) => handleFileChange('ktp', f)} />
          <ImageUploader label="Kartu Keluarga (KK)" onImageProcessed={(f) => handleFileChange('kk', f)} />
          <ImageUploader label="Akte Kelahiran" onImageProcessed={(f) => handleFileChange('akte', f)} />
          <ImageUploader label="Ijazah Terakhir" onImageProcessed={(f) => handleFileChange('ijazah', f)} />
          
          {requiresRecommendation && (
            <div className="animate-in fade-in zoom-in duration-300">
              <ImageUploader 
                label="Surat Rekomendasi (Wajib untuk Paspor)" 
                onImageProcessed={(f) => handleFileChange('rekomendasi', f)}
              />
            </div>
          )}

          {requiresBSTUpload && (
            <div className="animate-in fade-in zoom-in duration-300">
              <ImageUploader 
                label="Sertifikat BST Lama (Wajib untuk Revalidasi)" 
                onImageProcessed={(f) => handleFileChange('bst_lama', f)}
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. Logistik Fisik (Dynamic) */}
      {requiresLogistics && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-2">4. Pengiriman Dokumen Fisik</h3>
          <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/10">
            <p className="text-sm text-amber-700 dark:text-amber-200 mb-4 font-medium">
              Layanan yang Anda pilih mewajibkan pengiriman BUKU PELAUT FISIK LAMA ke kantor kami. 
            </p>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Nomor Resi Pengiriman</label>
              <input 
                {...register('logisticResi')}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Contoh: JTE1234567890"
              />
            </div>
          </div>
        </div>
      )}
      </div> {/* Penutup Step 1 */}

      {/* Step 2: Pembayaran */}
      <div className={step === 2 ? 'space-y-8 animate-in fade-in slide-in-from-right-4' : 'hidden'}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Selesaikan Pembayaran</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Silakan transfer sesuai dengan total tagihan. Pesanan akan langsung diproses setelah bukti pembayaran Anda kami terima.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* QRIS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Metode QRIS</h3>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-center">
                <img src="/payment.svg" alt="QRIS Payment" className="max-w-[200px] w-full" />
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Transfer Bank</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-200 dark:border-blue-500/20">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">BCA</p>
                  <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">0070951606</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">a.n MUHAMMAD RAGIL</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-500/10 p-4 rounded-xl border border-orange-200 dark:border-orange-500/20">
                  <p className="text-sm font-semibold text-orange-900 dark:text-orange-300">BRI</p>
                  <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">168001007122507</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">a.n MUHAMMAD RAGIL</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Unggah Bukti Transfer</h3>
            <ImageUploader 
              label="Bukti Pembayaran / Transfer" 
              onImageProcessed={(f) => handleFileChange('payment_proof', f)}
            />
          </div>
        </div>
      </div>

      {/* Footer Invoice & Submit */}
      <div className="sticky bottom-4 z-40">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-lg">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Estimasi Biaya</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">Rp</span> {totalPrice.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row">
            {step === 2 && (
              <button 
                type="button" 
                onClick={() => {
                  setStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
              >
                Kembali
              </button>
            )}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CreditCard className="w-5 h-5" />
              {isSubmitting ? "Memproses..." : (step === 1 ? "Lanjut ke Pembayaran" : "Kirim Semua Data")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
