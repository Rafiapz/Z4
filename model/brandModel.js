const mongoose=require('mongoose')

const brandSchema=new mongoose.Schema({
    Name:{
       type: String,
        required:true,
        unique:true
    }
})

const brandModel=mongoose.model('Brands',brandSchema)


module.exports=brandModel