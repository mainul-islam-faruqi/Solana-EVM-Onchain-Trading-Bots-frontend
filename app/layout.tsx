import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@/styles/datepicker.css'; 
import '@rainbow-me/rainbowkit/styles.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { ClientProviders } from "@/components/providers/ClientProviders";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "No-Code Trading Bot Builder",
  description: "Build and manage on-chain trading bots without coding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
