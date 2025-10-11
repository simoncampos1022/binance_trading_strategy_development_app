'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  CogIcon, 
  BellIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TradingToasts, FormToasts } from '@/lib/toast';

export default function Profile() {
  const { user, updatePreferences } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    defaultTimeframe: user?.preferences?.defaultTimeframe || '1h',
    defaultExchange: user?.preferences?.defaultExchange || 'binance',
    theme: user?.preferences?.theme || 'dark'
  });

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await updatePreferences(preferences);
      FormToasts.formSaved('preferences');
    } catch (error: any) {
      TradingToasts.strategyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: UserIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  General Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="input bg-gray-50 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input bg-gray-50 dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Account Status
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className={`badge ${
                      user?.subscription?.plan === 'free' ? 'badge-secondary' : 'badge-success'
                    }`}>
                      {user?.subscription?.plan?.toUpperCase() || 'FREE'}
                    </span>
                    <span className="text-sm text-blue-800 dark:text-blue-200">
                      {user?.subscription?.plan === 'free' 
                        ? 'Upgrade to Pro for advanced features'
                        : 'Active subscription'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ChartBarIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user?.strategies?.length || 0}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Strategies</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ChartBarIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">0</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Backtests</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ChartBarIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">0</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bots Generated</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Trading Preferences
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Timeframe
                  </label>
                  <select
                    value={preferences.defaultTimeframe}
                    onChange={(e) => setPreferences(prev => ({ ...prev, defaultTimeframe: e.target.value }))}
                    className="select"
                  >
                    <option value="1m">1 Minute</option>
                    <option value="5m">5 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="4h">4 Hours</option>
                    <option value="1d">1 Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Exchange
                  </label>
                  <select
                    value={preferences.defaultExchange}
                    onChange={(e) => setPreferences(prev => ({ ...prev, defaultExchange: e.target.value }))}
                    className="select"
                  >
                    <option value="binance">Binance</option>
                    <option value="coinbase">Coinbase Pro</option>
                    <option value="kraken">Kraken</option>
                    <option value="kucoin">KuCoin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setPreferences(prev => ({ ...prev, theme: 'light' }));
                        if (theme === 'dark') toggleTheme();
                      }}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        preferences.theme === 'light'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => {
                        setPreferences(prev => ({ ...prev, theme: 'dark' }));
                        if (theme === 'light') toggleTheme();
                      }}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        preferences.theme === 'dark'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Notification Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive email updates about your strategies and backtests
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Backtest Complete</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when backtests finish running
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Strategy Alerts</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive alerts when your strategies trigger signals
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Security Settings
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Change Password</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Update your password to keep your account secure
                  </p>
                  <button className="btn btn-secondary">
                    Change Password
                  </button>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button className="btn btn-secondary">
                    Enable 2FA
                  </button>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">API Keys</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Manage your API keys for trading integrations
                  </p>
                  <button className="btn btn-secondary">
                    Manage API Keys
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
