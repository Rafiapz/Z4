const mongoose=require('mongoose')
const Schema=mongoose


const CartSchema=new mongoose.Schema({

    User_id:{
        type:Schema.Types.ObjectId,
        required:true,
        
    },
    Items: [{
        Product_id: { 
            type: Schema.Types.ObjectId,
            ref: 'products'
            
        },
        Quantity: { type: Number },
     }],
    
})


const cartmodel=new mongoose.model('cart',CartSchema)

module.exports=cartmodel
