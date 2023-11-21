const cartCol = require("../model/cartModel");
const cartSummary = require("../helpers/cartSummary");
const productCol = require('../model/productsModel')
const categoryCol = require('../model/categoryModel')
const brandCol = require('../model/brandModel');
const { json } = require("express");


async function adminSearchProduct(req,res){

  try {

    let pageNum = req.query.page || 1
    const perPage = 5;

    pageNum = parseInt(pageNum)

    const query = req.body.query
    const reg = new RegExp(`^${query}`, "i");

    const productsdata = await productCol.find({ Name: { $regex: reg } }).lean()

    let products = productsdata.map((ob) => {
      return {
        Name: ob.Name,
        Stock: ob.Stock,
        Price: ob.Price,
        isActive: ob.IsActive,
        _id: ob._id,
        Images: ob.Images,
      };
    });

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length = products.length

    products = products.slice(startIndex, endIndex);
    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }

    res.render('adminfold/products',{admin:true,products, pageNum, prev, next})

    
  } catch (error) {
    console.log(error);
    res.render('adminfold/error')
  }
}


async function checkCartProductsStock(req, res) {

  try {

    const cart = await cartCol.findOne({ User_id: req.session.userId }, { Items: 1, _id: 0 })

    if(cart){
    const Items = cart.Items

    const id = Items.map((ob) => {
      return ob.Product_id
    })

    const products = await productCol.find({ _id: { $in: id } })

    let arr = []

    for (let i = 0; i < Items.length; i++) {

      for (let j = 0; j < products.length; j++) {

        if (Items[i].Product_id.toString() == products[j]._id.toString() && Items[i].Quantity > products[j].Stock || Items[i].Product_id.toString() == products[j]._id.toString() && products[j].IsActive==false) {

          let ob = {}
          ob.id = Items[i].Product_id
          ob.Status = 'Out of Stock'
          arr.push(ob)
        }
      }
    }

    if (arr.length > 0) {

      res.json({ Items: arr, Status: false })
    } else {

      res.json({ Status: true })
    }
  }else{
    res.json()
  }
  } catch (error) {
    console.log(error);
    res.render('usersfold/error')
  }
}


async function applyFilter(req, res) {

  try {


    let brand = req.query.brand

    console.log(req.body);

    let data

    if (brand != null) {

      data = await productCol.find({ Brand: { $in: brand } }).lean()
    } else {

      data = await productCol.find().lean()
    }

   

    let isGuest = true

    if (req.session.userId) {
      isGuest = false
    }

    res.send({ data, isGuest })

    // res.render("usersfold/listproducts", { user: true,productslist,category,brand,guest,filter:true});
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}


async function filterProducts(req, res) {

  try {

    let filter = []

    let type = req.params.id;

    let query = req.query.query

    const productslist = await productCol.find({ [type]: query }).lean()

    console.log(productslist);

    const category = await categoryCol.find().lean()


    const brand = await brandCol.find().lean()


    let guest = true

    if (req.session.userId) {
      guest = false
    }




    res.render('usersfold/home', { user: true, productslist, brand, category, filter: true })

  } catch (error) {
    console.log(error);
    res.render('usersfold/error', { user: true })
  }
}


async function searchProductUser(req, res) {

  try {

    const query = req.body.query
    const reg = new RegExp(`^${query}`, "i");

    const productslist = await productCol.find({ Name: { $regex: reg } }).lean()

    const category = await categoryCol.find().lean()


    const brand = await brandCol.find().lean()

    let guest = true

    if (req.session.userId) {
      guest = false
    }

    res.render('usersfold/listproducts', { productslist, brand, category, guest, user: true })

  } catch (error) {
    console.log(error);
    res.render('adminfold/error', { user: true })
  }

}


module.exports = { applyFilter, searchProductUser, filterProducts, checkCartProductsStock, adminSearchProduct };
