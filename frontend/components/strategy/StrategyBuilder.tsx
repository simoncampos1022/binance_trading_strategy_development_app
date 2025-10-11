'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon, 
  PlayIcon,
  SaveIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { TradingToasts, ApiToasts } from '@/lib/toast';
import IndicatorSelector from './IndicatorSelector';
import ConditionBuilder from './ConditionBuilder';
import StrategyPreview from './StrategyPreview';

interface Strategy {
  id?: string;
  name: string;
  description: string;
  category: string;
  symbols: string[];
  timeframes: string[];
  indicators: any[];
  buyConditions: any[];
  sellConditions: any[];
  riskManagement: {
    stopLoss: number;
    takeProfit: number;
    maxPositionSize: number;
    maxDrawdown: number;
  };
}

export default function StrategyBuilder() {
  const [strategy, setStrategy] = useState<Strategy>({
    name: '',
    description: '',
    category: 'custom',
    symbols: ['BTCUSDT'],
    timeframes: ['1h'],
    indicators: [],
    buyConditions: [],
    sellConditions: [],
    riskManagement: {
      stopLoss: 0.02,
      takeProfit: 0.04,
      maxPositionSize: 0.1,
      maxDrawdown: 0.15
    }
  });

  const [activeTab, setActiveTab] = useState('indicators');
  const [loading, setLoading] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const response = await api.get('/strategies');
      setSavedStrategies(response.data.strategies);
    } catch (error) {
      console.error('Failed to load strategies:', error);
    }
  };

  const handleSave = async () => {
    if (!strategy.name.trim()) {
      TradingToasts.requiredField('strategy name');
      return;
    }

    setLoading(true);
    const loadingToast = ApiToasts.requestStarted('saving strategy');
    
    try {
      if (strategy.id) {
        await api.put(`/strategies/${strategy.id}`, strategy);
        TradingToasts.strategySaved(strategy.name);
      } else {
        const response = await api.post('/strategies', strategy);
        setStrategy({ ...strategy, id: response.data.strategy._id });
        TradingToasts.strategySaved(strategy.name);
      }
      loadStrategies();
    } catch (error: any) {
      TradingToasts.strategyError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadStrategy = (selectedStrategy: Strategy) => {
    setStrategy(selectedStrategy);
    setActiveTab('indicators');
    TradingToasts.strategySaved(selectedStrategy.name);
  };

  const handleAddIndicator = (indicator: any) => {
    setStrategy(prev => ({
      ...prev,
      indicators: [...prev.indicators, indicator]
    }));
  };

  const handleRemoveIndicator = (index: number) => {
    setStrategy(prev => ({
      ...prev,
      indicators: prev.indicators.filter((_, i) => i !== index)
    }));
  };

  const handleAddCondition = (type: 'buy' | 'sell', condition: any) => {
    setStrategy(prev => ({
      ...prev,
      [`${type}Conditions`]: [...prev[`${type}Conditions`], condition]
    }));
  };

  const handleRemoveCondition = (type: 'buy' | 'sell', index: number) => {
    setStrategy(prev => ({
      ...prev,
      [`${type}Conditions`]: prev[`${type}Conditions`].filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'indicators', name: 'Indicators', icon: '📊' },
    { id: 'buy', name: 'Buy Conditions', icon: '📈' },
    { id: 'sell', name: 'Sell Conditions', icon: '📉' },
    { id: 'risk', name: 'Risk Management', icon: '🛡️' },
    { id: 'preview', name: 'Preview', icon: '👁️' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Strategy Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and configure your trading strategy with technical indicators and conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Strategy List */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Saved Strategies
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {savedStrategies.map((savedStrategy) => (
                <div
                  key={savedStrategy.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleLoadStrategy(savedStrategy)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {savedStrategy.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {savedStrategy.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Strategy Info */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Strategy Name
                  </label>
                  <input
                    type="text"
                    value={strategy.name}
                    onChange={(e) => setStrategy(prev => ({ ...prev, name: e.target.value }))}
                    className="input"
                    placeholder="Enter strategy name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={strategy.category}
                    onChange={(e) => setStrategy(prev => ({ ...prev, category: e.target.value }))}
                    className="select"
                  >
                    <option value="trend">Trend Following</option>
                    <option value="momentum">Momentum</option>
                    <option value="mean_reversion">Mean Reversion</option>
                    <option value="arbitrage">Arbitrage</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={strategy.description}
                  onChange={(e) => setStrategy(prev => ({ ...prev, description: e.target.value }))}
                  className="textarea"
                  rows={3}
                  placeholder="Describe your strategy..."
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'indicators' && (
                <IndicatorSelector
                  indicators={strategy.indicators}
                  onAdd={handleAddIndicator}
                  onRemove={handleRemoveIndicator}
                />
              )}

              {activeTab === 'buy' && (
                <ConditionBuilder
                  type="buy"
                  conditions={strategy.buyConditions}
                  indicators={strategy.indicators}
                  onAdd={handleAddCondition}
                  onRemove={handleRemoveCondition}
                />
              )}

              {activeTab === 'sell' && (
                <ConditionBuilder
                  type="sell"
                  conditions={strategy.sellConditions}
                  indicators={strategy.indicators}
                  onAdd={handleAddCondition}
                  onRemove={handleRemoveCondition}
                />
              )}

              {activeTab === 'risk' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Risk Management
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Stop Loss (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={strategy.riskManagement.stopLoss * 100}
                        onChange={(e) => setStrategy(prev => ({
                          ...prev,
                          riskManagement: {
                            ...prev.riskManagement,
                            stopLoss: parseFloat(e.target.value) / 100
                          }
                        }))}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Take Profit (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={strategy.riskManagement.takeProfit * 100}
                        onChange={(e) => setStrategy(prev => ({
                          ...prev,
                          riskManagement: {
                            ...prev.riskManagement,
                            takeProfit: parseFloat(e.target.value) / 100
                          }
                        }))}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Position Size (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={strategy.riskManagement.maxPositionSize * 100}
                        onChange={(e) => setStrategy(prev => ({
                          ...prev,
                          riskManagement: {
                            ...prev.riskManagement,
                            maxPositionSize: parseFloat(e.target.value) / 100
                          }
                        }))}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Drawdown (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={strategy.riskManagement.maxDrawdown * 100}
                        onChange={(e) => setStrategy(prev => ({
                          ...prev,
                          riskManagement: {
                            ...prev.riskManagement,
                            maxDrawdown: parseFloat(e.target.value) / 100
                          }
                        }))}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <StrategyPreview strategy={strategy} />
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <SaveIcon className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Strategy'}</span>
                  </button>
                  <button className="btn btn-secondary flex items-center space-x-2">
                    <PlayIcon className="w-4 h-4" />
                    <span>Run Backtest</span>
                  </button>
                </div>
                <button className="btn btn-secondary flex items-center space-x-2">
                  <EyeIcon className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
