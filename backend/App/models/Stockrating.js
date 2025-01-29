
"use strict";

const { Schema, model } = require('mongoose');

const StockratingSchema = new Schema({
    symbol: {
        type: String,
        required: true,
        trim: true,
    },
    valuation: {
        type: Number,
        default: 0
    },
    trust: {
        type: Number,
        default: 0
    },
    technicals: {
        type: Number,
        default: 0
    },
    financial: {
        type: Number,
        default: 0
    },
    overall: {
        type: Number,
        default: 0
    },
    del: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Stockrating = model('Stockrating', StockratingSchema);
module.exports = Stockrating;

