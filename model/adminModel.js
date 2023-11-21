const mongoose=require('mongoose')

const adminSchema = new mongoose. Schema({
    Full_Name: { type: String, required: true },
    Email_Id: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Created:{type:Date},
    Status:{type:String}
  });

 


  const adminModel=mongoose.model('admins',adminSchema)

  module.exports=adminModel
  