const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const brandOfferSchema=new mongoose.Schema({

    OfferName:{
        type:String,
        required:true
    },
    Brand:{
        type:Schema.Types.ObjectId, require:true, ref:'Brands',
        unique:true     
       
    },
    Discount:{
        type:Number,
        required:true
    },
    Created_Date:{
        type:Date,
        required:true
    },
    Expiry_Date:{
        type:Date,
        required:true
    },
    IsActive:{
        type:Boolean,
        required:true
    }

})

const brandOfferModel=mongoose.model('brandOffer',brandOfferSchema)

module.exports=brandOfferModel

