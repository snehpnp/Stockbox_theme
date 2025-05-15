
"use strict";

const { Schema, model } = require('mongoose');

const StockSchema = new Schema({
    symbol: {
        type: String,
        index: true,
        default: null
    },
    expiry: {
        type: String,
        index: true,
        default: null

    },
    expiry_month_year: {
        type: String,
        default: null
    },
    expiry_date: {
        type: String,
        default: null
    },
    expiry_str: {
        type: String,
        default: null
    },
    strike: {
        type: String,
        index: true,
        default: null
    },
    option_type: {
        type: String,
        index: true,
        default: null
    },
    segment: {
        type: String,
        index: true,
        default: null
    },
    instrument_token: {
        type: String,
        default: null
        // unique: true
        
    },
    lotsize: {
        type: String,
        default: null
    },
    tradesymbol: {
        type: String,
        default: null
    },  
    exch_seg: {
        type: String,
        default: null
    },
    tradesymbol_m_w: {
        type: String,
        default: null
    },
    tkr : {
        type: String,
        default: null
    },
    a3tkr : {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
});

// Define the model
const Stock = model('Stock', StockSchema);
module.exports = Stock;

