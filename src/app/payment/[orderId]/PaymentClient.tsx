"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentClient({ orderId }: { orderId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orderId', orderId);

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        alert("Gagal mengunggah bukti pembayaran.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">Pembayaran Berhasil Dikirim!</h3>
        <p className="text-slate-400 text-sm">Pesanan Anda sedang diverifikasi oleh tim kami. Anda akan dialihkan ke halaman utama...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 border-t border-slate-700/50 pt-8 mt-4">
      <h3 className="text-lg font-semibold text-white">Unggah Bukti Transfer</h3>
      <p className="text-sm text-slate-400">Pastikan nominal pada struk/bukti transfer sesuai dengan total yang tertera.</p>
      
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 hover:border-blue-500 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-300 font-medium">
              {file ? file.name : "Klik untuk memilih foto (JPG/PNG)"}
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? "Mengunggah..." : "Konfirmasi Pembayaran"}
      </button>
    </div>
  );
}
