"use strict"

const { Schema, model } = require('mongoose');

const AddtocartModel = Schema({
    plan_id: {
        type: Schema.Types.ObjectId,
        ref: 'Plan', 
        default: null
    },
    basket_id: {
        type: Schema.Types.ObjectId,
        ref: 'Basket', 
        default: null
    },
    client_id: {
        type: Schema.Types.ObjectId,
        ref: 'Clients', 
        default: null
    },
    status: {
        type: Boolean,
        default: false 
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
const Addtocart_Model = model('Addtocart', AddtocartModel);



module.exports = Addtocart_Model;
