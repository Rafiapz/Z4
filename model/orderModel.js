const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const OrdersSchema = new mongoose.Schema({
    Order_Date: {
        type: Date, required: true
    },
    Payment_Method: {
        type: String, required: true
    },
    Payment_Status:{type:String},
    User_id: {
        type: Schema.Types.ObjectId, required: true,ref:'Users'
    },
    Status: {
        type: String, required: true
    },
    Items: [{
            Product_id: { type: Schema.Types.ObjectId, required: true },
            Name:{type:String},
            Quantity: { type: Number, required: true },
            Order_Price:{ type: Number},
            Image:{type:String}
        }],
    Shipping_Address: { type: Schema.Types.ObjectId, required: true ,ref:'ShippingAdress'},
    Total_Amount:{
        type:Number,

    },
    Expected_Delivery_Date:{type:Date},
    Delivery_Date:{type:Date},
    Return_Available:{type:Boolean},
    Refund_Status:{type:String},

    
});

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports=Orders

