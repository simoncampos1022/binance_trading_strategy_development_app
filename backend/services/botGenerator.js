const generatePythonBot = (strategy, config = {}) => {
  const defaultConfig = {
    api: {
      key: 'YOUR_API_KEY',
      secret: 'YOUR_SECRET_KEY',
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
  };

  const finalConfig = { ...defaultConfig, ...config };

  return `#!/usr/bin/env python3
"""
Generated Trading Bot for Strategy: ${strategy.name}
Generated on: ${new Date().toISOString()}
Description: ${strategy.description || 'No description provided'}
"""

import ccxt
import pandas as pd
import numpy as np
import time
import json
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TradingBot:
    def __init__(self, config):
        self.config = config
        self.exchange = None
        self.position = None
        self.capital = config['trading']['initialCapital']
        self.symbol = config['trading']['symbol']
        self.timeframe = config['trading']['timeframe']
        self.max_position_size = config['trading']['maxPositionSize']
        
        # Risk management
        self.stop_loss = config['risk']['stopLoss']
        self.take_profit = config['risk']['takeProfit']
        self.max_drawdown = config['risk']['maxDrawdown']
        
        self.setup_exchange()
    
    def setup_exchange(self):
        """Initialize exchange connection"""
        try:
            self.exchange = ccxt.binance({
                'apiKey': self.config['api']['key'],
                'secret': self.config['api']['secret'],
                'sandbox': self.config['api']['testnet'],
                'enableRateLimit': True,
            })
            logger.info("Exchange connection established")
        except Exception as e:
            logger.error(f"Failed to connect to exchange: {e}")
            raise
    
    def get_historical_data(self, symbol, timeframe, limit=100):
        """Fetch historical OHLCV data"""
        try:
            ohlcv = self.exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            return df
        except Exception as e:
            logger.error(f"Failed to fetch historical data: {e}")
            return None
    
    def calculate_sma(self, data, period):
        """Calculate Simple Moving Average"""
        return data.rolling(window=period).mean()
    
    def calculate_ema(self, data, period):
        """Calculate Exponential Moving Average"""
        return data.ewm(span=period).mean()
    
    def calculate_rsi(self, data, period=14):
        """Calculate Relative Strength Index"""
        delta = data.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs))
    
    def calculate_macd(self, data, fast=12, slow=26, signal=9):
        """Calculate MACD"""
        ema_fast = self.calculate_ema(data, fast)
        ema_slow = self.calculate_ema(data, slow)
        macd = ema_fast - ema_slow
        signal_line = self.calculate_ema(macd, signal)
        histogram = macd - signal_line
        return macd, signal_line, histogram
    
    def calculate_bollinger_bands(self, data, period=20, std_dev=2):
        """Calculate Bollinger Bands"""
        sma = self.calculate_sma(data, period)
        std = data.rolling(window=period).std()
        upper = sma + (std * std_dev)
        lower = sma - (std * std_dev)
        return upper, sma, lower
    
    def calculate_indicators(self, df):
        """Calculate all required indicators"""
        close = df['close']
        
        # Calculate indicators based on strategy
        ${generateIndicatorCalculations(strategy.indicators)}
        
        return df
    
    def check_buy_conditions(self, df, current_idx):
        """Check if buy conditions are met"""
        if current_idx < 1:
            return False
        
        current = df.iloc[current_idx]
        previous = df.iloc[current_idx - 1]
        
        ${generateConditionChecks(strategy.buyConditions, 'buy')}
        
        return False
    
    def check_sell_conditions(self, df, current_idx):
        """Check if sell conditions are met"""
        if current_idx < 1:
            return False
        
        current = df.iloc[current_idx]
        previous = df.iloc[current_idx - 1]
        
        ${generateConditionChecks(strategy.sellConditions, 'sell')}
        
        return False
    
    def calculate_position_size(self, price):
        """Calculate position size based on risk management"""
        max_investment = self.capital * self.max_position_size
        return max_investment / price
    
    def execute_buy(self, price):
        """Execute buy order"""
        try:
            quantity = self.calculate_position_size(price)
            if quantity <= 0:
                return False
            
            # Place buy order
            order = self.exchange.create_market_buy_order(self.symbol, quantity)
            
            self.position = {
                'entry_price': price,
                'quantity': quantity,
                'entry_time': datetime.now(),
                'stop_loss': price * (1 - self.stop_loss),
                'take_profit': price * (1 + self.take_profit)
            }
            
            logger.info(f"Buy order executed: {quantity} {self.symbol} at {price}")
            return True
        except Exception as e:
            logger.error(f"Failed to execute buy order: {e}")
            return False
    
    def execute_sell(self, price, reason="Sell signal"):
        """Execute sell order"""
        try:
            if not self.position:
                return False
            
            # Place sell order
            order = self.exchange.create_market_sell_order(self.symbol, self.position['quantity'])
            
            pnl = (price - self.position['entry_price']) * self.position['quantity']
            self.capital += pnl
            
            logger.info(f"Sell order executed: {self.position['quantity']} {self.symbol} at {price} (PnL: {pnl:.2f}) - {reason}")
            
            self.position = None
            return True
        except Exception as e:
            logger.error(f"Failed to execute sell order: {e}")
            return False
    
    def check_risk_management(self, current_price):
        """Check stop loss and take profit"""
        if not self.position:
            return False
        
        # Check stop loss
        if current_price <= self.position['stop_loss']:
            self.execute_sell(current_price, "Stop loss triggered")
            return True
        
        # Check take profit
        if current_price >= self.position['take_profit']:
            self.execute_sell(current_price, "Take profit triggered")
            return True
        
        return False
    
    def run(self):
        """Main trading loop"""
        logger.info(f"Starting trading bot for {self.symbol}")
        logger.info(f"Initial capital: {self.capital}")
        
        while True:
            try:
                # Get latest data
                df = self.get_historical_data(self.symbol, self.timeframe, 100)
                if df is None or len(df) < 50:
                    logger.warning("Insufficient data, waiting...")
                    time.sleep(60)
                    continue
                
                # Calculate indicators
                df = self.calculate_indicators(df)
                
                current_idx = len(df) - 1
                current_price = df.iloc[current_idx]['close']
                
                # Check risk management first
                if self.position and self.check_risk_management(current_price):
                    continue
                
                # Check trading signals
                if not self.position and self.check_buy_conditions(df, current_idx):
                    self.execute_buy(current_price)
                elif self.position and self.check_sell_conditions(df, current_idx):
                    self.execute_sell(current_price, "Sell signal triggered")
                
                # Log status
                if self.position:
                    unrealized_pnl = (current_price - self.position['entry_price']) * self.position['quantity']
                    logger.info(f"Position: {self.position['quantity']} @ {self.position['entry_price']} | Current: {current_price} | Unrealized PnL: {unrealized_pnl:.2f}")
                else:
                    logger.info(f"No position | Capital: {self.capital:.2f}")
                
                # Wait before next iteration
                time.sleep(60)  # Check every minute
                
            except KeyboardInterrupt:
                logger.info("Bot stopped by user")
                break
            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                time.sleep(60)

if __name__ == "__main__":
    # Load configuration
    config = ${JSON.stringify(finalConfig, null, 8)}
    
    # Create and run bot
    bot = TradingBot(config)
    bot.run()
`;
};

const generateJavaScriptBot = (strategy, config = {}) => {
  const defaultConfig = {
    api: {
      key: 'YOUR_API_KEY',
      secret: 'YOUR_SECRET_KEY',
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
  };

  const finalConfig = { ...defaultConfig, ...config };

  return `/**
 * Generated Trading Bot for Strategy: ${strategy.name}
 * Generated on: ${new Date().toISOString()}
 * Description: ${strategy.description || 'No description provided'}
 */

const ccxt = require('ccxt');
const axios = require('axios');

class TradingBot {
    constructor(config) {
        this.config = config;
        this.exchange = null;
        this.position = null;
        this.capital = config.trading.initialCapital;
        this.symbol = config.trading.symbol;
        this.timeframe = config.trading.timeframe;
        this.maxPositionSize = config.trading.maxPositionSize;
        
        // Risk management
        this.stopLoss = config.risk.stopLoss;
        this.takeProfit = config.risk.takeProfit;
        this.maxDrawdown = config.risk.maxDrawdown;
        
        this.setupExchange();
    }
    
    setupExchange() {
        try {
            this.exchange = new ccxt.binance({
                apiKey: this.config.api.key,
                secret: this.config.api.secret,
                sandbox: this.config.api.testnet,
                enableRateLimit: true,
            });
            console.log('Exchange connection established');
        } catch (error) {
            console.error('Failed to connect to exchange:', error);
            throw error;
        }
    }
    
    async getHistoricalData(symbol, timeframe, limit = 100) {
        try {
            const ohlcv = await this.exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
            return ohlcv.map(candle => ({
                timestamp: new Date(candle[0]),
                open: candle[1],
                high: candle[2],
                low: candle[3],
                close: candle[4],
                volume: candle[5]
            }));
        } catch (error) {
            console.error('Failed to fetch historical data:', error);
            return null;
        }
    }
    
    calculateSMA(data, period) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                result.push(null);
            } else {
                const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
                result.push(sum / period);
            }
        }
        return result;
    }
    
    calculateEMA(data, period) {
        const result = [];
        const multiplier = 2 / (period + 1);
        
        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                result.push(data[i]);
            } else {
                result.push((data[i] * multiplier) + (result[i - 1] * (1 - multiplier)));
            }
        }
        return result;
    }
    
    calculateRSI(data, period = 14) {
        const result = [];
        const gains = [];
        const losses = [];
        
        for (let i = 1; i < data.length; i++) {
            const change = data[i] - data[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        
        for (let i = 0; i < data.length; i++) {
            if (i < period) {
                result.push(null);
            } else {
                const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
                const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
                
                if (avgLoss === 0) {
                    result.push(100);
                } else {
                    const rs = avgGain / avgLoss;
                    const rsi = 100 - (100 / (1 + rs));
                    result.push(rsi);
                }
            }
        }
        return result;
    }
    
    calculateMACD(data, fast = 12, slow = 26, signal = 9) {
        const fastEMA = this.calculateEMA(data, fast);
        const slowEMA = this.calculateEMA(data, slow);
        
        const macd = fastEMA.map((fast, i) => fast - slowEMA[i]);
        const signalLine = this.calculateEMA(macd.filter(val => val !== null), signal);
        
        const paddedSignalLine = new Array(macd.length - signalLine.length).fill(null).concat(signalLine);
        const histogram = macd.map((macd, i) => macd - paddedSignalLine[i]);
        
        return { macd, signal: paddedSignalLine, histogram };
    }
    
    calculateBollingerBands(data, period = 20, stdDev = 2) {
        const sma = this.calculateSMA(data, period);
        const result = { upper: [], middle: sma, lower: [] };
        
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                result.upper.push(null);
                result.lower.push(null);
            } else {
                const slice = data.slice(i - period + 1, i + 1);
                const mean = sma[i];
                const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
                const standardDeviation = Math.sqrt(variance);
                
                result.upper.push(mean + (stdDev * standardDeviation));
                result.lower.push(mean - (stdDev * standardDeviation));
            }
        }
        
        return result;
    }
    
    calculateIndicators(data) {
        const close = data.map(candle => candle.close);
        
        // Calculate indicators based on strategy
        ${generateIndicatorCalculations(strategy.indicators)}
        
        return data;
    }
    
    checkBuyConditions(data, currentIdx) {
        if (currentIdx < 1) return false;
        
        const current = data[currentIdx];
        const previous = data[currentIdx - 1];
        
        ${generateConditionChecks(strategy.buyConditions, 'buy')}
        
        return false;
    }
    
    checkSellConditions(data, currentIdx) {
        if (currentIdx < 1) return false;
        
        const current = data[currentIdx];
        const previous = data[currentIdx - 1];
        
        ${generateConditionChecks(strategy.sellConditions, 'sell')}
        
        return false;
    }
    
    calculatePositionSize(price) {
        const maxInvestment = this.capital * this.maxPositionSize;
        return maxInvestment / price;
    }
    
    async executeBuy(price) {
        try {
            const quantity = this.calculatePositionSize(price);
            if (quantity <= 0) return false;
            
            const order = await this.exchange.createMarketBuyOrder(this.symbol, quantity);
            
            this.position = {
                entryPrice: price,
                quantity: quantity,
                entryTime: new Date(),
                stopLoss: price * (1 - this.stopLoss),
                takeProfit: price * (1 + this.takeProfit)
            };
            
            console.log(\`Buy order executed: \${quantity} \${this.symbol} at \${price}\`);
            return true;
        } catch (error) {
            console.error('Failed to execute buy order:', error);
            return false;
        }
    }
    
    async executeSell(price, reason = 'Sell signal') {
        try {
            if (!this.position) return false;
            
            const order = await this.exchange.createMarketSellOrder(this.symbol, this.position.quantity);
            
            const pnl = (price - this.position.entryPrice) * this.position.quantity;
            this.capital += pnl;
            
            console.log(\`Sell order executed: \${this.position.quantity} \${this.symbol} at \${price} (PnL: \${pnl.toFixed(2)}) - \${reason}\`);
            
            this.position = null;
            return true;
        } catch (error) {
            console.error('Failed to execute sell order:', error);
            return false;
        }
    }
    
    checkRiskManagement(currentPrice) {
        if (!this.position) return false;
        
        if (currentPrice <= this.position.stopLoss) {
            this.executeSell(currentPrice, 'Stop loss triggered');
            return true;
        }
        
        if (currentPrice >= this.position.takeProfit) {
            this.executeSell(currentPrice, 'Take profit triggered');
            return true;
        }
        
        return false;
    }
    
    async run() {
        console.log(\`Starting trading bot for \${this.symbol}\`);
        console.log(\`Initial capital: \${this.capital}\`);
        
        while (true) {
            try {
                const data = await this.getHistoricalData(this.symbol, this.timeframe, 100);
                if (!data || data.length < 50) {
                    console.log('Insufficient data, waiting...');
                    await new Promise(resolve => setTimeout(resolve, 60000));
                    continue;
                }
                
                const dataWithIndicators = this.calculateIndicators(data);
                const currentIdx = dataWithIndicators.length - 1;
                const currentPrice = dataWithIndicators[currentIdx].close;
                
                if (this.position && this.checkRiskManagement(currentPrice)) {
                    continue;
                }
                
                if (!this.position && this.checkBuyConditions(dataWithIndicators, currentIdx)) {
                    await this.executeBuy(currentPrice);
                } else if (this.position && this.checkSellConditions(dataWithIndicators, currentIdx)) {
                    await this.executeSell(currentPrice, 'Sell signal triggered');
                }
                
                if (this.position) {
                    const unrealizedPnL = (currentPrice - this.position.entryPrice) * this.position.quantity;
                    console.log(\`Position: \${this.position.quantity} @ \${this.position.entryPrice} | Current: \${currentPrice} | Unrealized PnL: \${unrealizedPnL.toFixed(2)}\`);
                } else {
                    console.log(\`No position | Capital: \${this.capital.toFixed(2)}\`);
                }
                
                await new Promise(resolve => setTimeout(resolve, 60000));
                
            } catch (error) {
                console.error('Error in main loop:', error);
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
        }
    }
}

// Configuration
const config = ${JSON.stringify(finalConfig, null, 4)};

// Create and run bot
const bot = new TradingBot(config);
bot.run().catch(console.error);
`;
};

const generateIndicatorCalculations = (indicators) => {
  if (!indicators || indicators.length === 0) {
    return '// No indicators configured';
  }

  return indicators.map(indicator => {
    const { name, parameters } = indicator;
    const paramStr = Object.entries(parameters || {})
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    switch (name.toLowerCase()) {
      case 'sma':
        return `df['${name}'] = self.calculate_sma(close, ${parameters?.period || 20})`;
      case 'ema':
        return `df['${name}'] = self.calculate_ema(close, ${parameters?.period || 20})`;
      case 'rsi':
        return `df['${name}'] = self.calculate_rsi(close, ${parameters?.period || 14})`;
      case 'macd':
        return `macd, signal, hist = self.calculate_macd(close, ${parameters?.fastPeriod || 12}, ${parameters?.slowPeriod || 26}, ${parameters?.signalPeriod || 9})
df['${name}_macd'] = macd
df['${name}_signal'] = signal
df['${name}_histogram'] = hist`;
      case 'bollinger':
        return `upper, middle, lower = self.calculate_bollinger_bands(close, ${parameters?.period || 20}, ${parameters?.stdDev || 2})
df['${name}_upper'] = upper
df['${name}_middle'] = middle
df['${name}_lower'] = lower`;
      default:
        return `# ${name} indicator calculation (custom implementation needed)`;
    }
  }).join('\n        ');
};

const generateConditionChecks = (conditions, type) => {
  if (!conditions || conditions.length === 0) {
    return `// No ${type} conditions configured
        return false;`;
  }

  return conditions.map(condition => {
    const logic = condition.logic || 'AND';
    const conditionsStr = condition.conditions.map(cond => {
      const { indicator, operator, value } = cond;
      return `current['${indicator}'] ${operator} ${value}`;
    }).join(` ${logic} `);

    return `if (${conditionsStr}):
            return True`;
  }).join('\n        ');
};

module.exports = {
  generatePythonBot,
  generateJavaScriptBot
};
