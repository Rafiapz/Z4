const express = require("express");
const router = express.Router();
const usersCol = require("../model/usersModel");
const{applyFilter, searchProductUser, filterProducts, checkCartProductsStock,}=require('../controller/productController')
const {
  getSignup,
  postSignup,
  verifyOTP,
  detailedProduct,
  logout,
  getProductPage,
  getProfile,
  savedAddresses, 
  getCheckout,
  resendOTP,
  updateProfile,
  sendOTPforgotPassword,
  getForgotPassword,
  verifyForgotPasswordOTP,
  setNewPassword,
  getHome,  
} = require("../controller/userController");
const {
  isUserinSession,
  authUser,
  signupSession,
  verifySession,
  cartCount,
  uploadReview,
} = require("../middlewares/userMiddleware");
const {viewCart, addToCart, changeProductQuantity, removeItem,} = require("../controller/cartController");
const {addAddress,submitAdress, editaddress, addressEditSubmit, addressRemoval, addressRemovalProfile} = require("../controller/addressController");
const { placeOrder, userMyOrders, userDetailedOrder, userCancelOrder, makePayment, userReturnItems, generateInvoice, } = require("../controller/orderController");
const {getWishlist, addToWishlist, wishlistItemRemove}=require('../controller/wishlistController');
const { postReview, userAllReviews, getRating } = require("../controller/reviewController");
const { getUserWallet } = require("../controller/TransactionController");
const { verifyOnlinePayment } = require("../helpers/onlinePayment");
const { applyCoupon } = require("../controller/couponController");



router.use(cartCount)

router.get("/", getHome);

router.get("/signup", signupSession);

router.post("/signupSubmit", verifySession, postSignup);

router.get('/resendOTP',resendOTP)

router.get("/login", isUserinSession);

router.post("/loginsubmit", authUser);

router.post("/verifyOTP", verifyOTP);

router.get("/detailed", detailedProduct);

router.post('/applyfilter',applyFilter)

// router.get('/filter-product/:id',filterProducts)

router.get('/get-products-filtered',applyFilter)

router.get("/logout", logout);

router.get('/shop',getProductPage)

router.get('/view-wishlist',isUserinSession,getWishlist)

router.get('/add-to-wishlist/:id',isUserinSession,addToWishlist)

router.get('/remove-wishlist-item/:id',isUserinSession,wishlistItemRemove)

router.post('/serch-product',searchProductUser)

router.get('/addtocart/:productId',isUserinSession, addToCart)

router.post('/change-product-quantity',isUserinSession, changeProductQuantity)

router.get('/removecartitem/:productId',isUserinSession, removeItem)

router.get('/viewcart',isUserinSession,viewCart)

router.get(`/check-product-stock`,isUserinSession,checkCartProductsStock)

router.get('/checkout',isUserinSession, getCheckout)

router.post('/placetheorder',isUserinSession,placeOrder)

router.post('/makepayment',isUserinSession,makePayment)

router.post('/verify-online-payment',isUserinSession,verifyOnlinePayment)

router.get('/addaddress',isUserinSession,addAddress)

router.post('/submitaddress',isUserinSession, submitAdress)

router.get('/editaddress/:AddressId',isUserinSession,editaddress)

router.post('/addresseditsubmitt/:AddressId',isUserinSession,addressEditSubmit)

router.get('/removeaddress',isUserinSession,addressRemoval)

router.get('/removeaddress-profile',isUserinSession,addressRemovalProfile)

router.get('/userprofile',isUserinSession,getProfile)

router.post('/update-profile',isUserinSession,updateProfile)

router.get('/user-reviews',isUserinSession,userAllReviews)

router.get('/savedaddresses',isUserinSession,savedAddresses)

router.get('/myorders',isUserinSession,userMyOrders)

router.get('/detailedorderview',isUserinSession,userDetailedOrder)

router.get('/download-invoice/:id',isUserinSession,generateInvoice)

router.get('/usercancelorder',isUserinSession,userCancelOrder)

router.get('/user-return-items',isUserinSession,userReturnItems)

router.get('/wallet',isUserinSession,getUserWallet)

router.get('/forgot-password',getForgotPassword)

router.post('/sendOTP-forgot-password',sendOTPforgotPassword)

router.post('/verifyOTP-forgot-password',verifyForgotPasswordOTP)

router.post('/set-new-password-forgot',setNewPassword)

router.get('/sent-raging',isUserinSession,getRating)

router.post('/post-review/:id',isUserinSession,uploadReview.single('Image'),postReview)

router.get('/apply-coupon/:id',isUserinSession,applyCoupon)

router.get('/test',(req,res)=>{
  res.render('../test',{user:true})
  
})

module.exports = router;
