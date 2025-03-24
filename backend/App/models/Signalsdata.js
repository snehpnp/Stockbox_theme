"use strict"

const { Schema, model, Types } = require('mongoose');

const signalsdataModel = Schema({
    stock: {
        type: String,
        required: true,
        default: null
    },
    strategy_name: {
        type: String,
        trim: true,
        default: null
    },
    service: {
        type: String,
        required: true,
        default: null
    },
    callduration: {
        type: String,
        trim: true,
        default: null
    },
    report: {
        type: String,
        trim: true,
        default: null
    },
    description: {
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
    add_by: {
        type: String,
        trim: true,
        default: null
    },
    planid: {
        type: String,
        trim: true,
        default: null
    },
    profitlosstype: {
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

const Signalsdata_model = model('Signalsdata', signalsdataModel);

module.exports = Signalsdata_model;
