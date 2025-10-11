'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/useToast';

export default function ToastDemo() {
  const { trading, api, form, generic } = useToast();
  const [loadingToast, setLoadingToast] = useState<string | null>(null);

  const handleGenericToasts = () => {
    generic.success('This is a success message!');
    setTimeout(() => generic.error('This is an error message!'), 1000);
    setTimeout(() => generic.warning('This is a warning message!'), 2000);
    setTimeout(() => generic.info('This is an info message!'), 3000);
  };

  const handleTradingToasts = () => {
    trading.loginSuccess();
    setTimeout(() => trading.strategySaved('My Strategy'), 1000);
    setTimeout(() => trading.botGenerated('Python'), 2000);
    setTimeout(() => trading.indicatorAdded('RSI'), 3000);
  };

  const handleApiToasts = () => {
    const loadingId = api.requestStarted('loading data');
    setTimeout(() => {
      api.requestSuccess('loading data');
    }, 2000);
  };

  const handleFormToasts = () => {
    form.formSaved('user preferences');
    setTimeout(() => form.formValidation(['email is required', 'password too short']), 1000);
  };

  const handleLoadingToast = () => {
    const id = generic.loading('Processing your request...');
    setLoadingToast(id);
    setTimeout(() => {
      generic.dismiss(id);
      generic.success('Request completed!');
      setLoadingToast(null);
    }, 3000);
  };

  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject('Failed!');
      }, 2000);
    });

    generic.promise(promise, {
      loading: 'Processing...',
      success: 'Operation completed!',
      error: 'Operation failed!'
    });
  };

  const handleCustomToasts = () => {
    generic.custom('Custom success message!', 'success');
    setTimeout(() => generic.custom('Custom error message!', 'error'), 1000);
    setTimeout(() => generic.custom('Custom warning message!', 'warning'), 2000);
    setTimeout(() => generic.custom('Custom info message!', 'info'), 3000);
  };

  const demoButtons = [
    {
      title: 'Generic Toasts',
      description: 'Basic success, error, warning, and info messages',
      icon: CheckCircleIcon,
      onClick: handleGenericToasts,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Trading Toasts',
      description: 'Trading platform specific messages',
      icon: ExclamationTriangleIcon,
      onClick: handleTradingToasts,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'API Toasts',
      description: 'API request and response messages',
      icon: InformationCircleIcon,
      onClick: handleApiToasts,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Form Toasts',
      description: 'Form validation and save messages',
      icon: XCircleIcon,
      onClick: handleFormToasts,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Loading Toast',
      description: 'Persistent loading message with auto-dismiss',
      icon: ClockIcon,
      onClick: handleLoadingToast,
      color: 'bg-gray-500 hover:bg-gray-600',
      disabled: !!loadingToast
    },
    {
      title: 'Promise Toast',
      description: 'Promise-based toast with loading/success/error states',
      icon: CheckCircleIcon,
      onClick: handlePromiseToast,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Custom Toasts',
      description: 'Custom styled and themed messages',
      icon: InformationCircleIcon,
      onClick: handleCustomToasts,
      color: 'bg-pink-500 hover:bg-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Toast Notification Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Comprehensive toast system for enhanced user experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoButtons.map((button, index) => (
            <motion.button
              key={button.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={button.onClick}
              disabled={button.disabled}
              className={`${button.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              <div className="flex items-center justify-center mb-4">
                <button.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{button.title}</h3>
              <p className="text-sm opacity-90">{button.description}</p>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Toast System Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎨 Visual Features
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Custom styling with rounded corners</li>
                <li>• Color-coded by message type</li>
                <li>• Smooth animations and transitions</li>
                <li>• Dark mode support</li>
                <li>• Responsive design</li>
                <li>• Auto-positioning</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⚡ Functionality
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Trading-specific messages</li>
                <li>• API request/response handling</li>
                <li>• Form validation feedback</li>
                <li>• Promise-based toasts</li>
                <li>• Loading states</li>
                <li>• Auto-dismiss timers</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => generic.dismissAll()}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Dismiss All Toasts
          </button>
        </div>
      </div>
    </div>
  );
}
