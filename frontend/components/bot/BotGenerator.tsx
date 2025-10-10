'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CodeBracketIcon, 
  DownloadIcon,
  PlayIcon,
  CogIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Strategy {
  _id: string;
  name: string;
  description: string;
  category: string;
  indicators: any[];
  buyConditions: any[];
  sellConditions: any[];
  riskManagement: any;
  code?: {
    python?: string;
    javascript?: string;
  };
}

export default function BotGenerator() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript'>('python');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    api: {
      key: '',
      secret: '',
      testnet: true
    },
    trading: {
      symbol: 'BTCUSDT',
      timeframe: '1h',
      initialCapital: 10000,
      maxPositionSize: 0.1
    },
    risk: {
      stopLoss: 0.02,
      takeProfit: 0.04,
      maxDrawdown: 0.15
    }
  });

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const response = await api.get('/strategies');
      setStrategies(response.data.strategies);
    } catch (error) {
      console.error('Failed to load strategies:', error);
    }
  };

  const handleGenerateCode = async () => {
    if (!selectedStrategy) {
      toast.error('Please select a strategy');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/bot/generate/${selectedLanguage}/${selectedStrategy._id}`, {
        config
      });
      setGeneratedCode(response.data.code);
      toast.success('Bot code generated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate bot code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedStrategy) return;

    try {
      const response = await api.get(`/bot/download/${selectedStrategy._id}/${selectedLanguage}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { 
        type: selectedLanguage === 'python' ? 'text/x-python' : 'text/javascript' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedStrategy.name.replace(/\s+/g, '_')}_bot.${selectedLanguage === 'python' ? 'py' : 'js'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Bot code downloaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download bot code');
    }
  };

  const getLanguageIcon = (language: string) => {
    return language === 'python' ? '🐍' : '🟨';
  };

  const getLanguageLabel = (language: string) => {
    return language === 'python' ? 'Python' : 'JavaScript';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bot Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate ready-to-deploy trading bots from your strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Selection */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Select Strategy
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {strategies.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No strategies available
                </p>
              ) : (
                strategies.map((strategy) => (
                  <div
                    key={strategy._id}
                    onClick={() => setSelectedStrategy(strategy)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStrategy?._id === strategy._id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {strategy.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {strategy.category}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {strategy.indicators.length} indicators • {strategy.buyConditions.length} buy conditions
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Language Selection */}
          <div className="card p-4 mt-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Programming Language
            </h3>
            <div className="space-y-2">
              {(['python', 'javascript'] as const).map((language) => (
                <button
                  key={language}
                  onClick={() => setSelectedLanguage(language)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedLanguage === language
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getLanguageIcon(language)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {getLanguageLabel(language)}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {language === 'python' ? 'Easy to deploy and maintain' : 'Node.js compatible'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration and Code */}
        <div className="lg:col-span-2">
          {selectedStrategy ? (
            <div className="space-y-6">
              {/* Strategy Info */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedStrategy.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedStrategy.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-primary">{selectedStrategy.category}</span>
                  <span className="badge badge-secondary">{selectedStrategy.indicators.length} indicators</span>
                  <span className="badge badge-secondary">{selectedStrategy.buyConditions.length} buy conditions</span>
                </div>
              </div>

              {/* Configuration */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CogIcon className="w-5 h-5 mr-2" />
                  Bot Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">API Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          API Key
                        </label>
                        <input
                          type="text"
                          value={config.api.key}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            api: { ...prev.api, key: e.target.value }
                          }))}
                          className="input"
                          placeholder="Your API key"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Secret Key
                        </label>
                        <input
                          type="password"
                          value={config.api.secret}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            api: { ...prev.api, secret: e.target.value }
                          }))}
                          className="input"
                          placeholder="Your secret key"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="testnet"
                          checked={config.api.testnet}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            api: { ...prev.api, testnet: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        <label htmlFor="testnet" className="text-sm text-gray-700 dark:text-gray-300">
                          Use testnet (recommended for testing)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Trading Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Symbol
                        </label>
                        <input
                          type="text"
                          value={config.trading.symbol}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            trading: { ...prev.trading, symbol: e.target.value }
                          }))}
                          className="input"
                          placeholder="BTCUSDT"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Timeframe
                        </label>
                        <select
                          value={config.trading.timeframe}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            trading: { ...prev.trading, timeframe: e.target.value }
                          }))}
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Initial Capital ($)
                        </label>
                        <input
                          type="number"
                          value={config.trading.initialCapital}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            trading: { ...prev.trading, initialCapital: parseFloat(e.target.value) }
                          }))}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Generate Bot Code
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Generate {getLanguageLabel(selectedLanguage)} code for your strategy
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleGenerateCode}
                      disabled={loading}
                      className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      <PlayIcon className="w-4 h-4" />
                      <span>{loading ? 'Generating...' : 'Generate Code'}</span>
                    </button>
                    {generatedCode && (
                      <button
                        onClick={handleDownload}
                        className="btn btn-secondary flex items-center space-x-2"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Generated Code */}
              {generatedCode && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CodeBracketIcon className="w-5 h-5 mr-2" />
                    Generated {getLanguageLabel(selectedLanguage)} Code
                  </h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Deployment Instructions
                    </h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>1. Save the code to a file with the appropriate extension (.py or .js)</li>
                      <li>2. Install required dependencies (ccxt, pandas for Python or ccxt for JavaScript)</li>
                      <li>3. Configure your API credentials in the code</li>
                      <li>4. Run the bot: <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">python bot.py</code> or <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">node bot.js</code></li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <CodeBracketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a Strategy
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a strategy from the list to generate bot code.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
