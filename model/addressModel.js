const mongoose = require('mongoose')
const Schema=mongoose

const ShippingAdressSchema = new mongoose. Schema({
    User_id: {
        type: Schema.Types.ObjectId, required: true
    },
    FullName: {
        type: String,
        required: true
    },
    MobileNumber: {
        type: Number,
        required: true
    },
    Locality: {
        type: String
    },
    HouseNo: {
        type: String
    },
    PinCode: {
        type: Number,
        required: true
    },
    City: {
        type: String
    },
   
});

const ShippingAddress = mongoose.model('ShippingAdress', ShippingAdressSchema);

module.exports=ShippingAddress
