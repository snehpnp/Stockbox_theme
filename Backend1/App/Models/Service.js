"use strict";

const { Schema, model } = require('mongoose');

const ServiceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    segment: {
        type: String,
        trim: true,
        default: null
    },
    add_by: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    status: {
        type: Boolean,
        default: true // assuming true means active and false means inactive
    },
    del: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Service = model('Service', ServiceSchema);

module.exports = Service;
