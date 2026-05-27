"use client";

import React, { useState } from "react";
import { Search, Download, FileText, CheckCircle, Clock, Printer, ExternalLink } from "lucide-react";
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
  const router = useRouter();

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic UI update
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
    // Buka file zip yang dihasilkan server di tab baru (memicu download)
    window.open(`/api/download?orderId=${orderId}`, '_blank');
  };

  const handlePrintLabel = (order: any) => {
    const printContent = `
      <div style="font-family: Arial; padding: 20px; border: 2px solid #000; width: 400px; border-radius: 8px;">
        <h2 style="margin-top: 0;">LABEL PENGIRIMAN</h2>
        <hr/>
        <p><strong>Penerima:</strong> ${order.clientName}</p>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Kelola pesanan klien dan unduh berkas draft.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-300">Order ID</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Klien</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Layanan</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Bukti Bayar</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Status Tracking</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-xs text-slate-300 font-medium font-mono">{order.id}</td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-white">{order.clientName}</p>
                    <p className="text-xs text-slate-400">{new Date(order.date).toLocaleDateString('id-ID')}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {Array.isArray(order.services) && order.services.map((srv: string, i: number) => (
                        <span key={i} className="inline-block px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded border border-slate-600">
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
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs"
                      >
                        <ExternalLink className="w-3 h-3" /> Lihat
                      </a>
                    ) : (
                      <span className="text-slate-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <select 
                      value={order.status || ''}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-3 py-1 outline-none appearance-none cursor-pointer border
                        ${order.status === 'Selesai & Dalam Pengiriman' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          order.status?.includes('Menunggu') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                      `}
                    >
                      {STATUS_FLOW.map(status => (
                        <option key={status} value={status} className="bg-slate-800 text-white">{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDownloadZip(order.id)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors group relative"
                        title="Download Dokumen Klien (ZIP)"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePrintLabel(order)}
                        className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors group relative"
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
                  <td colSpan={6} className="text-center p-8 text-slate-400">Belum ada pesanan masuk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
