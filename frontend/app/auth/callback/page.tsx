'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TradingToasts, ApiToasts } from '@/lib/toast';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const success = searchParams.get('success');
      const error = searchParams.get('error');  

      if (error) { 
        TradingToasts.loginError('Authentication failed. Please try again.');
        router.push('/');
        return;
      }

      if (success === 'true' && token) {
        try {
          // Store the token
          localStorage.setItem('token', token);
          
          // Set the token in API headers
          const { api } = await import('@/lib/api');
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Get user data
          const response = await api.get('/auth/me');
          const user = response.data.user;

          // Update auth context (this will be handled by the AuthProvider)
          TradingToasts.loginSuccess();
          router.push('/');
        } catch (error) {
          console.error('Auth callback error:', error);
          TradingToasts.loginError('Failed to complete authentication');
          router.push('/');
        }
      } else {
        TradingToasts.loginError('Authentication failed');
        router.push('/');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Completing authentication...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we sign you in.
        </p>
      </div>
    </div>
  );
}
