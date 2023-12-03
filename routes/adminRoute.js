const express = require("express");
const router = express.Router();
const {
  viewProducts,
  addProduct,
  getCustomers,
  logoutAdmin,
  searchCustomer,
  getCategoryandBrand,
  addCategory,
  addbrand,
  submitcategory,
  submitBrand,
  editCategory,
  submitProduct,
  softDelete,
  editProduct,
  editProductSubmit,
  blockUnblock,
  submitEditCategory,
  removeCategory,
  removeSingleImage,
  getDashboard,
  salesReport,
  getSalesReportpage,
  editBrand,
  brandEditSubmit,
  removeBrand,
 
} = require("../controller/adminController");
const {
  isAdmininSession,
  validateadmin,
  upload,
  uploadBanner,
} = require("../middlewares/adminMiddleware");
const multer = require("multer");
const { adminSearchProduct } = require("../controller/productController");
const { getallOrdersAdmin, orderStatusChange, cancelOrder, detailedOrderview } = require("../controller/orderController");
const { getTransactions, refund } = require("../controller/TransactionController");
const {getCoupon,addCoupon, editcouponSubmit, deleteCoupon, searchCoupon}=require('../controller/couponController');
const { getBanners, addBanner, editBanner, editSubmitBanner, deleteBanner } = require("../controller/bannerController");
const { getBrandOffers, addBrandOffer, changeOfferStatus, editSubmitBrandOffer, deleteBrandOffer } = require("../controller/brandOfferController");
const { download, dateWiseReports, brandWiseSalesSummary, } = require("../helpers/pdf");


router.get('/dashboard',isAdmininSession,getDashboard)

router.get("/customers", isAdmininSession, getCustomers);

router.get("/login", isAdmininSession, getDashboard);

router.post("/loginsubmit", validateadmin);

router.get("/logout", logoutAdmin);

router.post("/searchCustomer", isAdmininSession, searchCustomer);

router.get("/products", isAdmininSession, viewProducts);

router.get("/addproduct", isAdmininSession, addProduct);

router.get("/categoryandbrand", isAdmininSession, getCategoryandBrand);

router.get("/addcategory", isAdmininSession, addCategory);

router.get("/addbrand", isAdmininSession, addbrand);

router.get('/edit-brand/:name',isAdmininSession,editBrand)

router.post('/submitbrandEdit',isAdmininSession,brandEditSubmit)

router.get('/remove-brand/:name',isAdmininSession,removeBrand)

router.post("/submitcategory", isAdmininSession, submitcategory);

router.post("/submitbrand", isAdmininSession, submitBrand);

router.get("/editcategory", isAdmininSession, editCategory);

router.post("/submitcategoryEdit", isAdmininSession, submitEditCategory);

router.get("/removecategory", isAdmininSession, removeCategory);

router.post("/submitproduct", upload.array("Images", 6), submitProduct);

router.get("/softdelete", isAdmininSession, softDelete);

router.get("/block", isAdmininSession, blockUnblock);

router.get("/editproduct", isAdmininSession, editProduct);

router.get('/orders',isAdmininSession,getallOrdersAdmin)

router.get('/changeorderstatus/:Order_id',isAdmininSession,orderStatusChange)

router.get('/cancelorder/:Order_id',isAdmininSession,cancelOrder)

router.get('/detailedorderview',isAdmininSession, detailedOrderview)

router.get('/remove-single-image',isAdmininSession,removeSingleImage)

router.get('/salesReport/:period',isAdmininSession,salesReport)

router.get('/transactions',isAdmininSession,getTransactions)

router.get('/refund-update/:id',isAdmininSession,refund)

router.post(
  "/edisubmittproduct",
  isAdmininSession,
  upload.fields([{name:"Image1"},{name:'Image2'},{name:'Image3'}]),
  editProductSubmit
);

router.get("/", (req, res) => {
  res.redirect("/admin/dashboard");
});


router.get('/coupons',isAdmininSession,getCoupon)

router.post('/add-coupon',isAdmininSession,addCoupon)

router.get('/offers',isAdmininSession,getBrandOffers)

router.get('/banners',isAdmininSession,getBanners)

router.post('/add-banner',isAdmininSession,uploadBanner.single('Banner_Image'),addBanner)

router.get('/edit-banner/:id',isAdmininSession,editBanner)

router.post('/edit-submit-banner',isAdmininSession,uploadBanner.single('Banner_Image'),editSubmitBanner)

router.get('/delete-banner/:id',isAdmininSession,deleteBanner)

router.post('/addBrandOffer',isAdmininSession,addBrandOffer)

router.get('/offer-status-change/:id',isAdmininSession,changeOfferStatus)

router.post('/edit-submit-brandOffer/:id',isAdmininSession,editSubmitBrandOffer)

router.get('/delete-brandOffer/:id',isAdmininSession,deleteBrandOffer)

router.get('/brand-wise-sales-report/:id',isAdmininSession,brandWiseSalesSummary)

router.post('/date-filter-report',isAdmininSession,dateWiseReports)

router.get('/sales-report-page',isAdmininSession,getSalesReportpage)

router.get('/download',isAdmininSession,download)

router.post('/edit-submit-coupon/:id',isAdmininSession,editcouponSubmit)

router.get('/deleteCoupon/:id',isAdmininSession,deleteCoupon)

router.post('/search-coupon',isAdmininSession,searchCoupon)

router.post('/search-product',isAdmininSession,adminSearchProduct)




module.exports = router;
