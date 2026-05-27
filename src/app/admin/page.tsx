"use client";

import React, { useState } from "react";
import { Search, Download, FileText, CheckCircle, Clock, Printer } from "lucide-react";

// Mock Data for demonstration
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    clientName: "Budi Santoso",
    services: ["Buku Pelaut Baru", "Sertifikat BST Baru"],
    totalPrice: 2500000,
    status: "Menunggu Pembayaran",
    date: "2026-05-27",
    address: "Jl. Merdeka No 1, Jakarta",
    safeClientName: "Budi_Santoso"
  },
  {
    id: "ORD-002",
    clientName: "Ahmad Surya",
    services: ["Pergantian Buku Pelaut (Hapus Data)"],
    totalPrice: 1200000,
    status: "Berkas Diverifikasi",
    date: "2026-05-26",
    address: "Jl. Pahlawan No 45, Surabaya",
    safeClientName: "Ahmad_Surya"
  },
  {
    id: "ORD-003",
    clientName: "Joko Anwar",
    services: ["Paspor 10 Tahun"],
    totalPrice: 1500000,
    status: "Proses Input Portal",
    date: "2026-05-25",
    address: "Jl. Sudirman 12, Medan",
    safeClientName: "Joko_Anwar"
  }
];

const STATUS_FLOW = [
  "Menunggu Pembayaran",
  "Menunggu Fisik Buku Lama",
  "Berkas Diverifikasi",
  "Proses Input Portal",
  "Selesai & Dalam Pengiriman"
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleDownloadZip = (safeClientName: string) => {
    // In a real app, this calls the API endpoint
    // window.location.href = `/api/download?clientId=${safeClientName}`;
    alert(`Mendownload draft_files_${safeClientName}.zip...`);
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
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari klien..."
              className="bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
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
                <th className="p-4 text-sm font-semibold text-slate-300">Status Tracking</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-sm text-slate-300 font-medium">{order.id}</td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-white">{order.clientName}</p>
                    <p className="text-xs text-slate-400">{order.date}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {order.services.map((srv, i) => (
                        <span key={i} className="inline-block px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded border border-slate-600">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-3 py-1 outline-none appearance-none cursor-pointer border
                        ${order.status === 'Selesai & Dalam Pengiriman' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          order.status === 'Menunggu Pembayaran' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
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
                        onClick={() => handleDownloadZip(order.safeClientName)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors group relative"
                        title="Download ZIP"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePrintLabel(order)}
                        className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors group relative"
                        title="Cetak Label"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
