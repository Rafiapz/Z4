const mongoose = require('mongoose')

const user = process.env.MONGO_USERNAME;
const pass = process.env.MONGO_PASSWORD;

// mongoose.connect("mongodb://127.0.0.1:27017/Z4_SHEET", {
//   auth: {
//     username: user,
//     password: pass,
//   },
//   authSource: "admin",
// })


mongoose.connect('mongodb+srv://rafikandathuvayal:atlasPassword@cluster0.trekfmx.mongodb.net/')

  .then(() => {
    console.log("DATABASE CONNECTED SUCCESFULLY");
  })
  .catch(() => {
    console.log("FAILED TO CONNECT DATABASE");
  });


module.exports = mongoose