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
  {
    name: 'SMA',
    label: 'Simple Moving Average',
    description: 'Average price over a specified period',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 200 }
    ]
  },
  {
    name: 'EMA',
    label: 'Exponential Moving Average',
    description: 'Weighted average that gives more importance to recent prices',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 200 }
    ]
  },
  {
    name: 'RSI',
    label: 'Relative Strength Index',
    description: 'Momentum oscillator that measures speed and change of price movements',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 50 }
    ]
  },
  {
    name: 'MACD',
    label: 'MACD',
    description: 'Moving Average Convergence Divergence',
    parameters: [
      { name: 'fastPeriod', label: 'Fast Period', type: 'number', default: 12, min: 1, max: 50 },
      { name: 'slowPeriod', label: 'Slow Period', type: 'number', default: 26, min: 1, max: 100 },
      { name: 'signalPeriod', label: 'Signal Period', type: 'number', default: 9, min: 1, max: 50 }
    ]
  },
  {
    name: 'Bollinger',
    label: 'Bollinger Bands',
    description: 'Price channels based on moving average and standard deviation',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 100 },
      { name: 'stdDev', label: 'Standard Deviation', type: 'number', default: 2, min: 1, max: 5, step: 0.1 }
    ]
  },
  {
    name: 'Stochastic',
    label: 'Stochastic Oscillator',
    description: 'Momentum indicator comparing closing price to price range',
    parameters: [
      { name: 'kPeriod', label: 'K Period', type: 'number', default: 14, min: 1, max: 50 },
      { name: 'dPeriod', label: 'D Period', type: 'number', default: 3, min: 1, max: 20 }
    ]
  }
];

export default function IndicatorSelector({ indicators, onAdd, onRemove }: IndicatorSelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<any>(null);
  const [indicatorParams, setIndicatorParams] = useState<Record<string, any>>({});
  const [timeframe, setTimeframe] = useState('1h');

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableIndicators.map((indicator) => (
                    <button
                      key={indicator.name}
                      onClick={() => handleSelectIndicator(indicator)}
                      className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {indicator.label}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {indicator.description}
                      </p>
                    </button>
                  ))}
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
