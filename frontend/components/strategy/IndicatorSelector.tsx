'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon, CogIcon } from '@heroicons/react/24/outline';

interface Indicator {
  name: string;
  parameters: Record<string, any>;
  timeframe: string;
}

interface IndicatorSelectorProps {
  indicators: Indicator[];
  onAdd: (indicator: Indicator) => void;
  onRemove: (index: number) => void;
}

const availableIndicators = [
  // TREND INDICATORS
  {
    name: 'SMA',
    label: 'Simple Moving Average',
    description: 'Average price over a specified period',
    category: 'Trend',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 200 }
    ]
  },
  {
    name: 'EMA',
    label: 'Exponential Moving Average',
    description: 'Weighted average that gives more importance to recent prices',
    category: 'Trend',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 200 }
    ]
  },
  {
    name: 'WMA',
    label: 'Weighted Moving Average',
    description: 'Moving average with linear weights, giving more weight to recent data',
    category: 'Trend',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 200 }
    ]
  },
  {
    name: 'HMA',
    label: 'Hull Moving Average',
    description: 'Reduces lag while maintaining smoothness using weighted moving averages',
    category: 'Trend',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 200 }
    ]
  },
  {
    name: 'TEMA',
    label: 'Triple Exponential Moving Average',
    description: 'Reduces lag by applying EMA three times',
    category: 'Trend',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 200 }
    ]
  },
  {
    name: 'KAMA',
    label: 'Kaufman Adaptive Moving Average',
    description: 'Adapts to market volatility using efficiency ratio',
    category: 'Trend',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 200 },
      { name: 'fastSC', label: 'Fast SC', type: 'number', default: 2, min: 1, max: 10 },
      { name: 'slowSC', label: 'Slow SC', type: 'number', default: 30, min: 10, max: 100 }
    ]
  },
  {
    name: 'MACD',
    label: 'MACD',
    description: 'Moving Average Convergence Divergence',
    category: 'Trend',
    parameters: [
      { name: 'fastPeriod', label: 'Fast Period', type: 'number', default: 12, min: 1, max: 50 },
      { name: 'slowPeriod', label: 'Slow Period', type: 'number', default: 26, min: 1, max: 100 },
      { name: 'signalPeriod', label: 'Signal Period', type: 'number', default: 9, min: 1, max: 50 }
    ]
  },

  // MOMENTUM INDICATORS
  {
    name: 'RSI',
    label: 'Relative Strength Index',
    description: 'Momentum oscillator that measures speed and change of price movements',
    category: 'Momentum',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 50 }
    ]
  },
  {
    name: 'Stochastic',
    label: 'Stochastic Oscillator',
    description: 'Momentum indicator comparing closing price to price range',
    category: 'Momentum',
    parameters: [
      { name: 'kPeriod', label: 'K Period', type: 'number', default: 14, min: 1, max: 50 },
      { name: 'dPeriod', label: 'D Period', type: 'number', default: 3, min: 1, max: 20 }
    ]
  },
  {
    name: 'Williams_R',
    label: 'Williams %R',
    description: 'Momentum indicator similar to Stochastic but inverted',
    category: 'Momentum',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 50 }
    ]
  },
  {
    name: 'CCI',
    label: 'Commodity Channel Index',
    description: 'Measures deviation from statistical mean',
    category: 'Momentum',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 100 }
    ]
  },
  {
    name: 'ROC',
    label: 'Rate of Change',
    description: 'Measures percentage change in price over a period',
    category: 'Momentum',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 10, min: 1, max: 100 }
    ]
  },
  {
    name: 'MFI',
    label: 'Money Flow Index',
    description: 'Volume-weighted RSI that considers both price and volume',
    category: 'Momentum',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 50 }
    ]
  },

  // VOLATILITY INDICATORS
  {
    name: 'Bollinger',
    label: 'Bollinger Bands',
    description: 'Price channels based on moving average and standard deviation',
    category: 'Volatility',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 100 },
      { name: 'stdDev', label: 'Standard Deviation', type: 'number', default: 2, min: 1, max: 5, step: 0.1 }
    ]
  },
  {
    name: 'ATR',
    label: 'Average True Range',
    description: 'Measures market volatility by averaging true ranges',
    category: 'Volatility',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 50 }
    ]
  },
  {
    name: 'Keltner',
    label: 'Keltner Channels',
    description: 'Price channels based on EMA and ATR',
    category: 'Volatility',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 100 },
      { name: 'multiplier', label: 'Multiplier', type: 'number', default: 2, min: 1, max: 5, step: 0.1 }
    ]
  },
  {
    name: 'Donchian',
    label: 'Donchian Channels',
    description: 'Price channels based on highest high and lowest low',
    category: 'Volatility',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 100 }
    ]
  },

  // VOLUME INDICATORS
  {
    name: 'OBV',
    label: 'On-Balance Volume',
    description: 'Cumulative volume indicator that adds/subtracts volume based on price direction',
    category: 'Volume',
    parameters: []
  },
  {
    name: 'VWAP',
    label: 'Volume Weighted Average Price',
    description: 'Average price weighted by volume',
    category: 'Volume',
    parameters: []
  },
  {
    name: 'ADL',
    label: 'Accumulation/Distribution Line',
    description: 'Volume-based indicator that measures money flow',
    category: 'Volume',
    parameters: []
  },
  {
    name: 'CMF',
    label: 'Chaikin Money Flow',
    description: 'Volume-weighted average of accumulation/distribution',
    category: 'Volume',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 100 }
    ]
  },

  // OSCILLATORS
  {
    name: 'AO',
    label: 'Awesome Oscillator',
    description: 'Momentum indicator using difference between 5 and 34 period SMAs',
    category: 'Oscillator',
    parameters: [
      { name: 'period1', label: 'Period 1', type: 'number', default: 5, min: 1, max: 20 },
      { name: 'period2', label: 'Period 2', type: 'number', default: 34, min: 20, max: 100 }
    ]
  },
  {
    name: 'UO',
    label: 'Ultimate Oscillator',
    description: 'Multi-timeframe momentum oscillator',
    category: 'Oscillator',
    parameters: [
      { name: 'period1', label: 'Period 1', type: 'number', default: 7, min: 1, max: 20 },
      { name: 'period2', label: 'Period 2', type: 'number', default: 14, min: 10, max: 30 },
      { name: 'period3', label: 'Period 3', type: 'number', default: 28, min: 20, max: 50 }
    ]
  },

  // CUSTOM INDICATORS
  {
    name: 'Ichimoku',
    label: 'Ichimoku Cloud',
    description: 'Comprehensive trend-following system with multiple components',
    category: 'Custom',
    parameters: [
      { name: 'tenkanPeriod', label: 'Tenkan Period', type: 'number', default: 9, min: 1, max: 50 },
      { name: 'kijunPeriod', label: 'Kijun Period', type: 'number', default: 26, min: 10, max: 100 },
      { name: 'senkouSpanBPeriod', label: 'Senkou Span B Period', type: 'number', default: 52, min: 20, max: 200 }
    ]
  },
  {
    name: 'PSAR',
    label: 'Parabolic SAR',
    description: 'Trend-following indicator that provides entry and exit points',
    category: 'Custom',
    parameters: [
      { name: 'acceleration', label: 'Acceleration', type: 'number', default: 0.02, min: 0.01, max: 0.1, step: 0.01 },
      { name: 'maximum', label: 'Maximum', type: 'number', default: 0.2, min: 0.1, max: 0.5, step: 0.01 }
    ]
  }
];

