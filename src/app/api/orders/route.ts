import { NextResponse } from 'next/server';
import { db } from '@/db';
import { clients, orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const dataStr = formData.get('data') as string;
    
    if (!dataStr) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const data = JSON.parse(dataStr);
    
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
    }).returning({ id: orders.id });

    // 3. Upload all files to Supabase Storage
    const safeClientName = data.name.replace(/[^a-zA-Z0-9]/g, '_');
    const uploadedDocs: Record<string, string> = {};
    
    // Loop through FormData keys
    for (const [key, value] of Array.from(formData.entries())) {
      if (key !== 'data' && value instanceof File) {
        const file = value;
        const ext = file.name.split('.').pop();
        const newFileName = `${key}_${safeClientName}.${ext}`;
        const filePath = `${order.id}/${newFileName}`; // Better to group by orderId than clientName

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabaseAdmin
          .storage
          .from('draft-files')
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: true
          });

        if (uploadError) {
          console.error(`Error uploading ${key}:`, uploadError);
        } else {
          uploadedDocs[key] = filePath;
        }
      }
    }

    // 4. Update Order with uploaded documents
    if (Object.keys(uploadedDocs).length > 0) {
      await db.update(orders)
        .set({ documents: uploadedDocs })
        .where(eq(orders.id, order.id));
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
