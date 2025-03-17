"use strict";

const { Schema, model } = require('mongoose');

const MailtemplateSchema = new Schema({
    mail_type: {
        type: String,
        required: true,
        trim: true
    },
    mail_subject: {
        type: String,
        required: true,
        trim: true
    },
    mail_body: {
        type: String,
        required: true,
        trim: true // assuming true means active and false means inactive
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Mailtemplate = model('Mailtemplate', MailtemplateSchema);

module.exports = Mailtemplate;
