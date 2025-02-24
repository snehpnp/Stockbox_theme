"use strict";

const { Schema, model } = require('mongoose');

const BroadcastSchema = new Schema({
   
    subject: {
        type: String,
        trim: true,
        default: null
    },
    message: {
        type: String,
        trim: true,
        default: null
    },
    service: {
        type: String,
        trim: true,
        default: null
    },
    type: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Boolean,
        default: true // assuming true means active and false means inactive
    },
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Broadcast = model('Broadcast', BroadcastSchema);

module.exports = Broadcast;
