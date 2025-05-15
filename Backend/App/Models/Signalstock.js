"use strict"

const { Schema, model } = require('mongoose');

const signalstockModel = Schema({
    signal_id: {
        type: Schema.Types.ObjectId,
        ref: 'Signals',
        required: true
    },
    price: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    strikeprice: {
        type: String,
        trim: true,
        default: null
    },
    calltype: {
        type: String,
        trim: true,
        default: null
    },
    closeprice: {
        type: String,
        trim: true,
        default: null
    },
    segment: {
        type: String,
        trim: true,
        default: null
    },
    optiontype: {
        type: String,
        trim: true,
        default: null
    },
    tradesymbol: {
        type: String,
        trim: true,
        default: null
    },
    tradesymbols: {
        type: String,
        trim: true,
        default: null
    },
    lotsize: {
        type: String,
        trim: true,
        default: null
    },
    expirydate: {
        type: String,
        trim: true,
        default: null
    },
    lot: {
        type: String,
        default: "0"
    },
    del: {
        type: Number,
        enum: [1, 0],
        default: 0
    }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Signalstock_model = model('Signalstock', signalstockModel);

module.exports = Signalstock_model;
