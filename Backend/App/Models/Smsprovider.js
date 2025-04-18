"use strict";

const { Schema, model } = require('mongoose');

const SmsproviderSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    apikey: {
        type: String,
        trim: true,
        default: null
    },
    username: {
        type: String,
        trim: true,
        default: null 
    },
    password: {
        type: String,
        trim: true,
        default: null 
    },
    route: {
        type: String,
        trim: true,
        default: null 
    },
    entity_id: {
        type: String,
        trim: true,
        default: null 
    },
    sender: {
        type: String,
        trim: true,
        default: null 
    },
    url: {
        type: String,
        trim: true,
        default: null 
    },
    status: {
        type: Number,
        enum: [0, 1], // Example statuses
        default: 0
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Smsprovider = model('Smsprovider', SmsproviderSchema);

module.exports = Smsprovider;
