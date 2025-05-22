"use strict";

const { Schema, model } = require('mongoose');

const CloverSchema = new Schema({
   
    image: {
        type: String,
        trim: true,
        default: null
    },
    title: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Boolean,
        default: true // assuming true means active and false means inactive
    },
    add_by: {
        type: String,
        trim: true,
        default: null
    },
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Clover = model('Clover', CloverSchema);

module.exports = Clover;
