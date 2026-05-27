"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Info, Calculator, CreditCard } from "lucide-react";
import ImageUploader from "./ImageUploader";

const SERVICES = [
  { id: 'buku_pelaut_baru', label: 'Buku Pelaut Baru', price: 800000, desc: 'Tanpa kirim fisik dokumen lama.' },
  { id: 'pergantian_buku_pelaut', label: 'Pergantian Buku Pelaut', price: 0, hasSubOptions: true, desc: 'Wajib kirim Buku Pelaut fisik lama.' },
  { id: 'perpanjangan_buku_pelaut', label: 'Perpanjangan Buku Pelaut', price: 250000, logistics: true, desc: 'Wajib kirim Buku Pelaut fisik lama ke kantor.' },
  { id: 'bst_baru', label: 'Sertifikat BST Baru', price: 1700000, desc: 'Pendaftaran diklat kompetensi awal.' },
  { id: 'revalidasi_bst', label: 'Revalidasi / Perpanjang BST', price: 1200000, desc: 'Wajib mengunggah foto Sertifikat BST lama.' },
  { id: 'ccm', label: 'Sertifikat CCM', price: 1400000, desc: 'Crowd Management & Crisis Management.' },
  { id: 'sat', label: 'SAT', price: 1200000, desc: 'Security Awareness Training.' },
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
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<FormData>({
    defaultValues: { selectedServices: [], subOptionPergantian: '' }
  });

  const [totalPrice, setTotalPrice] = useState(0);

  const selectedServices = watch('selectedServices');
  const subOptionPergantian = watch('subOptionPergantian');

  // Dynamic conditions
  const requiresRecommendation = selectedServices.includes('paspor_5') || selectedServices.includes('paspor_10');
  const requiresBSTUpload = selectedServices.includes('revalidasi_bst');
  const requiresLogistics = selectedServices.includes('pergantian_buku_pelaut') || selectedServices.includes('perpanjangan_buku_pelaut');

  // Calculate Price
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

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted", data);
    // TODO: Connect to backend for upload and DB insert
    alert("Pesanan berhasil disubmit! Total: Rp " + totalPrice.toLocaleString('id-ID'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* 1. Biodata */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white border-b border-slate-700/50 pb-2">1. Informasi Pribadi</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">Nama Lengkap</label>
            <input 
              {...register('name', { required: true })}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Sesuai KTP"
            />
            <p className="text-xs text-slate-400 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Isi sesuai e-KTP dengan huruf kapital. Hindari typo.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">Nomor WhatsApp</label>
            <input 
              {...register('phone', { required: true })}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0812xxxx"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-200">Alamat Pengiriman Domisili</label>
            <textarea 
              {...register('address', { required: true })}
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Alamat lengkap beserta kodepos"
            />
            <p className="text-xs text-slate-400 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Tulis alamat rumah lengkap saat ini untuk kurir mengirimkan dokumen fisik yang sudah jadi.
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-200">Jurusan</label>
            <select 
              {...register('major', { required: true })}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
            >
              <option value="">Pilih Jurusan...</option>
              <option value="nautika">Nautika / Dek</option>
              <option value="teknika">Teknika / Mesin</option>
            </select>
            <p className="text-xs text-slate-400 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Nautika/Dek (Wajib foto latar Biru). Teknika/Mesin (Wajib foto latar Merah).
            </p>
          </div>
        </div>
      </div>

      {/* 2. Layanan A la Carte */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white border-b border-slate-700/50 pb-2 flex items-center justify-between">
          <span>2. Pilih Layanan (A la Carte)</span>
          <span className="text-sm font-normal text-blue-400 flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            <Calculator className="w-4 h-4" /> Kalkulasi Otomatis
          </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(srv => (
            <div key={srv.id} className={`relative p-4 rounded-xl border ${selectedServices.includes(srv.id) ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'} cursor-pointer transition-all`}>
              <label className="flex items-start gap-3 cursor-pointer w-full h-full">
                <div className="flex-shrink-0 mt-1">
                  <input 
                    type="checkbox" 
                    value={srv.id}
                    {...register('selectedServices')}
                    className="w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-800"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{srv.label}</p>
                  <p className="text-sm text-slate-400 mt-1">{srv.desc}</p>
                  {srv.price > 0 && (
                    <p className="text-blue-400 font-semibold mt-2 text-sm">Rp {srv.price.toLocaleString('id-ID')}</p>
                  )}
                  {srv.price === 0 && <p className="text-emerald-400 font-semibold mt-2 text-sm">Harga menyesuaikan sub-opsi</p>}
                </div>
              </label>
            </div>
          ))}
        </div>

        {/* Dynamic Sub Options for Pergantian Buku Pelaut */}
        {selectedServices.includes('pergantian_buku_pelaut') && (
          <div className="mt-6 p-5 rounded-xl border border-blue-500/30 bg-blue-900/10 animate-in fade-in slide-in-from-top-4">
            <label className="block text-sm font-medium text-blue-300 mb-3">Pilih Jenis Pergantian Buku Pelaut:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUB_OPTIONS.map(sub => (
                <label key={sub.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 cursor-pointer">
                  <input 
                    type="radio" 
                    value={sub.id} 
                    {...register('subOptionPergantian', { required: true })}
                    className="text-blue-500 focus:ring-blue-500 bg-slate-900"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{sub.label}</p>
                    <p className="text-xs text-slate-400">Rp {sub.price.toLocaleString('id-ID')}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Upload Dokumen */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white border-b border-slate-700/50 pb-2">3. Unggah Dokumen</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader 
            label="Pas Foto" 
            isPassportPhoto 
            helperText="Kemeja putih lengan panjang, dasi hitam polos. Tajam dan tidak blur. Sistem otomatis memotong ke ukuran 5x5 dan 3x4."
          />
          <ImageUploader label="KTP (Kartu Tanda Penduduk)" />
          <ImageUploader label="Kartu Keluarga (KK)" />
          <ImageUploader label="Akte Kelahiran" />
          <ImageUploader label="Ijazah Terakhir" />
          
          {requiresRecommendation && (
            <div className="animate-in fade-in zoom-in duration-300">
              <ImageUploader 
                label="Surat Rekomendasi (Wajib untuk Paspor)" 
                helperText="Unggah surat keterangan resmi dari perusahaan/agen/sekolah diklat Anda (PDF/JPG)."
              />
            </div>
          )}

          {requiresBSTUpload && (
            <div className="animate-in fade-in zoom-in duration-300">
              <ImageUploader 
                label="Sertifikat BST Lama (Wajib untuk Revalidasi)" 
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. Logistik Fisik (Dynamic) */}
      {requiresLogistics && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-semibold text-white border-b border-slate-700/50 pb-2">4. Pengiriman Dokumen Fisik</h3>
          <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-900/10">
            <p className="text-sm text-amber-200 mb-4 font-medium">
              Layanan yang Anda pilih mewajibkan pengiriman BUKU PELAUT FISIK LAMA ke kantor kami. 
              Silakan kirimkan ke alamat: <br/><br/>
              <span className="text-white font-bold block bg-slate-900/50 p-3 rounded mt-2">
                Jl. Pelabuhan Utama No. 123, Jakarta Utara, 14310. (UP: Admin PortDocs)
              </span>
            </p>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">Nomor Resi Pengiriman (Opsional sekarang, bisa diinfokan nanti)</label>
              <input 
                {...register('logisticResi')}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Contoh: JTE1234567890"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Invoice & Submit */}
      <div className="sticky bottom-4 z-40">
        <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-blue-500/30">
          <div>
            <p className="text-sm text-slate-400">Total Estimasi Biaya</p>
            <p className="text-3xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-400">Rp</span> {totalPrice.toLocaleString('id-ID')}
            </p>
          </div>
          <button 
            type="submit" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Submit & Bayar
          </button>
        </div>
      </div>
    </form>
  );
}
