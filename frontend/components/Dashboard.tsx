'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CogIcon, 
  CodeBracketIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import StrategyBuilder from './strategy/StrategyBuilder';
import BacktestResults from './backtest/BacktestResults';
import BotGenerator from './bot/BotGenerator';
import Profile from './profile/Profile';

type Tab = 'strategies' | 'backtest' | 'bot' | 'profile';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('strategies');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'strategies' as Tab, name: 'Strategy Builder', icon: ChartBarIcon },
    { id: 'backtest' as Tab, name: 'Backtesting', icon: CogIcon },
    { id: 'bot' as Tab, name: 'Bot Generator', icon: CodeBracketIcon },
    { id: 'profile' as Tab, name: 'Profile', icon: UserIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'strategies':
        return <StrategyBuilder />;
      case 'backtest':
        return <BacktestResults />;
      case 'bot':
        return <BotGenerator />;
      case 'profile':
        return <Profile />;
      default:
        return <StrategyBuilder />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Page content */}
        <main className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
