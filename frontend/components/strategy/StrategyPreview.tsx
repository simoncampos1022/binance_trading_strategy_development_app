'use client';

import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CogIcon, 
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface Strategy {
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

interface StrategyPreviewProps {
  strategy: Strategy;
}

export default function StrategyPreview({ strategy }: StrategyPreviewProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      trend: 'badge-primary',
      momentum: 'badge-success',
      mean_reversion: 'badge-warning',
      arbitrage: 'badge-danger',
      custom: 'badge-secondary'
    };
    return colors[category as keyof typeof colors] || 'badge-secondary';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      trend: 'Trend Following',
      momentum: 'Momentum',
      mean_reversion: 'Mean Reversion',
      arbitrage: 'Arbitrage',
      custom: 'Custom'
    };
    return labels[category as keyof typeof labels] || 'Custom';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Strategy Preview
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Review your strategy configuration before saving or running backtests.
        </p>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <InformationCircleIcon className="w-5 h-5 mr-2" />
            Basic Information
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p className="text-gray-900 dark:text-white">{strategy.name || 'Untitled Strategy'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <div className="mt-1">
                <span className={`badge ${getCategoryColor(strategy.category)}`}>
                  {getCategoryLabel(strategy.category)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <p className="text-gray-900 dark:text-white text-sm">
                {strategy.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Trading Configuration
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Symbols</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {strategy.symbols.map((symbol, index) => (
                  <span key={index} className="badge badge-primary text-xs">
                    {symbol}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timeframes</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {strategy.timeframes.map((timeframe, index) => (
                  <span key={index} className="badge badge-secondary text-xs">
                    {timeframe}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="card p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <CogIcon className="w-5 h-5 mr-2" />
          Technical Indicators ({strategy.indicators.length})
        </h4>
        {strategy.indicators.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No indicators configured
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategy.indicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
              >
                <h5 className="font-medium text-gray-900 dark:text-white">
                  {indicator.name}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Timeframe: {indicator.timeframe}
                </p>
                <div className="space-y-1">
                  {Object.entries(indicator.parameters).map(([key, value]) => (
                    <div key={key} className="text-xs text-gray-600 dark:text-gray-400">
                      {key}: {value}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Buy Conditions ({strategy.buyConditions.length})
          </h4>
          {strategy.buyConditions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No buy conditions configured
            </p>
          ) : (
            <div className="space-y-3">
              {strategy.buyConditions.map((condition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge badge-success text-xs">
                      {condition.logic}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {condition.conditions.length} condition{condition.conditions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {condition.conditions.map((subCondition, subIndex) => (
                      <div key={subIndex} className="text-sm text-gray-700 dark:text-gray-300">
                        {subCondition.indicator} {subCondition.operator} {subCondition.value}
                        <span className="text-gray-500 ml-2">({subCondition.timeframe})</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Sell Conditions ({strategy.sellConditions.length})
          </h4>
          {strategy.sellConditions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No sell conditions configured
            </p>
          ) : (
            <div className="space-y-3">
              {strategy.sellConditions.map((condition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge badge-danger text-xs">
                      {condition.logic}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {condition.conditions.length} condition{condition.conditions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {condition.conditions.map((subCondition, subIndex) => (
                      <div key={subIndex} className="text-sm text-gray-700 dark:text-gray-300">
                        {subCondition.indicator} {subCondition.operator} {subCondition.value}
                        <span className="text-gray-500 ml-2">({subCondition.timeframe})</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Risk Management */}
      <div className="card p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <ShieldCheckIcon className="w-5 h-5 mr-2" />
          Risk Management
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">Stop Loss</h5>
            <p className="text-2xl font-bold text-red-600">
              {(strategy.riskManagement.stopLoss * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">Take Profit</h5>
            <p className="text-2xl font-bold text-green-600">
              {(strategy.riskManagement.takeProfit * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">Max Position</h5>
            <p className="text-2xl font-bold text-blue-600">
              {(strategy.riskManagement.maxPositionSize * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">Max Drawdown</h5>
            <p className="text-2xl font-bold text-orange-600">
              {(strategy.riskManagement.maxDrawdown * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
