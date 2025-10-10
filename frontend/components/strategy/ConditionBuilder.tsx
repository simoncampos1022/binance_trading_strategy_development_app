'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Condition {
  type: 'buy' | 'sell';
  logic: 'AND' | 'OR';
  conditions: Array<{
    indicator: string;
    operator: string;
    value: number;
    timeframe: string;
  }>;
}

interface ConditionBuilderProps {
  type: 'buy' | 'sell';
  conditions: Condition[];
  indicators: any[];
  onAdd: (type: 'buy' | 'sell', condition: Condition) => void;
  onRemove: (type: 'buy' | 'sell', index: number) => void;
}

const operators = [
  { value: '>', label: 'Greater than' },
  { value: '<', label: 'Less than' },
  { value: '>=', label: 'Greater than or equal' },
  { value: '<=', label: 'Less than or equal' },
  { value: '==', label: 'Equal to' },
  { value: '!=', label: 'Not equal to' },
  { value: 'crosses_above', label: 'Crosses above' },
  { value: 'crosses_below', label: 'Crosses below' }
];

export default function ConditionBuilder({ type, conditions, indicators, onAdd, onRemove }: ConditionBuilderProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCondition, setNewCondition] = useState<Condition>({
    type,
    logic: 'AND',
    conditions: []
  });

  const handleAddCondition = () => {
    if (newCondition.conditions.length > 0) {
      onAdd(type, newCondition);
      setNewCondition({
        type,
        logic: 'AND',
        conditions: []
      });
      setShowAddModal(false);
    }
  };

  const handleAddSubCondition = () => {
    setNewCondition(prev => ({
      ...prev,
      conditions: [...prev.conditions, {
        indicator: '',
        operator: '>',
        value: 0,
        timeframe: '1h'
      }]
    }));
  };

  const handleUpdateSubCondition = (index: number, field: string, value: any) => {
    setNewCondition(prev => ({
      ...prev,
      conditions: prev.conditions.map((cond, i) => 
        i === index ? { ...cond, [field]: value } : cond
      )
    }));
  };

  const handleRemoveSubCondition = (index: number) => {
    setNewCondition(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const getIndicatorOptions = () => {
    const options = [];
    indicators.forEach(indicator => {
      options.push({ value: indicator.name, label: indicator.name });
      if (indicator.name === 'MACD') {
        options.push(
          { value: 'MACD_macd', label: 'MACD Line' },
          { value: 'MACD_signal', label: 'MACD Signal' },
          { value: 'MACD_histogram', label: 'MACD Histogram' }
        );
      } else if (indicator.name === 'Bollinger') {
        options.push(
          { value: 'Bollinger_upper', label: 'Bollinger Upper' },
          { value: 'Bollinger_middle', label: 'Bollinger Middle' },
          { value: 'Bollinger_lower', label: 'Bollinger Lower' }
        );
      }
    });
    return options;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {type === 'buy' ? 'Buy' : 'Sell'} Conditions
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Condition</span>
        </button>
      </div>

      {/* Current Conditions */}
      <div className="space-y-3">
        {conditions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No {type} conditions added yet</p>
            <p className="text-sm">Click "Add Condition" to get started</p>
          </div>
        ) : (
          conditions.map((condition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="badge badge-primary">
                      {condition.logic}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
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
                </div>
                <button
                  onClick={() => onRemove(type, index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Condition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add {type === 'buy' ? 'Buy' : 'Sell'} Condition
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logic
                  </label>
                  <select
                    value={newCondition.logic}
                    onChange={(e) => setNewCondition(prev => ({ ...prev, logic: e.target.value as 'AND' | 'OR' }))}
                    className="select"
                  >
                    <option value="AND">AND (All conditions must be true)</option>
                    <option value="OR">OR (Any condition can be true)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Conditions
                    </label>
                    <button
                      onClick={handleAddSubCondition}
                      className="btn btn-secondary text-sm"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add Condition
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newCondition.conditions.map((subCondition, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <select
                          value={subCondition.indicator}
                          onChange={(e) => handleUpdateSubCondition(index, 'indicator', e.target.value)}
                          className="select text-sm"
                        >
                          <option value="">Select indicator</option>
                          {getIndicatorOptions().map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <select
                          value={subCondition.operator}
                          onChange={(e) => handleUpdateSubCondition(index, 'operator', e.target.value)}
                          className="select text-sm"
                        >
                          {operators.map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          step="0.01"
                          value={subCondition.value}
                          onChange={(e) => handleUpdateSubCondition(index, 'value', parseFloat(e.target.value))}
                          className="input text-sm"
                          placeholder="Value"
                        />

                        <div className="flex items-center space-x-2">
                          <select
                            value={subCondition.timeframe}
                            onChange={(e) => handleUpdateSubCondition(index, 'timeframe', e.target.value)}
                            className="select text-sm flex-1"
                          >
                            <option value="1m">1m</option>
                            <option value="5m">5m</option>
                            <option value="15m">15m</option>
                            <option value="30m">30m</option>
                            <option value="1h">1h</option>
                            <option value="4h">4h</option>
                            <option value="1d">1d</option>
                          </select>
                          <button
                            onClick={() => handleRemoveSubCondition(index)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {newCondition.conditions.length === 0 && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <p>No conditions added yet</p>
                        <p className="text-sm">Click "Add Condition" to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCondition}
                  disabled={newCondition.conditions.length === 0}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Condition
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
