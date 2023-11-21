const cartSummary = require("../helpers/cartSummary");
const couponCol = require("../model/couponModel");
const orderCol = require("../model/orderModel");
const { ObjectId } = require("mongoose").Types;
const usersCol = require("../model/usersModel");


async function getUserCoupons(req, res) {

  try {

    const id = new ObjectId(req.session.userId)

    const couponsData = await usersCol.findOne({ _id: id }).populate('Coupons.Coupon_id').lean()

    let couponsUsable = couponsData.Coupons

    couponsUsable.forEach((ob) => {

      const mongoDBDate = ob.Coupon_id.ExpiryDate;

      const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      ob.ExpiryDate = formattedDate
    })

    couponsUsable=couponsUsable.filter((ob)=>{
      return ob.Coupon_id.IsActive
    })


    return couponsUsable

  } catch (error) {
    console.log(error);
    res.render('usersfold/error', { user: true })
  }
}

async function getCoupon(req, res) {
  try {

    let pageNum = req.query.page||1
    const perPage = 10;

    pageNum=parseInt(pageNum)

    let coupons = await couponCol.find().lean();

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length=coupons.length
  
    coupons = coupons.slice(startIndex, endIndex);
    let prev=pageNum-1
    let next=pageNum+1

    if(prev<1){
      prev=false
    }
 
    if(next>Math.ceil(length/perPage)){
      next=false
    }

    if (coupons) {
      coupons.forEach((ob) => {
        const created = ob.CreatedAt;
        const expiry = ob.ExpiryDate;

        const formattedCreatedDate = created.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        ob.CreatedAt = formattedCreatedDate;
        const formattedExpirydDate = expiry.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        ob.ExpiryDate = formattedExpirydDate;
      });
    }
    res.render("adminfold/coupon", { admin: true, coupons, error: req.flash(),pageNum,prev,next  });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function addCoupon(req, res) {
  try {
    const data = req.body;

    data.CreatedAt = Date.now();

    const couponData = await couponCol.create(data)

    await usersCol.updateMany({}, { $push: { Coupons: { Coupon_id: couponData._id, TimesUsed: 0 } } })


    res.redirect("/admin/coupons");
  } catch (error) {

    console.log(error);
    if (error.code == 11000) {
      req.flash("error", "Coupon code already exists");
      res.redirect('/admin/coupons')
    } else {
      res.render("adminfold/error", { admin: true });
    }

  }
}

async function welcomeOffer(req, res) {

}

async function applyCoupon(req, res) {
  try {
    req.session.couponDiscountPercentage = null
    req.session.couponDiscountAmount = null
    welcomeOfferApply(req, res);
  } catch (error) {
    console.log(error);
  }
}

async function welcomeOfferApply(req, res) {
  try {
    const id = new ObjectId(req.session.userId);
    const currentTime = Date.now()
    let couponId = req.params.id;
    const details = await couponCol.findOne({ Code: couponId })
    couponId = details._id
    console.log(couponId);

    let Userdata = await usersCol.findOne({ _id: id }).populate('Coupons.Coupon_id').lean()

    Userdata = Userdata.Coupons
    if (Userdata) {
      
      let data

      Userdata.forEach((ob) => {

        if (ob.Coupon_id._id.toString() == couponId.toString()) {
          data = ob
        }
      })

      if(!data.Coupon_id.IsActive){
        res.json({
          status: false,
          message: `Coupon is not active`,
        });

        return
      }

      const discountPercentage = data.Coupon_id.Discount;

      const subtotal = await cartSummary(req, res);
      if (data.Coupon_id.ExpiryDate <= currentTime) {

        res.json({
          status: false,
          message: `Coupon is expired`,
        });

      } else {

        if (subtotal < data.Coupon_id.MinimumOrderAmount) {
          res.json({
            status: false,
            message: `Minimum order amount for this coupon is${data.Coupon_id.MinimumOrderAmount}`,
          });
        } else {
          console.log(data.TimesUsed, 'asdf', data.Coupon_id.UsageLimit);
          if (data.TimesUsed < data.Coupon_id.UsageLimit) {

            req.session.MinimumOrderAmount = data.Coupon_id.MinimumOrderAmount;

            const total = await cartSummary(req, res, discountPercentage);

            const couponDiscountAmount = req.session.couponDiscountAmount;

            req.session.couponid = couponId;
            req.session.MinimumOrderAmount = data.Coupon_id.MinimumOrderAmount;
            res.json({
              status: true,
              message: "Coupon applied succesfully",
              total,
              couponDiscountAmount,
            });
          } else {
            res.json({
              status: false,
              message: "You have already used this coupon",
            });
          }
        }
      }
    } else {
      res.json({ status: false, message: "Enter a valid coupon" });
    }
  } catch (error) {
    console.log(error);
    res.render("usersfold/error", { user: true });
  }
}

async function editcouponSubmit(req, res) {
  try {
    console.log(req.params.id);

    const id = req.params.id;

    await couponCol.updateOne({ _id: id }, { $set: req.body });

    res.redirect("/admin/coupons");
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      req.flash("error", "Coupon code already exists");
      res.redirect('/admin/coupons')
    } else {
      res.render("adminfold/error", { admin: true });
    }
  }
}

async function deleteCoupon(req, res) {
  try {
    const id = req.params.id;

    await couponCol.deleteOne({ _id: id });

    await usersCol.updateMany({}, { $pull: { Coupons: { Coupon_id: id } } })

    res.redirect("/admin/coupons");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}


async function searchCoupon(req, res) {

  try {

    const query = req.body.query;

    const reg = new RegExp(`^${query}`, "i");

    const coupons = await couponCol.find({ Code: reg }).lean()

    if (coupons) {
      coupons.forEach((ob) => {
        const created = ob.CreatedAt;
        const expiry = ob.ExpiryDate;

        const formattedCreatedDate = created.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        ob.CreatedAt = formattedCreatedDate;
        const formattedExpirydDate = expiry.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        ob.ExpiryDate = formattedExpirydDate;
      });
    }


    res.render('adminfold/coupon', { admin: true, coupons })


  } catch (error) {
    console.log(error);
    res.render('adminfold/error')
  }
}

module.exports = {
  getCoupon,
  addCoupon,
  welcomeOffer,
  applyCoupon,
  editcouponSubmit,
  deleteCoupon,
  searchCoupon,
  getUserCoupons
};
