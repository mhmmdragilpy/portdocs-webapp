import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 pt-24">
            {children}
          </main>
          <footer className="py-6 text-center text-slate-500 dark:text-slate-400 text-sm bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-md border-t border-slate-200 dark:border-slate-700/50 mt-auto">
            <p>&copy; {new Date().getFullYear()} PortDocs. All rights reserved.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
