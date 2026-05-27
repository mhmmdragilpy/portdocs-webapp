import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { clients, orders } from '../src/db/schema';

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL as string, { prepare: false });
const db = drizzle(client);

async function main() {
  console.log("Menjalankan database seeding...");

  try {
    // Klien 1
    const [client1] = await db.insert(clients).values({
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123, Jakarta Pusat, 10110",
      major: "nautika"
    }).returning({ id: clients.id });

    await db.insert(orders).values({
      clientId: client1.id,
      services: ['buku_pelaut_baru', 'bst_baru'],
      totalPrice: '2500000',
      status: 'Menunggu Pembayaran',
      trackingNumberLama: null,
      documents: { "ktp": "dummy/ktp_budi.pdf", "pas_foto_5x5": "dummy/foto_budi.jpg" }
    });

    // Klien 2
    const [client2] = await db.insert(clients).values({
      name: "Siti Aminah",
      phone: "085678901234",
      address: "Komp. Pelindo Raya Blok C/4, Surabaya, 60121",
      major: "teknika"
    }).returning({ id: clients.id });

    await db.insert(orders).values({
      clientId: client2.id,
      services: ['pergantian_buku_pelaut'],
      subOption: 'hapus_data',
      totalPrice: '1200000',
      status: 'Proses Input Portal',
      trackingNumberLama: 'JNT9988776655',
      documents: { "ktp": "dummy/ktp_siti.pdf", "ijazah": "dummy/ijazah_siti.pdf" }
    });

    // Klien 3
    const [client3] = await db.insert(clients).values({
      name: "Andi Wijaya",
      phone: "081122334455",
      address: "Jl. Pahlawan No. 45, Makassar, 90231",
      major: "nautika"
    }).returning({ id: clients.id });

    await db.insert(orders).values({
      clientId: client3.id,
      services: ['paspor_10'],
      totalPrice: '1500000',
      status: 'Berkas Diverifikasi',
      trackingNumberLama: null,
      documents: { "ktp": "dummy/ktp_andi.pdf", "rekomendasi": "dummy/surat_andi.pdf" }
    });

    console.log("Database seeding berhasil! 3 Data klien dan pesanan berhasil ditambahkan.");
  } catch (error) {
    console.error("Terjadi kesalahan saat seeding:", error);
  } finally {
    await client.end();
  }
}

main();
