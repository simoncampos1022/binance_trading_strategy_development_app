import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/toast.css';
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
              gutter={12}
              containerClassName="!z-50"
              containerStyle={{
                top: '24px',
                right: '24px',
              }}
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(17, 24, 39, 0.95)',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  lineHeight: '1.5',
                  maxWidth: '400px',
                  minWidth: '300px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)',
                  },
                  iconTheme: {
                    primary: '#FFFFFF',
                    secondary: '#10B981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.04)',
                  },
                  iconTheme: {
                    primary: '#FFFFFF',
                    secondary: '#EF4444',
                  },
                },
                loading: {
                  duration: Infinity,
                  style: {
                    background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                    boxShadow: '0 20px 25px -5px rgba(107, 114, 128, 0.1), 0 10px 10px -5px rgba(107, 114, 128, 0.04)',
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
