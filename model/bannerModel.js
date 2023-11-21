const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;


const bannerSchema=new mongoose.Schema({

    Banner_Title:{
        type:String,
        required:true,
        unique:true
    },
    IsActive:{
        type:Boolean,
        required:true
    },
    Banner_Image:{
        type:String,
        required:true
    }
})

const bannerModel=mongoose.model('banner',bannerSchema)

module.exports=bannerModel