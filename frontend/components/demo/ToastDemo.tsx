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
      description: 'Professional success, error, warning, and info messages with gradient backgrounds',
      icon: CheckCircleIcon,
      onClick: handleGenericToasts,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
    },
    {
      title: 'Trading Toasts',
      description: 'Trading platform specific messages with enhanced styling',
      icon: ExclamationTriangleIcon,
      onClick: handleTradingToasts,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
    },
    {
      title: 'API Toasts',
      description: 'API request and response messages with professional appearance',
      icon: InformationCircleIcon,
      onClick: handleApiToasts,
      color: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
    },
    {
      title: 'Form Toasts',
      description: 'Form validation and save messages with modern design',
      icon: XCircleIcon,
      onClick: handleFormToasts,
      color: 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'
    },
    {
      title: 'Loading Toast',
      description: 'Persistent loading message with blur effects and auto-dismiss',
      icon: ClockIcon,
      onClick: handleLoadingToast,
      color: 'bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700',
      disabled: !!loadingToast
    },
    {
      title: 'Promise Toast',
      description: 'Promise-based toast with loading/success/error states and animations',
      icon: CheckCircleIcon,
      onClick: handlePromiseToast,
      color: 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700'
    },
    {
      title: 'Custom Toasts',
      description: 'Custom styled and themed messages with advanced styling',
      icon: InformationCircleIcon,
      onClick: handleCustomToasts,
      color: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <CheckCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Professional Toast System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enterprise-grade toast notifications with gradient backgrounds, blur effects, and professional styling
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
              className={`${button.color} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-center mb-4">
                <button.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{button.title}</h3>
              <p className="text-sm opacity-90">{button.description}</p>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Professional Toast System Features
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">1</span>
                🎨 Visual Excellence
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Gradient backgrounds with professional color schemes</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Backdrop blur effects for modern glass-morphism</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Enhanced shadows and depth for premium feel</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Responsive design with optimal sizing</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">2</span>
                ⚡ Advanced Functionality
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Trading platform specific messaging</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Promise-based async operation handling</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Smart auto-dismiss with context awareness</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Enterprise-grade error handling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => generic.dismissAll()}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Dismiss All Toasts
          </button>
        </div>
      </div>
    </div>
  );
}
