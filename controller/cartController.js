const cartCol = require("../model/cartModel");
const usersCol = require("../model/usersModel");
const productsCol = require("../model/productsModel");
const { ObjectId } = require("mongoose").Types;
const cartSummary = require("../helpers/cartSummary");
const couponCol = require('../model/couponModel');
const { getUserCoupons } = require("./couponController");

async function viewCart(req, res) {
  try {

    if (!req.session.userId) {
      res.render("usersfold/cart", {
        user: true,
        message: "Login to see the items you added previously",
      });
    }

    const userCart = await cartCol
      .findOne({ User_id: req.session.userId })
      .populate("Items.Product_id")
      .exec();

    if (userCart) {
      const cartproducts = userCart.Items.map((ob) => {
        ob.TotalPrice = ob.Product_id.Price * ob.Quantity;
        ob.TotalDiscountPrice = ob.Product_id.DiscountPrice * ob.Quantity;

        if (ob.TotalPrice === ob.TotalDiscountPrice) {
          ob.TotalPrice = false
        }

        return {
          _id: ob.Product_id._id,
          Name: ob.Product_id.Name,
          Description: ob.Product_id.Description,
          Price: ob.Product_id.Price,
          DiscountPrice: ob.Product_id.DiscountPrice,
          Color: ob.Product_id.Color,
          RAM: ob.Product_id.RAM,
          InternalStorage: ob.Product_id.InternalStorage,
          Stock: ob.Product_id.Stock,
          Images: ob.Product_id.Images,
          Quantity: ob.Quantity,
          TotalPrice: ob.TotalPrice,
          TotalDiscountPrice: ob.TotalDiscountPrice,
        };
      });

      let Subtotal = 0;
      if (userCart) {
        const cartproducts = userCart.Items.map((ob) => {
          ob.TotalDiscountPrice = ob.Product_id.DiscountPrice * ob.Quantity;
          return {
            data: ob.TotalDiscountPrice,
          };
        });

        cartproducts.forEach((ob) => {

          Subtotal = Subtotal + ob.data;
        });
      }
      const couponDiscountAmount = req.session.couponDiscountAmount;
      const finalAmount = await cartSummary(req, res);

      const couponsUsable = await getUserCoupons(req, res)


      res.render("usersfold/cart", {
        user: true,
        cartproducts,
        Subtotal,
        profile: true,
        couponDiscountAmount,
        finalAmount,
        couponsUsable
      });
    } else {
      res.render("usersfold/cart", { user: true });
    }
  } catch (error) {
    console.log(error);
    console.log("here is the problem");
    res.render("adminfold/error", { user: true });
  }
}

async function addToCart(req, res) {
  try {
    const productId = req.params.productId;
    const userid = req.session.userId;
    const findCart = await cartCol.findOne({ User_id: userid });
    let usercart;

    if (findCart) {
      usercart = await cartCol
        .findOne({ User_id: req.session.userId })
        .populate("Items.Product_id")
        .exec();
    }

    if (!usercart) {
      await cartCol.create({
        User_id: userid,
        Items: [{ Product_id: productId, Quantity: 1 }],
      });
    } else {
      data = usercart.Items.map((ob) => {
        return {
          _id: ob.Product_id._id,
        };
      });
      const foundItem = data.find(
        (item) => item._id.toString() === productId.toString()
      );
      if (foundItem) {
        await cartCol.updateOne(
          { User_id: userid, "Items.Product_id": productId },
          { $inc: { "Items.$.Quantity": 1 } }
        );
      } else {
        await cartCol.updateOne(
          { User_id: userid },
          { $push: { Items: { Product_id: productId, Quantity: 1 } } },
          { upsert: false }
        );
      }
    }
    const countData = await cartCol.findOne({ User_id: req.session.userId });
    if (countData) {
      const cartcount = countData.Items.length;
      res.json({ status: true, cartcount });
    } else {
      res.json();
    }
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function changeProductQuantity(req, res) {
  try {
    let productId = req.body.productId;
    const count = req.body.count;
    let userid = req.session.userId;

    await cartCol.updateOne(
      { User_id: userid, "Items.Product_id": productId },
      { $inc: { "Items.$.Quantity": count } }
    );

    const usercart = await cartCol.findOne({ User_id: userid });

    productId = new ObjectId(productId);

    const quantityData = usercart.Items.find(
      (ob) => ob.Product_id.toString() === productId.toString()
    );

    let Subtotal = await cartSummary(req, res);

    let couponDiscountAmount = req.session.couponDiscountAmount;
    let couponNotApplicable = false
    if (Subtotal < req.session.MinimumOrderAmount) {
      couponDiscountAmount = null
      req.session.couponDiscountPercentage = null
      req.session.couponDiscountAmount = null
      couponNotApplicable = true
      Subtotal = await cartSummary(req, res)

    }

    res.json({
      status: true,
      message: "Quantity updated",
      Quantity: quantityData.Quantity,
      Subtotal: Subtotal,
      couponDiscountAmount,
      couponNotApplicable
    });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function removeItem(req, res) {
  try {
    const productId = req.params.productId;
    const userid = req.session.userId;

    await cartCol.updateOne(
      { User_id: userid },
      { $pull: { Items: { Product_id: productId } } }
    );

    const countData = await cartCol.findOne({ User_id: req.session.userId });

    const cartCount = countData.Items.length;
    let Subtotal = await cartSummary(req, res);

    let couponDiscountAmount = req.session.couponDiscountAmount;
    let couponNotApplicable = false

    if (Subtotal < req.session.MinimumOrderAmount) {
      couponDiscountAmount = null
      req.session.couponDiscountPercentage = null
      req.session.couponDiscountAmount = null
      couponNotApplicable = true
      Subtotal = await cartSummary(req, res)

    }


    res.send({ cartCount, Subtotal, couponDiscountAmount, couponNotApplicable });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}



async function hhh(req, res) {
  console.log('called hhh');
  await cartSummary(req, res, 30, 40)
}

module.exports = {
  viewCart,
  addToCart,
  changeProductQuantity,
  removeItem,
  hhh
};

// const userCart = await cartCol.findOne({ User_id: userid });

// if (userCart) {
//   const existingCart = await userCart.Items.find((items) => {
//     items.Product_id.equals(productId);
//   });
//   if (existingCart) {
//     existingCart.Quantity += 1;
//   } else {
//     userCart.Items.push({ Product_id: productId, Quantity: 1 });
//   }
//   await userCart.save();
// } else {
//   const newCart = new cartCol({
//     User_id: userid,
//     Items: [{ Product_id: productId, Quantity: 1 }],
//   });

//   await newCart.save();
// }
