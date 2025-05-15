"use strict";

const { Schema, model } = require('mongoose');

const HelpdeskSchema = new Schema({
    client_id: {
        type: String,
        trim: true,
        default: null
    },
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
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Helpdesk = model('Helpdesk', HelpdeskSchema);

module.exports = Helpdesk;
