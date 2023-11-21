const userCol = require("../model/usersModel");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cartCol = require("../model/cartModel");
const { ObjectId } = require("mongoose").Types;
const path=require('path')
const wishCol=require('../model/wishlistModel')

async function isUserinSession(req, res, next) {

  
  if (req.session.userId) {
    
    const userData=await userCol.findOne({_id:req.session.userId}).lean()

    if(userData.isActive==true){
      
      next()
    }else{
     
      req.session.userId=false
      res.render('usersfold/blocked',{user:true})
    }
   
  } else {
  
    res.render("usersfold/login", { user: true, userId: req.session.Email_Id });
  }
}


function signupSession(req, res, next) {

  try {
    if (req.session.userId) {
    res.redirect("/");
  } else {
    const referral=req.query.id
    
    res.render("usersfold/signup", { user: true,referral,error: req.flash(), });
  }
  } catch (error) {
    console.log(error);
  }
  
}

function verifySession(req, res, next) {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    next();
  }
}

async function authUser(req, res, next) {
  try {
    const formData = req.body;
    const userdata = await userCol.findOne({ Email_Id: formData.Email_Id }).lean()
    if (!userdata) {
      res.render("usersfold/login", {
        invalid: "invalid username or password",
        user: true,
      });
    } else {
      let validate = await bcrypt.compare(formData.Password, userdata.Password);
      if (validate == true && userdata.isActive == true) {
        req.session.userId = userdata._id;
        req.session.Email_Id = userdata.Email_Id;
        

        res.redirect("/");
      } else {
        res.render("usersfold/login", {
          invalid: "Incorrect username or Password",
          user: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function cartCount(req, res, next) {
  try {
    if (req.session.userId) {
      const countData = await cartCol.findOne({ User_id: req.session.userId });
      const wishListCountData=await wishCol.findOne({User_id: req.session.userId})
      let user=req.session.userId
      
      user=new ObjectId(req.session.userId)
      
      const userdata = await userCol.findOne({ _id: user }).lean()   
          
      res.locals.name=userdata.Full_Name
      if (countData) {
        const cartCount = countData.Items.length;
        if(cartCount==0){
          res.locals.cartcount=null
        }else{
        res.locals.cartcount = cartCount;    
        }    
      }   
      if(wishListCountData){

        const wishListCount=wishListCountData.Items.length
        if(wishListCount==0){
          res.locals.wishListCount=null
        }else{
        res.locals.wishListCount=wishListCount
        }
      }       
      
    }else{
      res.locals.cartcount=null 
    }   

    next();
  } catch (error) {
    console.log(error);
  
    res.render("adminfold/error", { user: true });
  }
}


const reviewStorage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./public/uploads/reviews')
  },
  filename:(req,file,cb)=>{
    const uniqueSuffix=Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,file.fieldname+'-' + uniqueSuffix)
  }
})



const uploadReview = multer({ storage: reviewStorage });

module.exports = {
  isUserinSession,
  authUser,
  signupSession,
  verifySession,
  cartCount,
  uploadReview
  
};
