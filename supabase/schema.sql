-- schema.sql
-- Run this in the Supabase SQL Editor

-- 1. Create Tables

-- Table for clients (Users/Customers submitting the form)
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  major VARCHAR(50), -- Nautika/Dek or Teknika/Mesin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for orders (Services chosen and their tracking status)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  services JSONB NOT NULL, -- Array of selected services and specific options
  total_price DECIMAL(12, 2) NOT NULL,
  status VARCHAR(100) DEFAULT 'Menunggu Pembayaran',
  -- Status flow: Menunggu Pembayaran -> Menunggu Fisik Buku Lama -> Berkas Diverifikasi -> Proses Input Portal -> Selesai & Dalam Pengiriman
  tracking_number_lama VARCHAR(100), -- Resi pengiriman buku fisik lama (if any)
  tracking_number_baru VARCHAR(100), -- Resi pengiriman dokumen jadi ke klien
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to auto-update 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. Create Storage Bucket
-- Create a private bucket called "draft-files"
INSERT INTO storage.buckets (id, name, public)
VALUES ('draft-files', 'draft-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow authenticated users (Admin) to read all files
CREATE POLICY "Allow admin to read all draft files"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'draft-files' );

-- Allow public inserts (so clients can upload via presigned URL or anonymous upload if permitted)
-- Note: It's safer to use server-side presigned URLs, so Next.js backend will use the Service Role key to upload or generate presigned URLs.
-- For true presigned URL uploads from client side, we might not even need public INSERT policy, as the presigned URL grants temporary access.
