"use strict"

const { Schema, model } = require('mongoose');

const BasketgraphdataSchema = Schema({
    basket_id: {
        type: Schema.Types.ObjectId,
        ref: 'Basket', // Assuming there's a 'Plan' model to reference
        required: true
    },
    profitloss: {
        type: Number,
        trim: true,
        default: 0
    },
    profitlosspercentage: {
        type: Number,
        trim: true,
        default: 0
    },
    apiprofitloss: {
        type: Number,
        trim: true,
        default: 0
    },
  
    
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}

)
const Basketghaphdata_Modal = model('Basketghaphdata', BasketgraphdataSchema);



module.exports = Basketghaphdata_Modal;
