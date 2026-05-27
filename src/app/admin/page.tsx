import React from "react";
import { db } from "@/db";
import { orders, clients } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import AdminDashboardClient from "@/app/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch real data from Drizzle
  const allOrders = await db.select({
    id: orders.id,
    clientId: clients.id,
    clientName: clients.name,
    phone: clients.phone,
    major: clients.major,
    address: clients.address,
    services: orders.services,
    subOption: orders.subOption,
    totalPrice: orders.totalPrice,
    status: orders.status,
    trackingNumberLama: orders.trackingNumberLama,
    date: orders.createdAt,
    paymentProofUrl: orders.paymentProofUrl,
    documents: orders.documents
  })
  .from(orders)
  .leftJoin(clients, eq(orders.clientId, clients.id))
  .orderBy(desc(orders.createdAt));

  return <AdminDashboardClient initialOrders={allOrders} />;
}
