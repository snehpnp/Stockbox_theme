"use strict";

const { Schema, model } = require('mongoose');

const BankSchema = new Schema({
   
    name: {
        type: String,
        trim: true,
        default: null
    },
    branch: {
        type: String,
        trim: true,
        default: null
    },
    accountno: {
        type: String,
        trim: true,
        default: null
    },
    ifsc: {
        type: String,
        trim: true,
        default: null
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    type: {
        type: Number,
        min: 0
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
const Bank = model('Bank', BankSchema);

module.exports = Bank;
