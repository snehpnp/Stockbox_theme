"use strict";

const { Schema, model } = require('mongoose');

const RoleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    permission: {
        type: [String], // Array of strings to store permissions
        default: []
    },
    add_by: {
        type: String,
        default: 0
    },
    del: {
        type: Boolean,
        default: false // Indicates whether the plan is marked as deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Role = model('Role', RoleSchema);

module.exports = Role;
