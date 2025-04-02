"use strict";

const { Schema, model } = require('mongoose');

const PlancategorySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    service: {
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
const Plancategory = model('Plancategory', PlancategorySchema);

module.exports = Plancategory;
