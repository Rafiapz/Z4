const mongoose = require('mongoose')
const Schema=mongoose

const ReviewSchema = new mongoose.Schema({
    User_id: {
        type: Schema.Types.ObjectId,
        require:true,
        ref:'Users'
    },
    Product_id: {
        type: Schema.Types.ObjectId,
        require:true,ref:'products'
    },
    Feedback: { type: String },
    Rating: { type: Number },
    Image:{type:String}
});



const Reviewmodel=new mongoose.model('Review',ReviewSchema)

module.exports=Reviewmodel