"use strict"

const { Schema, model } = require('mongoose');

const OrderModel = Schema({
    clientid: {
        type: String,
        trim: true,
        default: null
    },
    signalid: {
        type: String,
        trim: true,
        default: null
    },
    orderid: {
        type: String,
        trim: true,
        default: null
    },
    uniqueorderid: {
        type: String,
        trim: true,
        default: null
    },
    borkerid: {
        type: String,
        trim: true,
        default: null
    },
    quantity: {
        type: Number,
        trim: true,
        default: 0
    },
    exitquantity: {
        type: Number,
        trim: true,
        default: 0
    },
    ordertype: {
        type: String,
        trim: true,
        default: null
    },
    tsprice: {
        type: Number,
        default: 0
    },
    slprice: {
        type: Number,
        default: 0
    },
    tsstatus: {
        type: Number,
        default: 0
    },
    ordertoken: {
        type: String,
        trim: true,
        default: null
    },
    exchange: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: Number,
        enum: [0, 1], // Example statuses
        default: 0
    },
    data: {
        type: Schema.Types.Mixed,  // Changed to Mixed to allow for objects
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
   
    
},
    {
        timestamps: true
    },

)
const Order_Model = model('OrderModel', OrderModel);



module.exports = Order_Model;
