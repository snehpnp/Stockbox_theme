"use strict";

const { Schema, model } = require('mongoose');

const TicketSchema = new Schema({
    client_id: {
        type: Schema.Types.ObjectId,
        ref: 'CLIENTS', // Assuming there's a 'Client' model to reference
        required: true
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
    ticketnumber: {
        type: String,
        trim: true,
        default: null
    },
    attachment: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Number,
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
const Ticket = model('Ticket', TicketSchema);

module.exports = Ticket;
