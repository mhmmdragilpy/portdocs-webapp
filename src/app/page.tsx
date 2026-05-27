import ClientForm from "@/components/ClientForm";
import { Ship, FileText, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-4 shadow-sm">
          <Ship className="w-4 h-4" />
          <span>Layanan Cepat & Terpercaya</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Urus Dokumen Pelaut <br className="hidden md:block" />
          <span className="text-blue-600 dark:text-blue-400">Lebih Mudah & Cepat</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          Pilih layanan yang Anda butuhkan, unggah dokumen secara mandiri, dan kami akan mengurus sisanya hingga dokumen fisik sampai di rumah Anda.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Harga Transparan</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Proses Otomatis</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Pelacakan Real-time</span>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section id="form" className="max-w-4xl mx-auto scroll-mt-24">
        <div className="bg-white/70 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-xl rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-700/50 pb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Formulir Pemesanan</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Pilih layanan A la Carte dan lengkapi biodata Anda.</p>
            </div>
          </div>
          
          <ClientForm />
        </div>
      </section>
    </div>
  );
}
