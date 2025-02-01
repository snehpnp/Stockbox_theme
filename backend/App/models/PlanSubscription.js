"use strict";

const { Schema, model } = require('mongoose');

const PlanSubscriptionSchema = new Schema({
    plan_id: {
        type: Schema.Types.ObjectId,
        ref: 'Plan', // Assuming there's a 'Plan' model to reference
        required: true
    },
    client_id: {
        type: Schema.Types.ObjectId,
        ref: 'Client', // Assuming there's a 'Client' model to reference
        required: true
    },
    plan_price: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        min: 0,
        default: 0
    },
    plan_start: {
        type: Date,
        required: true
    },
    plan_end: {
        type: Date,
        required: true
    },
    validity: {
        type: String,
        required: true,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'], // Example statuses
        default: 'active'
    },
    orderid: {
        type: String,
        default: null
    },
    ordernumber: {
        type: String,
        default: null
    },
    invoice: {
        type: String,
        default: null
    },
    coupon: {
        type: String,
        default: null
    },
    plan_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Plancategory', 
        default: null
    },
    del: {
        type: Boolean,
        default: false // Indicates whether the subscription is marked as deleted
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const PlanSubscription = model('PlanSubscription', PlanSubscriptionSchema);

module.exports = PlanSubscription;
