const ordersCol = require("../model/orderModel");
const cartCol = require("../model/cartModel");
const subtotal = require("../helpers/cartSummary");
const moment = require("moment");
const productCol = require("../model/productsModel");
const { ObjectId } = require("mongoose").Types;
const cartSummary = require("../helpers/cartSummary");
const { generateRazorPay } = require("../helpers/onlinePayment");
const { createTransaction } = require("./TransactionController");
const transnCol = require("../model/transactionsModel");
const walletCol = require("../model/walletModel");
const { welcomeOffer } = require("./couponController");
const couponCol = require("../model/couponModel");
const easyinvoice = require("easyinvoice");
const fs = require("fs");
const usersCol = require('../model/usersModel')

async function makePayment(req, res) {
  try {
    const amount = await cartSummary(req, res);

    const data = await cartCol.findOne({ User_id: req.session.userId });

    id = data.id + "";

    const razorpay = await generateRazorPay(id, amount);

    res.json({ razorpay, amount });
  } catch (error) {
    console.log(error);
    res.render("usersfold/error", { user: true });
  }
}

async function placeOrder(req, res) {
  try {
  

    let orderData = {};
    orderData.User_id = req.session.userId;
    orderData.Payment_Method = req.body.method;
    if (req.body.method == 'COD') {
      orderData.Payment_Status = 'Pending'
    } else {
      orderData.Payment_Status = "PAID";
    }
    const currtentDate = new Date();
    orderData.Order_Date = moment(currtentDate).format("MMMM D, YYYY");
    orderData.Status = "Placed";
    orderData.Shipping_Address = req.body.Address;
    orderData.Total_Amount = await subtotal(req, res,null,'checkout');
    const Expected_Delivery_Date = new Date(
      new Date().getTime() + 5 * 24 * 60 * 60 * 1000
    );
    orderData.Expected_Delivery_Date = moment(Expected_Delivery_Date).format(
      "MMMM D, YYYY"
    );
    orderData.Items = [];

    const orderProducts = req.session.order.Items.map((ob) => {
      return {
        Product_id: ob.Product_id._id,
        Order_Price: ob.Product_id.DiscountPrice,
        Quantity: ob.Quantity,
        Image: ob.Product_id.Images[0],
        Name: ob.Product_id.Name,
      };
    });

    orderProducts.forEach((ob) => {
      orderData.Items.push(ob);
    });

    const documentData = await ordersCol.create(orderData);


    req.session.order=null

    if (documentData && req.session.couponDiscountPercentage) {

      await usersCol.updateOne({ _id: req.session.userId, 'Coupons.Coupon_id': req.session.couponid }, {
        $inc: {
          'Coupons.$.TimesUsed': 1
        }
      })
    }

    if (req.body.method == "Wallet") {
      await walletCol.updateOne(
        { User_id: req.session.userId },
        {
          $inc: { Balance: -orderData.Total_Amount },
          $push: {
            History: {
              Amount: orderData.Total_Amount,
              Date: Date.now(),
              Transaction: "Debited",
            },
          },
        }
      );
    }

    await Promise.all(
      orderProducts.map(async (ob) => {
        await productCol.updateOne(
          { _id: ob.Product_id },
          { $inc: { Stock: -ob.Quantity } }
        );
      })
    );

    await cartCol.deleteOne({ User_id: req.session.userId });

    await createTransaction(req, res, documentData);

    return documentData;
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function getallOrdersAdmin(req, res) {
  try {
    let pageNum = req.query.page || 1
    const perPage = 10;

    pageNum = parseInt(pageNum)

    let allOrders = await ordersCol
      .find({})
      .sort({ Order_Date: -1 })
      .lean();

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length = allOrders.length

    allOrders = allOrders.slice(startIndex, endIndex);


    allOrders.map((ob) => {
      let product = [];

      for (let i = 0; i < ob.Items.length; i++) {
        product[i] = ob.Items[i].Product_id;
      }
      ob.Product_Ids = product;

      const mongoDBDate = ob.Order_Date;

      const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      ob.color = "green";
      ob.Cancelled = false;
      if (ob.Status == "Placed") {
        ob.color = "#0000FF";
      } else if (ob.Status == "Delivered") {
        ob.color = "#00CC00";
      } else if (ob.Status == "Cancelled") {
        ob.color = "#FF0000";
        ob.Cancelled = true;
      } else if (ob.Status == "Shipped") {
        ob.color = "#FFA500";
      } else if (ob.Status == "Refunded") {
        ob.color = "#FF0000";
      }

      ob.Order_Date = formattedDate;
    });

    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }

    res.render("adminfold/orders", { admin: true, allOrders, pageNum, prev, next });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function orderStatusChange(req, res) {
  try {
    let query = req.query.status;

    query = String(query);

    const Order_id = req.params.Order_id;

    if (query == "Placed") {
      await ordersCol.updateOne({ _id: Order_id }, { $set: { Status: query } });
    } else if (query == "Shipped") {
      await ordersCol.updateOne({ _id: Order_id }, { $set: { Status: query } });
    } else if (query === "Delivered") {
      await ordersCol.updateOne(
        { _id: Order_id },
        { $set: { Status: "Delivered", Payment_Status: 'PAID' } }
      );
    } else if (query == "Refunded") {
      await ordersCol.updateOne({ _id: Order_id }, { $set: { Status: query } });
    }

    res.json({ Status: query });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function cancelOrder(req, res) {
  try {
    const Order_id = req.params.Order_id;

    await ordersCol.updateOne(
      { _id: Order_id },
      { $set: { Status: "Cancelled" } }
    );

    res.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function detailedOrderview(req, res) {
  try {
    let Order_id = req.query.Order;

    Order_id = new ObjectId(Order_id);

    let details = await ordersCol
      .find({ _id: Order_id })
      .populate("Shipping_Address")
      .lean();

    details.forEach((ob) => {
      const mongoDBDate = ob.Order_Date;

      const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      ob.Order_Date = formattedDate;
    });

    const Shipping_Address = details[0].Shipping_Address;
    const product = details[0].Items;

    res.render("adminfold/detailedOrder", {
      admin: true,
      details,
      product,
      Shipping_Address,
    });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function userMyOrders(req, res) {
  try {


    let pageNum = req.query.page || 1
    const perPage = 7;

    pageNum = parseInt(pageNum)

    let myOrders = await ordersCol
      .find({ User_id: req.session.userId })
      .sort({ Order_Date: -1 })
      .lean();

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length = myOrders.length

    myOrders = myOrders.slice(startIndex, endIndex);
    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }

    myOrders.forEach((ob) => {
      const mongoDBDate = ob.Order_Date;

      const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      ob.Order_Date = formattedDate;
    });

    res.render("usersfold/profile/myorders", {
      user: true,
      myOrders,
      profile: true,
      pageNum, prev, next
    });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function userDetailedOrder(req, res) {
  try {
    let Order_id = req.query.Order;

    Order_id = new ObjectId(Order_id);

    let details = await ordersCol
      .findOne({ _id: Order_id })
      .populate("Shipping_Address")
      .lean();

    const mongoDBDate = details.Order_Date;

    const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    details.Order_Date = formattedDate;

    const Shipping_Address = details.Shipping_Address;
    const product = details.Items;

    let return_available = false;
    let returned = false;
    if (details.Status == "Delivered") {
      return_available = true;
    }
    if (
      details.Status == "Returned" ||
      details.Status == "Cancelled" ||
      details.Status == "Rejected"
    ) {
      returned = true;
    }

    res.render("usersfold/profile/myordersdetailed", {
      user: true,
      Shipping_Address,
      product,
      details,
      profile: true,
      return_available,
      returned,
    });
  } catch (error) {
    console.log(error);
    res.rende("adminfold/error", { user: true });
  }
}

async function userCancelOrder(req, res) {
  try {
    const query = req.query.OrderId;

    await ordersCol.updateOne(
      { _id: query },
      { $set: { Status: "Cancelled" } }
    );

    const user = req.session.userId

    const orderDetails = await ordersCol.findOne({ _id: query })

    const amount = orderDetails.Total_Amount

    if (orderDetails.Payment_Method == 'Online payment' || orderDetails.Payment_Method == 'wallet') {

      await walletCol.updateOne({ User_id: user }, {
        $inc: { Balance: amount },
        $push: { History: { Amount: amount, Date: Date.now(), Transaction: "Credited" } }
      }, { upsert: true })

      await transnCol.updateOne({ _id: req.params.id }, { $set: { Status: 'Refunded' } })

      res.json({ Status: "Cancelled", refund: true });
    } else {

      res.json({ Status: 'Cancelled' })

    }
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function userReturnItems(req, res) {
  try {
    const query = req.query.OrderId;

    await ordersCol.updateOne({ _id: query }, { $set: { Status: "Returned" } });

    await transnCol.updateOne(
      { Order_id: query },
      { $set: { Status: "Refund Requested" } }
    );

    res.json({ Status: "Refund Requested" });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function generateInvoice(req, res) {
  try {
    const orderDetails = await ordersCol
      .findOne({ _id: req.params.id })
      .populate("Shipping_Address")
      .lean();

    let totalprodPrice = 0

    orderDetails.Items.forEach((ob) => {
      totalprodPrice += ob.Order_Price
    })

    let coupon=0

    coupon = Math.ceil((totalprodPrice - orderDetails.Total_Amount) / totalprodPrice * 100)


    let products = orderDetails.Items.map((ob) => {
      ob.Order_Price = ob.Order_Price / 1.18;

      if(coupon>1){
        ob.Order_Price =Math.ceil( ob.Order_Price * (1 - coupon / 100))
      }

      return {
        description: ob.Name,
        quantity: ob.Quantity,
        price: ob.Order_Price,
        "tax-rate": 18,
      };
    });


    const mongoDBDate = orderDetails.Order_Date;

    const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    orderDetails.Order_Date = formattedDate;

    let data = {
      customize: {},
      images: {
        logo: fs.readFileSync("./public/user/photos/LOGO.png", "base64"),
      },

      sender: {
        company: "Z4 Mobiles",
        address: "ak Street 3",
        zip: "671 255",
        city: "Bangalore",
        country: "India",
      },
      // Your recipient
      client: {
        company: orderDetails.Shipping_Address.FullName,
        address: orderDetails.Shipping_Address.Locality,
        zip: orderDetails.Shipping_Address.PinCode,
        city: orderDetails.Shipping_Address.City,
        country: "India",
      },
      information: {
        // Invoice number
        number: "Z4_1537/2023/24",
        // Invoice data
        date: orderDetails.Order_Date,
        // Invoice due date
        "due-date": orderDetails.Order_Date,
      },

      products: products,

      settings: {
        currency: "INR",
      },

      translate: {},
    };

    //Create your invoice! Easy!
    easyinvoice.createInvoice(data, (result) => {
      const filename = `./public/user/invoice/invoice_${new Date().getTime()}.pdf`;
      fs.writeFileSync(filename, result.pdf, "base64");

      res.download(filename);
    });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error");
  }
}

module.exports = {
  placeOrder,
  getallOrdersAdmin,
  orderStatusChange,
  cancelOrder,
  detailedOrderview,
  userMyOrders,
  userDetailedOrder,
  userCancelOrder,
  makePayment,
  userReturnItems,
  generateInvoice,
};

// await Promise.all(products.Items.map(async (ob) => {
//   const stockCount = await productCol.findOne({ _id: ob.Product_id });

//   if (stockCount.Stock <= 0) {

//     products.Items = products.Items.filter(item => item.Product_id !== ob.Product_id);
//   }
// }));
