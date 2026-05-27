"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FileText, Clock, CheckCircle, Package, Eye } from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  "Menunggu Pembayaran": { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30", icon: <Clock className="w-4 h-4" /> },
  "Diproses": { color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30", icon: <CheckCircle className="w-4 h-4" /> },
  "Selesai": { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30", icon: <Package className="w-4 h-4" /> }
};

export default function HistoryClient({ orders }: { orders: any[] }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <FileText className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum Ada Pesanan</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Anda belum pernah membuat pesanan dokumen apapun.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Buat Pesanan Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Riwayat Pesanan</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Pantau status pesanan dan dokumen Anda di sini.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Menunggu Pembayaran"];
          const servicesList = Array.isArray(order.services) ? order.services : JSON.parse(order.services || '[]');
          
          return (
            <div key={order.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    ID Pesanan: <span className="font-mono text-slate-700 dark:text-slate-300">{order.id.slice(0, 8).toUpperCase()}</span>
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {order.date ? format(new Date(order.date), "dd MMMM yyyy, HH:mm", { locale: idLocale }) : "-"}
                  </p>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium w-fit ${statusCfg.color}`}>
                  {statusCfg.icon}
                  {order.status}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Layanan yang Dipesan:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {servicesList.map((srv: string) => (
                    <span key={srv} className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-xs">
                      {srv.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  ))}
                  {order.subOption && (
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs border border-blue-200 dark:border-blue-800">
                      Sub-Opsi: {order.subOption.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Biaya</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Rp {Number(order.totalPrice || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                  
                  {order.status === 'Menunggu Pembayaran' && (
                    <Link href={`/payment/${order.id}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 px-4 py-2 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" /> Lihat Detail / Bayar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
