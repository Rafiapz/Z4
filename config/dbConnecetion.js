const mongoose=require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/Z4_SHEET")
  
  .then(() => {
    console.log("DATABASE CONNECTED SUCCESFULLY");
  })
  .catch(() => {
    console.log("FAILED TO CONNECT DATABASE");
  });

  
  module.exports=mongoose