export default function IndicatorSelector({ indicators, onAdd, onRemove }: IndicatorSelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<any>(null);
  const [indicatorParams, setIndicatorParams] = useState<Record<string, any>>({});
  const [timeframe, setTimeframe] = useState('1h');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Trend', 'Momentum', 'Volatility', 'Volume', 'Oscillator', 'Custom'];
  const filteredIndicators = selectedCategory === 'All' 
    ? availableIndicators 
    : availableIndicators.filter(indicator => indicator.category === selectedCategory);

  const handleAddIndicator = () => {
    if (selectedIndicator) {
      const indicator: Indicator = {
        name: selectedIndicator.name,
        parameters: indicatorParams,
        timeframe
      };
      onAdd(indicator);
      setShowAddModal(false);
      setSelectedIndicator(null);
      setIndicatorParams({});
    }
  };

  const handleSelectIndicator = (indicator: any) => {
    setSelectedIndicator(indicator);
    const params: Record<string, any> = {};
    indicator.parameters.forEach((param: any) => {
      params[param.name] = param.default;
    });
    setIndicatorParams(params);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Technical Indicators
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Indicator</span>
        </button>
      </div>

      {/* Current Indicators */}
      <div className="space-y-3">
        {indicators.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CogIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No indicators added yet</p>
            <p className="text-sm">Click "Add Indicator" to get started</p>
          </div>
        ) : (
          indicators.map((indicator, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {indicator.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Timeframe: {indicator.timeframe}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(indicator.parameters).map(([key, value]) => (
                      <span
                        key={key}
                        className="badge badge-primary text-xs"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Indicator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Add Technical Indicator
              </h3>

              {!selectedIndicator ? (
                <div>
                  {/* Category Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Filter by Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Indicators Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {filteredIndicators.map((indicator) => (
                      <button
                        key={indicator.name}
                        onClick={() => handleSelectIndicator(indicator)}
                        className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {indicator.label}
                          </h4>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            {indicator.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {indicator.description}
                        </p>
                        {indicator.parameters.length > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {indicator.parameters.length} parameter{indicator.parameters.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {filteredIndicators.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No indicators found in this category</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {selectedIndicator.label}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedIndicator.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timeframe
                      </label>
                      <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
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

                    {selectedIndicator.parameters.map((param: any) => (
                      <div key={param.name}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {param.label}
                        </label>
                        <input
                          type={param.type}
                          value={indicatorParams[param.name] || param.default}
                          onChange={(e) => setIndicatorParams(prev => ({
                            ...prev,
                            [param.name]: param.type === 'number' ? parseFloat(e.target.value) : e.target.value
                          }))}
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          className="input"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setSelectedIndicator(null);
                        setIndicatorParams({});
                      }}
                      className="btn btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleAddIndicator}
                      className="btn btn-primary"
                    >
                      Add Indicator
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
