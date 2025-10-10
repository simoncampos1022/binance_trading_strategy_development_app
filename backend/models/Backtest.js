const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  timestamp: Date,
  symbol: String,
  side: {
    type: String,
    enum: ['buy', 'sell']
  },
  price: Number,
  quantity: Number,
  pnl: Number,
  reason: String
});

const backtestSchema = new mongoose.Schema({
  strategy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strategy',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  timeframe: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  initialCapital: {
    type: Number,
    required: true,
    default: 10000
  },
  results: {
    totalReturn: Number,
    totalReturnPercent: Number,
    sharpeRatio: Number,
    maxDrawdown: Number,
    maxDrawdownPercent: Number,
    winRate: Number,
    totalTrades: Number,
    winningTrades: Number,
    losingTrades: Number,
    avgWin: Number,
    avgLoss: Number,
    profitFactor: Number,
    avgTradeReturn: Number,
    bestTrade: Number,
    worstTrade: Number,
    finalCapital: Number
  },
  trades: [tradeSchema],
  equityCurve: [{
    timestamp: Date,
    equity: Number,
    drawdown: Number
  }],
  monthlyReturns: [{
    month: String,
    return: Number
  }],
  parameters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['running', 'completed', 'failed', 'cancelled'],
    default: 'running'
  },
  error: String,
  executionTime: Number // in milliseconds
}, {
  timestamps: true
});

// Index for better query performance
backtestSchema.index({ user: 1, createdAt: -1 });
backtestSchema.index({ strategy: 1 });
backtestSchema.index({ status: 1 });

module.exports = mongoose.model('Backtest', backtestSchema);
