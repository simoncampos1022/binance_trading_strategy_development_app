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
});