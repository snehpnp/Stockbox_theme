"use strict";

const { Schema, model } = require('mongoose');

const PlanSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    accuracy: {
        type: String,
      //  required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    // Rename total_month_service to totaldays
    validity: {
        type: String,
        required: true,
        default: null
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Plancategory', // Assuming there's a 'Service' model to reference
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'], // Example statuses
        default: 'active'
    },
    add_by: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    deliverystatus: {
        type: Boolean,
        default: false // Indicates whether the plan is marked as deleted
    },
    del: {
        type: Boolean,
        default: false // Indicates whether the plan is marked as deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Plan = model('Plan', PlanSchema);

module.exports = Plan;
