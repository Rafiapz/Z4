const mongoose=require('mongoose')
const Schema=mongoose


const wishlistSchema=new mongoose.Schema({

    User_id:{
        type:Schema.Types.ObjectId,
        required:true,
        
    },
    Items: [{
        Product_id: { 
            type: Schema.Types.ObjectId,
            ref: 'products'
            
        },
        
     }],
    
})


const wishlistmodel=new mongoose.model('wishlist',wishlistSchema)

module.exports=wishlistmodel
