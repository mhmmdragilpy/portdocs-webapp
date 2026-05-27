import React from "react";
import { db } from "@/db";
import { orders, clients } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import HistoryClient from "./HistoryClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Ambil data order untuk user yang sedang login, di-limit 50 untuk optimasi performa
  const userOrders = await db.select({
    id: orders.id,
    services: orders.services,
    subOption: orders.subOption,
    totalPrice: orders.totalPrice,
    status: orders.status,
    date: orders.createdAt,
    documents: orders.documents,
    clientName: clients.name
  })
  .from(orders)
  .innerJoin(clients, eq(orders.clientId, clients.id))
  .where(eq(clients.userId, user.id))
  .orderBy(desc(orders.createdAt))
  .limit(50);

  return <HistoryClient orders={userOrders} />;
}
