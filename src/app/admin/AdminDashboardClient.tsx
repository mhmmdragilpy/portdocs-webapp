"use client";

import React, { useState } from "react";
import { Download, Printer, ExternalLink, Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_FLOW = [
  "Menunggu Pembayaran",
  "Menunggu Verifikasi Pembayaran",
  "Menunggu Fisik Buku Lama",
  "Berkas Diverifikasi",
  "Proses Input Portal",
  "Selesai & Dalam Pengiriman"
];

export default function AdminDashboardClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrderForPreview, setSelectedOrderForPreview] = useState<any | null>(null);
  const router = useRouter();

  const handleStatusChange = async (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      router.refresh();
    } catch (error) {
      alert("Gagal merubah status pesanan.");
    }
  };

  const handleDownloadZip = (orderId: string) => {
    window.open(`/api/download?orderId=${orderId}`, '_blank');
  };

  const handlePrintLabel = (order: any) => {
    const printContent = `
      <div style="font-family: Arial; padding: 20px; border: 2px solid #000; width: 400px; border-radius: 8px;">
        <h2 style="margin-top: 0;">LABEL PENGIRIMAN</h2>
        <hr/>
        <p><strong>Penerima:</strong> ${order.clientName}</p>
        <p><strong>No. HP:</strong> ${order.phone || '-'}</p>
        <p><strong>Alamat:</strong> ${order.address}</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <br/>
        <p style="font-size: 12px; color: #666;">Dikirim dari: PortDocs Admin Center</p>
      </div>
    `;
    const printWindow = window.open('', '', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola pesanan klien dan unduh berkas draft.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Order ID</th>
                <th className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Klien</th>
                <th className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Layanan</th>
                <th className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">Bukti Bayar</th>
                <th className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status Tracking</th>
                <th className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-300 font-medium font-mono">{order.id}</td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{order.clientName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(order.date).toLocaleDateString('id-ID')}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {Array.isArray(order.services) && order.services.map((srv: string, i: number) => (
                        <span key={i} className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-600">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {order.paymentProofUrl ? (
                      <a 
                        href={`https://kruyvomdivteaouwkgyi.supabase.co/storage/v1/object/public/draft-files/${order.paymentProofUrl}`}
                        target="_blank" 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1 text-xs font-medium"
                      >
                        <ExternalLink className="w-3 h-3" /> Lihat
                      </a>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <select 
                      value={order.status || ''}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-3 py-1 outline-none appearance-none cursor-pointer border
                        ${order.status === 'Selesai & Dalam Pengiriman' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                          order.status?.includes('Menunggu') ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' : 
                          'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}
                      `}
                    >
                      {STATUS_FLOW.map(status => (
                        <option key={status} value={status} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedOrderForPreview(order)}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors group relative"
                        title="Lihat Detail Info Klien"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadZip(order.id)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-colors group relative"
                        title="Download Dokumen Klien (ZIP)"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePrintLabel(order)}
                        className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/20 rounded-lg transition-colors group relative"
                        title="Cetak Label Pengiriman"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-slate-500 dark:text-slate-400">Belum ada pesanan masuk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedOrderForPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detail Pesanan</h2>
              <button 
                onClick={() => setSelectedOrderForPreview(null)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Info Klien */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Informasi Klien</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Nama Lengkap</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-1">{selectedOrderForPreview.clientName}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">No. WhatsApp</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-1">{selectedOrderForPreview.phone || '-'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Jurusan</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-1 capitalize">{selectedOrderForPreview.major || '-'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Order ID</p>
                    <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-1 break-all">{selectedOrderForPreview.id}</p>
                  </div>
                </div>
              </div>

              {/* Alamat */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Alamat Domisili</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
                  <p className="text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap">{selectedOrderForPreview.address}</p>
                </div>
              </div>

              {/* Detail Layanan */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Layanan Diambil</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
                  <ul className="list-disc list-inside space-y-1 mb-4 text-sm text-slate-800 dark:text-slate-200">
                    {Array.isArray(selectedOrderForPreview.services) && selectedOrderForPreview.services.map((srv: string, i: number) => (
                      <li key={i} className="capitalize">
                        {srv.replace(/_/g, ' ')}
                        {srv === 'pergantian_buku_pelaut' && selectedOrderForPreview.subOption && (
                          <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium text-xs bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                            {selectedOrderForPreview.subOption.replace(/_/g, ' ')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Total Harga:</span>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">Rp {Number(selectedOrderForPreview.totalPrice).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Dokumen Terunggah */}
              {selectedOrderForPreview.documents && Object.keys(selectedOrderForPreview.documents).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Dokumen Klien</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedOrderForPreview.documents).map(([key, path]) => (
                      <a 
                        key={key} 
                        href={`https://kruyvomdivteaouwkgyi.supabase.co/storage/v1/object/public/draft-files/${path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                      >
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize truncate mr-2">{key.replace(/_/g, ' ')}</span>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Logistik */}
              {selectedOrderForPreview.trackingNumberLama && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Logistik (Buku Lama)</h3>
                  <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-lg border border-amber-200 dark:border-amber-500/20">
                    <p className="text-xs text-amber-700 dark:text-amber-500">Resi Pengiriman dari Klien:</p>
                    <p className="font-mono text-amber-900 dark:text-amber-400 mt-1 font-bold">{selectedOrderForPreview.trackingNumberLama}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button 
                onClick={() => setSelectedOrderForPreview(null)}
                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
