
"use strict";

const { Schema, model } = require('mongoose');

const StockSchema = new Schema({
    symbol: {
        type: String,
        index: true
    },
    expiry: {
        type: String,
        index: true

    },
    expiry_month_year: {
        type: String,
    },
    expiry_date: {
        type: String,
    },
    expiry_str: {
        type: String,
    },
    strike: {
        type: String,
        index: true
    },
    option_type: {
        type: String,
        index: true
    },
    segment: {
        type: String,
        index: true
    },
    instrument_token: {
        type: String,
        // unique: true
        
    },
    lotsize: {
        type: String,
    },
    tradesymbol: {
        type: String,
    },  
    exch_seg: {
        type: String,
    },
    tradesymbol_m_w: {
        type: String,
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

