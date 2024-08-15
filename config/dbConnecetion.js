const mongoose = require('mongoose')

// const user = process.env.MONGO_USERNAME;
// const pass = process.env.MONGO_PASSWORD;

// mongoose.connect("mongodb://127.0.0.1:27017/Z4_SHEET", {
//   auth: {
//     username: user,
//     password: pass,
//   },
//   authSource: "admin",
// })


const connection_string = process.env.DB_CONNECTION_STRING
mongoose.connect(connection_string)

  .then(() => {
    console.log("DATABASE CONNECTED SUCCESFULLY");
  })
  .catch(() => {
    console.log("FAILED TO CONNECT DATABASE");
  });


module.exports = mongoose