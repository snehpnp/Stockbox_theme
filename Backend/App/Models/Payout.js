"use strict";

const { Schema, model } = require('mongoose');

const PayoutSchema = new Schema({
    clientid: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: Number,
        enum: [0, 1, 2], 
        default: 0 
    },
    remark: {
        type: String,
        trim: true
    },
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Payout = model('Payout', PayoutSchema);

module.exports = Payout;
