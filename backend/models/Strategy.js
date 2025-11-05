const mongoose = require('mongoose');

const indicatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
});