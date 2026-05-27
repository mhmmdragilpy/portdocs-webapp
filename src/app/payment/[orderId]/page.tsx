import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import PaymentClient from './PaymentClient';

export default async function PaymentPage(props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const { orderId } = params;
  
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));

  if (!order) {
    notFound();
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 border border-blue-200 dark:border-blue-500/20 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pembayaran Pesanan</h1>
            <p className="text-slate-500 dark:text-slate-400">ID Pesanan: <span className="font-mono text-blue-600 dark:text-blue-400">{orderId}</span></p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total yang harus dibayar</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">
              <span className="text-blue-600 dark:text-blue-500">Rp</span> {Number(order.totalPrice).toLocaleString('id-ID')}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center mb-8 space-y-4">
            <p className="text-slate-700 dark:text-slate-300 font-medium">Scan QRIS berikut untuk membayar:</p>
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200 dark:border-none">
              <img src="/payment.jpeg" alt="QRIS Payment" className="max-w-xs w-full h-auto rounded-lg" />
            </div>
          </div>

          <PaymentClient orderId={orderId} />
        </div>
      </div>
    </div>
  );
}
