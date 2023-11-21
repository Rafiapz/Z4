require("dotenv").config();
const express = require("express");
const handlebars = require("express-handlebars");
const PORT = process.env.PORT || 7100;
const path = require("path");
const app = express();
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const bodyParser = require("express").json;
const database = require("./config/dbConnecetion");
const session = require("express-session");
const nocache = require("nocache");
const flash=require('express-flash')

const oneMonth = 1000 * 60 * 60 * 24 * 30;

app.use(
  session({
    secret: process.env.secretkey,
    saveUninitialized: false,
    cookie: {
      maxAge: oneMonth,
    },
    resave: false,
  })
);


app.use(nocache());

app.use(flash())

app.set("view engine", "handlebars");


app.engine(
  "handlebars",
  handlebars.engine({
    layoutsDir: __dirname + "/views/layout",
    defaultLayout: "index",
    extname: "handlebars",
    partialsDir: __dirname + "/views/partials",
  })

);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser());

app.use("/", userRoute);

app.use("/admin", adminRoute);



app.use((req, res) => {
  res.status(404);
  res.render('usersfold/error')
})

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON THE PORT ${PORT}`);
});
