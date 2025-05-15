"use strict";

const { Schema, model } = require('mongoose');

const CouponSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed'],  // Example types: 'percentage' or 'fixed'
        trim: true
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        default: true // assuming true means active and false means inactive
    },
    add_by: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    minpurchasevalue: {
        type: Number,
        required: true,
        default: null
    },
    mincouponvalue: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    showstatus: {
        type: Number,
        default: 0
    },
    limitation: {
        type: Number,
        default: 0
    },
    totallimitation: {
        type: Number,
        default: 0
    },
    service: {
        type: String,
        default: null
    },
    del: {
        type: Boolean,
        default: false // Indicates whether the coupon is deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Coupon = model('Coupon', CouponSchema);

module.exports = Coupon;
