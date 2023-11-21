const mongoose = require('mongoose')
const Schema = mongoose

const CouponSchema = new mongoose. Schema({

    Code: { type: String, required: true, unique: true },
    Discount: { type: Number, required: true },
    CouponType: { type: String, required: true },
    MinimumOrderAmount: { type: Number },
    IsActive: { type: Boolean, required: true },
    CreatedAt:{type:Date,required:true},
    ExpiryDate: { type: Date, required: true },    
    UsageLimit: { type: Number, required: true },
    
  });

  

const couponModel = mongoose.model('coupon', CouponSchema);

module.exports=couponModel

