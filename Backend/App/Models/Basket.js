"use strict";

const { Schema, model } = require('mongoose');

const BasketSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    themename: {
        type: String,
        required: true,
        trim: true
    },
    add_by: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    full_price: {
        type: Number,
        default: 0
    },
    basket_price: {
        type: Number,
        required: true,
        default: 0
    },
    mininvamount: {
        type: Number,
        required: true,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0
    },
    portfolioweightage: {
        type: Number,
        default: 0
    },
    cagr: {
        type: String,
        trim: true,
        default: null
    },
    cagr_live: {
        type: String,
        trim: true,
        default: null
    },
    frequency: {
        type: String,
        trim: true,
        default: null
    },
    validity: {
        type: String,
        trim: true,
        default: null
    },
    type: {
        type: String,
        trim: true,
        default: null
    },
    next_rebalance_date: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Boolean,
        default: false // assuming true means active and false means inactive
    },
    publishstatus: {
        type: Boolean,
        default: false // assuming true means active and false means inactive
    },
    rebalancestatus: {
        type: Boolean,
        default: false // assuming true means active and false means inactive
    },
    short_description: {
        type: String,
        trim: true,
        default: null
    },
    rationale: {
        type: String,
        trim: true,
        default: null
    },
    methodology: {
        type: String,
        trim: true,
        default: null
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    url: {
        type: String,
        trim: true,
        default: null
    },
    del: {
        type: Boolean,
        default: false // Indicates whether the Basket is marked as deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Basket = model('Basket', BasketSchema);

module.exports = Basket;
