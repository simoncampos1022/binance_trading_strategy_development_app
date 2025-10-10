const mongoose = require('mongoose');

const indicatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parameters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  timeframe: {
    type: String,
    required: true
  }
});

const conditionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['buy', 'sell', 'hold'],
    required: true
  },
  logic: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND'
  },
  conditions: [{
    indicator: {
      type: String,
      required: true
    },
    operator: {
      type: String,
      enum: ['>', '<', '>=', '<=', '==', '!=', 'crosses_above', 'crosses_below'],
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    timeframe: {
      type: String,
      required: true
    }
  }]
});

const strategySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['trend', 'momentum', 'mean_reversion', 'arbitrage', 'custom'],
    default: 'custom'
  },
  symbols: [{
    type: String,
    required: true
  }],
  timeframes: [{
    type: String,
    required: true
  }],
  indicators: [indicatorSchema],
  buyConditions: [conditionSchema],
  sellConditions: [conditionSchema],
  riskManagement: {
    stopLoss: {
      type: Number,
      default: 0.02 // 2% stop loss
    },
    takeProfit: {
      type: Number,
      default: 0.04 // 4% take profit
    },
    maxPositionSize: {
      type: Number,
      default: 0.1 // 10% of portfolio
    },
    maxDrawdown: {
      type: Number,
      default: 0.15 // 15% max drawdown
    }
  },
  backtestResults: {
    totalReturn: Number,
    sharpeRatio: Number,
    maxDrawdown: Number,
    winRate: Number,
    totalTrades: Number,
    avgTradeReturn: Number,
    lastBacktest: Date
  },
  code: {
    python: String,
    javascript: String
  },
  tags: [String],
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
strategySchema.index({ author: 1, isActive: 1 });
strategySchema.index({ isPublic: 1, category: 1 });
strategySchema.index({ tags: 1 });

module.exports = mongoose.model('Strategy', strategySchema);
