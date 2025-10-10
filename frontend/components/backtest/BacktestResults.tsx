'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  ChartBarIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Backtest {
  _id: string;
  name: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  results?: {
    totalReturn: number;
    totalReturnPercent: number;
    sharpeRatio: number;
    maxDrawdown: number;
    maxDrawdownPercent: number;
    winRate: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    profitFactor: number;
    finalCapital: number;
  };
  createdAt: string;
}

export default function BacktestResults() {
  const [backtests, setBacktests] = useState<Backtest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBacktest, setSelectedBacktest] = useState<Backtest | null>(null);

  useEffect(() => {
    loadBacktests();
  }, []);

  const loadBacktests = async () => {
    try {
      const response = await api.get('/backtest');
      setBacktests(response.data.backtests);
    } catch (error) {
      console.error('Failed to load backtests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      running: 'badge-warning',
      completed: 'badge-success',
      failed: 'badge-danger',
      cancelled: 'badge-secondary'
    };
    return colors[status as keyof typeof colors] || 'badge-secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      running: 'Running',
      completed: 'Completed',
      failed: 'Failed',
      cancelled: 'Cancelled'
    };
    return labels[status as keyof typeof labels] || 'Unknown';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Backtesting Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and analyze your strategy backtesting results.
        </p>
      </div>

      {backtests.length === 0 ? (
        <div className="text-center py-12">
          <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No backtests yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Run your first backtest to see results here.
          </p>
          <button className="btn btn-primary flex items-center space-x-2 mx-auto">
            <PlayIcon className="w-4 h-4" />
            <span>Run Backtest</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Backtest List */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Recent Backtests
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {backtests.map((backtest) => (
                  <div
                    key={backtest._id}
                    onClick={() => setSelectedBacktest(backtest)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedBacktest?._id === backtest._id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {backtest.name}
                      </h4>
                      <span className={`badge ${getStatusColor(backtest.status)} text-xs`}>
                        {getStatusLabel(backtest.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {backtest.symbol} • {backtest.timeframe}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(backtest.createdAt).toLocaleDateString()}
                    </p>
                    {backtest.results && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`text-xs font-medium ${
                          backtest.results.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercent(backtest.results.totalReturnPercent)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {backtest.results.totalTrades} trades
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backtest Details */}
          <div className="lg:col-span-2">
            {selectedBacktest ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedBacktest.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedBacktest.symbol} • {selectedBacktest.timeframe}
                      </p>
                    </div>
                    <span className={`badge ${getStatusColor(selectedBacktest.status)}`}>
                      {getStatusLabel(selectedBacktest.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <label className="text-gray-600 dark:text-gray-400">Start Date</label>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedBacktest.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-400">End Date</label>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedBacktest.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-400">Duration</label>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {Math.ceil((new Date(selectedBacktest.endDate).getTime() - new Date(selectedBacktest.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-400">Created</label>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedBacktest.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Results */}
                {selectedBacktest.results ? (
                  <div className="space-y-6">
                    {/* Performance Metrics */}
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Performance Metrics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">Total Return</h4>
                            <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className={`text-2xl font-bold ${
                            selectedBacktest.results.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(selectedBacktest.results.totalReturn)}
                          </p>
                          <p className={`text-sm ${
                            selectedBacktest.results.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercent(selectedBacktest.results.totalReturnPercent)}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">Sharpe Ratio</h4>
                            <TrendingUpIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedBacktest.results.sharpeRatio.toFixed(2)}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">Max Drawdown</h4>
                            <TrendingDownIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-2xl font-bold text-red-600">
                            {formatPercent(selectedBacktest.results.maxDrawdownPercent)}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">Win Rate</h4>
                            <ChartBarIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatPercent(selectedBacktest.results.winRate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Trade Statistics */}
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Trade Statistics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Total Trades</h4>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {selectedBacktest.results.totalTrades}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-green-600">
                              {selectedBacktest.results.winningTrades} wins
                            </span>
                            <span className="text-red-600">
                              {selectedBacktest.results.losingTrades} losses
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Profit Factor</h4>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {selectedBacktest.results.profitFactor.toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Final Capital</h4>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(selectedBacktest.results.finalCapital)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card p-6 text-center">
                    <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {selectedBacktest.status === 'running' ? 'Backtest in Progress' : 'No Results Available'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedBacktest.status === 'running' 
                        ? 'Please wait while the backtest completes...'
                        : 'This backtest did not produce results.'
                      }
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a Backtest
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a backtest from the list to view detailed results.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
