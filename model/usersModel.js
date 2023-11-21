const mongoose = require("mongoose");
const Schema=mongoose


  const UsersSchema = new mongoose. Schema({
    Full_Name: { type: String, required: true },
    Email_Id: { type: String, required: true, unique: true },
    Password: { type: String, required: true, minlength: 6 },
    Wallet_Balance: { type: Number },
    Created:{type:Date},
    isActive:{type:Boolean},
    Verified:{type:Boolean},
    Mobile_Number:{type:Number},
    Coupons:[{Coupon_id:{
      type:Schema.Types.ObjectId,ref:'coupon'
    },
     TimesUsed:{
         type:Number
     }
}],
    
  });


  const userModel=mongoose.model('Users',UsersSchema)

  module.exports=userModel