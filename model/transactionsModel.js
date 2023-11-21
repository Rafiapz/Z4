const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;



const TransactionsSchema = new mongoose. Schema({
    User_id: {
        type: Schema.Types.ObjectId ,required:true,ref:'Users' },
    Order_id:{
        type:Schema.Types.ObjectId,required:true},   
    Amount: {
         type: Number,required:true },
    Date: { 
        type: Date,required:true },
    Method: {
         type: String ,required:true},
    Status: {
         type: String,required:true },
  });
  
  const Transactions = mongoose.model('Transactions', TransactionsSchema);

  module.exports=Transactions