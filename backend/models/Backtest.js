const mongoose = require('mongoose');


const tradeSchema = new mongoose.Schema({
  timestamp: Date,
  symbol: String,
  
});