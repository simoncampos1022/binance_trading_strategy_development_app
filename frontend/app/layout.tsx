import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crypto Trading Platform',
  description: 'Advanced crypto trading platform with strategy development, backtesting, and bot generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10B981',
                    color: '#FFFFFF',
                  },
                  iconTheme: {
                    primary: '#FFFFFF',
                    secondary: '#10B981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#EF4444',
                    color: '#FFFFFF',
                  },
                  iconTheme: {
                    primary: '#FFFFFF',
                    secondary: '#EF4444',
                  },
                },
                loading: {
                  style: {
                    background: '#6B7280',
                    color: '#FFFFFF',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
