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
});