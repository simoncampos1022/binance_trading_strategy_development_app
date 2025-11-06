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
  }]
});