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
});