import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PortDocs | Jasa Dokumen Pelaut & Paspor",
  description: "Web App Administrasi & Pelacakan Jasa Dokumen Pelaut & Paspor Super Cepat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 pt-24">
          {children}
        </main>
        <footer className="py-6 text-center text-slate-400 text-sm glass mt-auto">
          <p>&copy; {new Date().getFullYear()} PortDocs. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
