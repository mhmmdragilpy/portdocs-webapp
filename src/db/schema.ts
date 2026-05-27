import { pgTable, uuid, varchar, text, jsonb, decimal, timestamp } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'), // Referensi ke auth.users.id
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  address: text('address').notNull(),
  major: varchar('major', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'cascade' }),
  services: jsonb('services').notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 100 }).default('Menunggu Pembayaran'),
  trackingNumberLama: varchar('tracking_number_lama', { length: 100 }),
  trackingNumberBaru: varchar('tracking_number_baru', { length: 100 }),
  paymentProofUrl: text('payment_proof_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
