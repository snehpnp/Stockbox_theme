"use strict";
const { Schema, model } = require('mongoose');

const StockLivePriceSchema = new Schema({
  token: {
    type: String,
    default: null
  },
  lp: {
    type: Number, // Assuming 'lp' stands for the live price
    required: true,
  },
  exc: {
    type: String, // Exchange
    required: true,
  },
  curtime: {
    type: String, // Current time in HHmm format
    required: true,
  },
  ft: {
    type: String, // Some additional field 'ft' (can be further defined)
    required: true,
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const StockLivePrice = model('StockLivePrice', StockLivePriceSchema);

module.exports = StockLivePrice;