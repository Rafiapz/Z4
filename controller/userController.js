require("dotenv").config();
const usersCol = require("../model/usersModel");
const express = require("express");
const bcrypt = require("bcrypt");
const { makeOTP } = require("../service/OTP");
const productCol = require("../model/productsModel");
const brandCol = require("../model/brandModel");
const categoryCol = require("../model/categoryModel");
const { getAdresses } = require("./addressController");
const cartCol = require("../model/cartModel");
const cartSummary = require("../helpers/cartSummary");
const addressCol = require("../model/addressModel");
const orderCol = require('../model/orderModel');
const { isUserBoughtProduct } = require("../helpers/reviewHelper");
const { allReviewofaProduct, averageRating } = require("./reviewController");
const { ObjectId } = require("mongoose").Types;
const walletCol = require('../model/walletModel')
const bannerCol = require('../model/bannerModel')
const { welcomeOffer } = require('../controller/couponController')
const couponCol=require('../model/couponModel')


async function getHome(req, res) {
  try {

    let pageNum = req.query.page || 1
    const perPage = 8;

    pageNum = parseInt(pageNum)

    let productsData = await productCol.find().lean();

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length = productsData.length

    productsData = productsData.slice(startIndex, endIndex);
    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }

    let guest = true;

    if (req.session.userId) {
      guest = false;
    }


    await productsData.forEach(async (ob) => {
      if (ob.Stock <= 0) {
        ob.Stock = false;
      }
      if (ob.Price == ob.DiscountPrice) {
        ob.Price = false
      }


    });

    const productslist = productsData

    const catData = await categoryCol.find();

    const category = catData.map((ob) => {
      return { Name: ob.Name, _id: ob._id };
    });

    const brandData = await brandCol.find();

    const brand = brandData.map((ob) => {
      return { Name: ob.Name, _id: ob._id };
    });

    req.session.couponDiscountPercentage = null
    req.session.couponDiscountAmount = null

    const Banners = await bannerCol.find({ IsActive: 'true' }).lean()

    res.render("usersfold/home", {
      user: true,
      userId: req.session.userId,
      productslist,
      category,
      brand,
      guest,
      Banners,
      pageNum, prev, next
    });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function getProductPage(req, res) {

  try {

    let pageNum = req.query.page || 1
    const perPage = 8;

    pageNum = parseInt(pageNum)

    req.session.couponDiscountPercentage = null
    req.session.couponDiscountAmount = null
    let productsData = await productCol.find().lean();

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length =productsData.length

    productsData = productsData.slice(startIndex, endIndex);
    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }

    let guest = true;

    if (req.session.userId) {
      guest = false;
    }

    productsData.forEach((ob) => {
      if (ob.Stock <= 0) {
        ob.Stock = false;
      }

    });
    const productslist = productsData

    const catData = await categoryCol.find();

    const category = catData.map((ob) => {
      return { Name: ob.Name, _id: ob._id };
    });

    const brandData = await brandCol.find();

    const brand = brandData.map((ob) => {
      return { Name: ob.Name, _id: ob._id };
    });



    res.render("usersfold/listproducts", {
      user: true,
      userId: req.session.userId,
      productslist,
      category,
      brand,
      guest,
      filter: true,
      pageNum, prev, next
    });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

function getSignup(req, res) {
  res.render("usersfold/signup", { user: true });
}


let data;

async function postSignup(req, res) {
  try {
    const hash = await bcrypt.hash(req.body.Password, 10);
    req.body.Password = hash;

    req.session.signUpData = req.body;

    data = req.body;

    const referral_Amount = 100
    if (data.Referral) {
      await walletCol.updateOne({ User_id: data.Referral }, {
        $inc: { Balance: referral_Amount },
        $push: { History: { Amount: referral_Amount, Date: Date.now(), Transaction: "Credited" } }
      }, { upsert: true })
    }

    let OTPDETAILS = await makeOTP(data.Email_Id);
    OTPDETAILS.Email_id = req.body.Email_Id;
    console.log(OTPDETAILS);

    req.session.OTPDETAILS = OTPDETAILS;

    req.session.Full_Name = req.body.Full_Name;
    res.render("usersfold/verify", { user: true });
  } catch (error) {
    console.log(error);
    res.render("usersfold/error", { user: true });
  }
}

async function resendOTP(req, res) {
  try {
    let OTPDETAILS = await makeOTP(req.session.signUpData.Email_Id);

    console.log(OTPDETAILS);

    req.session.OTPDETAILS = OTPDETAILS;

    res.json("OTP has been resent successfully!");
  } catch (error) {
    console.log(error);
    res.render("usersfold/error", { user: true });
  }
}

async function verifyOTP(req, res) {
  try {
    const ogOTP = req.session.OTPDETAILS;
    const ogDATA = req.session.signUpData;

    const timestamp = new Date(ogOTP.timestamp);
    const currentTime = Date.now();

    const timeDifference = currentTime - timestamp;

    if (timeDifference <= 1000 * 60 * 2) {
      console.log(ogOTP.OTP);
      console.log(req.body.OTP);
      if (ogOTP.OTP == req.body.OTP) {
        ogDATA.Created = new Date();
        ogDATA.isActive = true;

        ogDATA._id = null;

        let userProfile = {};

        userProfile.Full_Name = ogDATA.Full_Name;
        userProfile.Email_Id = ogDATA.Email_Id;
        userProfile.Password = ogDATA.Password;
        userProfile.Created = ogDATA.Created;
        userProfile.isActive = true;

        console.log(userProfile);

       const idDataOfUser= await usersCol.create(userProfile);
       const couponsData=await couponCol.find().lean()
       const couponArray = couponsData.map(coupon => ({
        Coupon_id: coupon._id,
        TimesUsed: 0
      }));
      
      await usersCol.updateOne(
        { _id: idDataOfUser._id },
        { $push: { Coupons: { $each: couponArray } } }
      );

        req.session.signUpData = null;

        let document = await usersCol.findOne(
          { Email_Id: ogDATA.Email_Id },
          { _id: 1 }
        );

        req.session.userId = document._id;

        res.redirect("/");
      } else {
        res.render("usersfold/verify", { user: true, expired: "Invalid OTP" });
      }
    } else {
      res.render("usersfold/verify", { user: true, expired: "Time expired" });
    }
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {

      req.flash("error", "This email already have an account");
      res.redirect('/signup')
    } else {
      res.render("adminfold/error", { user: true });
    }
  }
}

async function detailedProduct(req, res) {
  try {
    let query = req.query.product;
    const allDetails = await productCol.find({ _id: query }).lean();
    let guest = true;
    isUserBought = await isUserBoughtProduct(req, res, query)

    const allReviews = await allReviewofaProduct(req, res)

    const { rating, sum, count } = await averageRating(req, res, query)

    const relatedProducts = await productCol.find({ Brand: allDetails[0].Brand }).lean()

    if (req.session.userId) {
      guest = false;
    }

    if (allDetails[0].Price == allDetails[0].DiscountPrice) {
      allDetails[0].Price = false
    }
    res.render("usersfold/detailed", {
      user: true,
      userId: req.session.userId,
      allDetails,
      guest,
      isUserBought,
      allReviews,
      rating,
      sum,
      count,
      relatedProducts
    });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function getCheckout(req, res) {
  try {
    const userCart = await cartCol
      .findOne({ User_id: req.session.userId })
      .populate("Items.Product_id")
      .exec();


    const products = userCart.Items.map((ob) => {
      ob.TotalPrice = ob.Product_id.Price * ob.Quantity;
      ob.TotalDiscountPrice = ob.Product_id.DiscountPrice * ob.Quantity;

      return {
        _id: ob.Product_id._id,
        Name: ob.Product_id.Name,
        Description: ob.Product_id.Description,
        Price: ob.Product_id.Price,
        FinalPrice: ob.Product_id.DiscountPrice,
        Color: ob.Product_id.Color,
        RAM: ob.Product_id.RAM,
        InternalStorage: ob.Product_id.InternalStorage,
        Stock: ob.Product_id.Stock,
        Images: ob.Product_id.Images,
        Quantity: ob.Quantity,
        TotalPrice: ob.TotalPrice,
        TotalFinalPrice: ob.TotalDiscountPrice,
      };
    });

    const wallet = await walletCol.findOne({ User_id: req.session.userId })
    let walletBalance = false
    let Summary = await cartSummary(req, res);
    if (wallet && Summary <= wallet.Balance) {
      walletBalance = wallet.Balance
    }


    if (products.length > 0) {

      const addresses = await getAdresses(req, res);
      res.render("usersfold/checkout", {
        user: true,
        products,
        Summary,
        addresses,
        walletBalance
      });
    } else {
      res.redirect('/')
    }
  } catch (error) {
    console.log(error);

    res.redirect("/");
  }
}

function getLogin(req, res) {
  res.render("usersfold/login", { user: true });
}

async function getProfile(req, res) {
  try {
    const userProfile = await usersCol
      .findOne({ _id: req.session.userId })
      .lean();

    res.render("usersfold/profile/editprofile", {
      user: true,
      profile: true,
      userProfile,
      success: req.flash()
    });
  } catch (error) {
    console.log(error);
    res.render('usersfold/error', { user: true })
  }
}

async function updateProfile(req, res) {
  try {

    let data = {};

    if (req.body.Full_Name !== "") {
      data.Full_Name = req.body.Full_Name;
    }
    if (req.body.Mobile_Number !== "") {
      data.Mobile_Number = req.body.Mobile_Number;
    }
    if (req.body.oldPassword !== "") {

      const userData = await usersCol.findOne({ _id: req.session.userId });

      const validate = await bcrypt.compare(
        req.body.oldPassword,
        userData.Password
      );

      if (!validate) {
        console.log("not validate");
        res.render("usersfold/profile/editprofile", {
          user: true,
          wrongPassword: "Wrong Password",
        });
      } else {
        if (req.body.Password !== req.body.ConfirmPassword) {
          res.render("usersfold/profile/editprofile", {
            user: true,
            notMatching: "Passwords not Matching",
          });
        } else {
          const hash = await bcrypt.hash(req.body.Password, 10);

          data.Password = hash;
        }
      }
    }

    await usersCol.updateOne({ _id: req.session.userId }, { $set: data });

    req.flash("success", "Profile succesfully updated");

    res.redirect('/userprofile')
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

function getForgotPassword(req, res) {
  res.render("usersfold/forgot", { user: true });
}

async function sendOTPforgotPassword(req, res) {
  try {
    console.log(req.body);

    const isUser = await usersCol.findOne({ Email_Id: req.body.Email });

    if (isUser) {
      req.session.forgotEmail = req.body.Email;
      req.session.forgotOTP = await makeOTP(req.body.Email);

      console.log(req.session.forgotOTP);

      res.render("usersfold/forgotverify", { user: true });
    } else {
      res.render("usersfold/forgot", {
        user: true,
        notfound: "No Email Id found",
      });
    }
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function verifyForgotPasswordOTP(req, res) {
  try {
    console.log(req.body.OTP);

    if (req.body.OTP == req.session.forgotOTP.OTP) {
      console.log("OTP matched");

      res.render("usersfold/changepassword", { user: true });
    } else {
      res.render("usersfold/forgotverify", {
        user: true,
        invalid: "Invalid OTP",
      });
    }
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function setNewPassword(req, res) {
  try {
    console.log(req.body);

    const Email = req.session.forgotEmail;

    const password = await bcrypt.hash(req.body.Password, 10);

    await usersCol.updateOne(
      { Email_Id: Email },
      { $set: { Password: password } }
    );

    const data = await usersCol.findOne({ Email_Id: Email }, { _id: 1 });

    console.log(data);

    req.session.userId = data._id;

    req.session.forgotOTP = null;
    req.session.forgotEmail = null;
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}


async function savedAddresses(req, res) {

  try {
    let pageNum = req.query.page||1
    const perPage = 2;

    pageNum=parseInt(pageNum)
    
     let Address = await addressCol.find({ User_id: req.session.userId }).lean();

     const startIndex = (pageNum - 1) * perPage;
     const endIndex = pageNum * perPage;
     let length=Address.length
   
     Address = Address.slice(startIndex, endIndex);
     let prev=pageNum-1
     let next=pageNum+1
 
     if(prev<1){
       prev=false
     }
  
     if(next>Math.ceil(length/perPage)){
       next=false
     }


  res.render("usersfold/profile/savedaddresses", {
    user: true,
    profile: true,
    Address,
    pageNum,prev,next 
  });
  } catch (error) {
    console.log(error);
    res.render('usersfold/error',{user:true})
  }
 
}




function logout(req, res) {
  res.locals = null;
  res.redirect('/')
  req.session.userId = null;
  req.session.destroy()
}

module.exports = {
  getSignup,
  postSignup,
  verifyOTP,
  detailedProduct,
  getLogin,
  getProductPage,
  getProfile,
  savedAddresses,
  logout,
  getCheckout,
  resendOTP,
  updateProfile,
  getForgotPassword,
  sendOTPforgotPassword,
  verifyForgotPasswordOTP,
  setNewPassword,
  getHome,
};
