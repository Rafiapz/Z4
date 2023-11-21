const ordersCol = require("../model/orderModel");
const transnCol = require("../model/transactionsModel");
const walletCol = require('../model/walletModel')
const { ObjectId } = require("mongoose").Types;

async function createTransaction(req, res, document) {
  try {
    let transactionData = {};

    transactionData.User_id = document.User_id;
    transactionData.Order_id = document._id;
    transactionData.Amount = document.Total_Amount;
    transactionData.Method = document.Payment_Method;
    transactionData.Date = document.Order_Date;
    transactionData.Status = "Succeed";

    await transnCol.create(transactionData);
  } catch (error) {
    console.log(error);
    res.render("usersfold/error", { user: true });
  }
}

async function getTransactions(req, res) {

  try {

    let pageNum = req.query.page || 1
    const perPage = 10;

    pageNum = parseInt(pageNum)

    let transactions = await transnCol.find({}).sort({ Date: -1 }).populate("User_id").lean();

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length = transactions.length

    transactions = transactions.slice(startIndex, endIndex);
    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }

    transactions.forEach((ob) => {
      const mongoDBDate = ob.Date;

      if (ob.Status != 'Succeed') {
        ob.Color = 'danger'
      } else {
        ob.Color = 'success'
      }

      const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      ob.Date = formattedDate
    });

    res.render("adminfold/transactions", { admin: true, transactions,pageNum, prev, next });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function refund(req, res) {

  try {

    let transactionid = req.params.id;

    transactionid = new ObjectId(transactionid)

    const Data = await transnCol.findOne({ _id: transactionid })
    const user = Data.User_id
    const amount = Data.Amount

    if (req.query.status == 'approve' && Data.Status == 'Refund Requested') {

      await walletCol.updateOne({ User_id: user }, {
        $inc: { Balance: amount },
        $push: { History: { Amount: amount, Date: Date.now(), Transaction: "Credited" } }
      }, { upsert: true })

      await transnCol.updateOne({ _id: req.params.id }, { $set: { Status: 'Refunded' } })
    }
    res.redirect('/admin/transactions')


  } catch (error) {
    console.log(error);
    res.render('adminfold/error', { admin: true })
  }

}

async function getUserWallet(req, res) {

  try {

    let pageNum = req.query.page || 1
    const perPage = 2;

    pageNum = parseInt(pageNum)

    let wallet = await walletCol.findOne({ User_id: req.session.userId }).lean()
    let History
    if (wallet) {
      History = wallet.History

      History.forEach((ob) => {

        const mongoDBDate = ob.Date;

        const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        ob.Date = formattedDate

      })
    }
    let prev
    let next
    if(History){
          const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length =History.length

    History=History.reverse()
    History = History.slice(startIndex, endIndex);
    prev = pageNum - 1
    next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }
    }


    const userobjid = req.session.userId

    res.render('usersfold/profile/wallet', { user: true, wallet, profile: true, History, userobjid ,pageNum, prev, next })

  } catch (error) {
    console.log(error);
    res.render('usersfold/error', { user: true })
  }
}



module.exports = { createTransaction, getTransactions, refund, getUserWallet };
