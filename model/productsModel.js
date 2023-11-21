const mongoose=require('mongoose')
const {Schema,ObjectID}=mongoose
const categorySchema=require('../model/categoryModel')


const productSchema=new mongoose.Schema({

    Name:{
        type:String,
        require:true,

    },
    Description:{
        type:String,
        
    },
    Price:{
        type:Number,
        required:true,
    },
    DiscountPrice:{
        type:Number,
    },
    Color:{
        type:String,
        required:true
    },
    RAM:{
        type:String,
        require:true,
    },
    InternalStorage:{
        type:String,
        required:true
    },
    Stock:{
        type:Number,
        require:true
    },
    IsActive:{
        type:Boolean,
        required:true
    },
    Category:{
        type:Schema.Types.ObjectId,
        required:true
    },
    Brand:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    Images:{
        type:Array,
        required:true
    },
    Average_Rating:{
        type:Array
    },
    Offer_Percentage:{
        type:Number
    }
   
})

const products =new mongoose.model('products',productSchema)

module.exports=products
