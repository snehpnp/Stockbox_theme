"use strict";

const { Schema, model } = require('mongoose');

const TicketmessageSchema = new Schema({
   client_id: {
           type: Schema.Types.ObjectId,
           ref: 'Client', 
           default: null
       },
    message: {
        type: String,
        trim: true,
        default: null
    },
    ticket_id: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    attachment: {
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
const Ticketmessage = model('Ticketmessage', TicketmessageSchema);

module.exports = Ticketmessage;
