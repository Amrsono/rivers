import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { SellerContactModal } from '@/components/marketplace/SellerContactModal';
import { MobileBottomNav } from '@/components/marketplace/MobileBottomNav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rivers — Fluid P2P Marketplace & Escrow Flow',
  description:
    'Search cars, real estate, smartphones, electronics, and tech with direct phone calls, instant chat, escrow verification, and 0% APR BNPL split financing.',
  keywords: [
    'Rivers',
    'Rivers Marketplace',
    'P2P Marketplace',
    'Classifieds App',
    'Buy and Sell',
    'Escrow Flow',
    'Cars',
    'Real Estate',
    'Mobiles',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Rivers',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-[#05070c] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-300 pb-16 sm:pb-0">
        {/* Ambient Liquid Glows */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="fixed top-2/3 left-1/3 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Application Content */}
        {children}

        {/* Global Modals & Navigation */}
        <SellerContactModal />
        <MobileBottomNav />

        {/* Global Toast Container */}
        <ToastContainer />
      </body>
    </html>
  );
}
