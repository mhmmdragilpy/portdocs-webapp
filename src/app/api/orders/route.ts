import { NextResponse } from 'next/server';
import { db } from '@/db';
import { clients, orders } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Get logged in user if any
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    // 1. Insert Client
    const [client] = await db.insert(clients).values({
      userId: user?.id || null,
      name: data.name,
      phone: data.phone,
      address: data.address,
      major: data.major,
    }).returning({ id: clients.id });

    // 2. Insert Order
    const [order] = await db.insert(orders).values({
      clientId: client.id,
      services: data.selectedServices,
      subOption: data.subOptionPergantian || null,
      totalPrice: data.totalPrice,
      trackingNumberLama: data.logisticResi || null,
      documents: data.uploadedDocs || {},
      paymentProofUrl: data.paymentProofUrl || null,
    }).returning({ id: orders.id });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
