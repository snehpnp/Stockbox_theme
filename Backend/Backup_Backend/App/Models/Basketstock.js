"use strict";

const { Schema, model } = require('mongoose');

const BasketstockSchema = new Schema({
    basket_id: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    tradesymbol: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    weightage: {
        type: Number,
        default: 0
    },
    total_value: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        trim: true,
        default: null
    },
    type: {
        type: String,
        trim: true,
        default: null
    },
    version: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        enum: [1, 0],
        default: 0
    },
    del: {
        type: Boolean,
        default: false // Indicates whether the Basket is marked as deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Basketstock = model('Basketstock', BasketstockSchema);

module.exports = Basketstock;
