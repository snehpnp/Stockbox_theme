"use strict";

const { Schema, model } = require('mongoose');

const LicenseSchema = new Schema({
   
    month: {
        type: String,
        trim: true,
        default: null
    },
    noofclient: {
        type: Number,
        trim: true,
        default: 0
    },
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const License = model('License', LicenseSchema);

module.exports = License;
