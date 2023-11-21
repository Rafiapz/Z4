const mongoose = require('mongoose')
const{Schema,ObjectId}=mongoose

const walletSchema=new mongoose.Schema({
    
    User_id:{
        type:Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    Balance:{
        type:Number
    },
    History:[{
        Amount:{type:Number},
        Date:{type:Date},
        Transaction:{type:String}
    }]

})

const walletModel=new mongoose.model('Wallet',walletSchema)

module.exports=walletModel