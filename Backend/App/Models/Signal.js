"use strict"

const { Schema, model, Types } = require('mongoose');

const signalModel = Schema({
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
    service: {
        type: String,
        required: true,
        default: null
    },
    calltype: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    callduration: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    callperiod: {
        type: String,
        trim: true,
        default: null
    },
    report: {
        type: String,
        trim: true,
        default: null
    },
    stock: {
        type: String,
        required: true,
        default: null
    },
    tag1: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    tag2: {
        type: String,
        trim: true,
        default: null
    },
    tag3: {
        type: String,
        trim: true,
        default: null
    },
    stoploss: {
        type: String,
        trim: true,
        default: null
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    closeprice: {
        type: String,
        trim: true,
        default: null
    },
    close_status: {
        type: Boolean,
        default: false // Assuming true means active and false means inactive
    },
    close_description: {
        type: String,
        trim: true,
        default: null
    },
    closedate: {
        type: Date,
        default: null // Date when the signal was closed
    },
    targethit1: {
        type: String,
        trim: true,
        default: null
    },
    targetprice1: {
        type: String,
        trim: true,
        default: null
    },
    targethit2: {
        type: String,
        trim: true,
        default: null
    },
    targetprice2: {
        type: String,
        trim: true,
        default: null
    },
    targethit3: {
        type: String,
        trim: true,
        default: null
    },
    targetprice3: {
        type: String,
        trim: true,
        default: null
    },
    expirydate: {
        type: String,
        trim: true,
        default: null // Date when the signal was closed
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
    lotsize: {
        type: String,
        trim: true,
        default: null
    },
    add_by: {
        type: String,
        trim: true,
        default: null
    },
    entrytype: {
        type: String,
        default: "0"
    },
    lot: {
        type: String,
        default: "0"
    },
    planid: {
        type: String,
        trim: true,
        default: null
    },
    del: {
        type: Number,
        enum: [1, 0],
        default: 0
    }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Signal_model = model('Signal', signalModel);

module.exports = Signal_model;
