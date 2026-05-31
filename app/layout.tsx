import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title:       'VaultPay Financial Core — Secure Invoice Management',
  description: 'Enterprise-grade financial portal for invoice management, secure payments, and client billing.',
  keywords:    'invoice management, payments, billing, financial portal, enterprise',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-vault-bg text-vault-text antialiased">
        {children}
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F1F3D',
              color:      '#E2E8F0',
              border:     '1px solid #1E3A5F',
              borderRadius: '12px',
              fontSize:   '13px',
              fontFamily: 'Inter, sans-serif',
              boxShadow:  '0 8px 32px rgba(0,0,0,0.5)',
            },
          }}
        />
      </body>
    </html>
  );
}
