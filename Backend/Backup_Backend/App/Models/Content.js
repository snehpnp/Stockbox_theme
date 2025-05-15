"use strict";

const { Schema, model } = require('mongoose');

const ContentSchema = new Schema({
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
    del: {
        type: Boolean,
        default: false // Indicates whether the coupon is deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Content = model('content', ContentSchema);

module.exports = Content;
