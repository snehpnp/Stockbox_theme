"use strict";

const { Schema, model } = require('mongoose');

const CompanySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
	key: {
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
        type: Boolean,
        default: true // assuming true means active and false means inactive
    },
    del: {
        type: Boolean,
        default: false // assuming false means not deleted
    },
    theme_id: {
        type: Schema.Types.ObjectId,
        ref: 'Theme',
        required: true
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Company = model('Company', CompanySchema);

module.exports = Company;
