const express = require("express");
const adminCol = require("../model/adminModel");
const userCol = require("../model/usersModel");
const categoryCol = require("../model/categoryModel");
const brandCol = require("../model/brandModel");
const productCol = require("../model/productsModel");
const ImageCrop = require("../helpers/cropImage");
const transnCol = require("../model/transactionsModel");
const ordersCol = require('../model/orderModel');
const { checkBrandOffer } = require("./brandOfferController");

async function getCustomers(req, res) {
  try {

    let pageNum = req.query.page || 1
    const perPage = 10;

    pageNum = parseInt(pageNum)
    let data = await userCol.find();

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length = data.length

    data = data.slice(startIndex, endIndex);
    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }

    const userDetails = data.map((ob) => {
      return {
        Full_Name: ob.Full_Name,
        Email_Id: ob.Email_Id,
        Password: ob.Password,
        Created: ob.Created,
        isActive: ob.isActive,
        _id: ob._id,
      };
    });

    res.render("adminfold/customers", { admin: true, userDetails, pageNum, prev, next });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

function logoutAdmin(req, res) {
  req.session.adminId = null;
  res.redirect("/admin/customers");
}

async function searchCustomer(req, res) {
  try {
    const query = req.body.query;
    const reg = new RegExp(`^${query}`, "i");
    const customer = await userCol.find({ Full_Name: { $regex: reg } });
    const userDetails = customer.map((ob) => {
      return {
        Full_Name: ob.Full_Name,
        Email_Id: ob.Email_Id,
        Password: ob.Password,
        Created: ob.Created,
        isActive: ob.isActive,
        _id: ob._id,
      };
    });

    res.render("adminfold/customers", { admin: true, userDetails });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error");
  }
}

async function viewProducts(req, res) {

  try {
    let pageNum = req.query.page || 1
    const perPage = 5;

    pageNum = parseInt(pageNum)

    let productsdata = await productCol.find();
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

    res.render("adminfold/products", { admin: true, products, pageNum, prev, next });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function addProduct(req, res) {
  try {
    const brandsdata = await brandCol.find();
    const categoriesdata = await categoryCol.find();
    const brands = brandsdata.map((ob) => {
      return {
        _id: ob._id,
        Name: ob.Name,
      };
    });

    const categories = categoriesdata.map((ob) => {
      return {
        _id: ob._id,
        Name: ob.Name,
      };
    });

    res.render("adminfold/addProducts", { admin: true, brands, categories });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function getCategoryandBrand(req, res) {
  try {
    const catData = await categoryCol.find();

    const categories = catData.map((ob) => {
      return {
        Name: ob.Name,
      };
    });
    const Data = await brandCol.find();
    const brands = Data.map((ob) => {
      return {
        Name: ob.Name,
      };
    });

    res.render("adminfold/catandbrand", { admin: true, categories, brands, error: req.flash() });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

function addCategory(req, res) {
  res.render("adminfold/addCategory", { admin: true });
}

function addbrand(req, res) {
  res.render("adminfold/addBrands", { admin: true });
}

async function submitcategory(req, res) {
  try {
    await categoryCol.create(req.body);
    const catData = await categoryCol.find();
    const categories = catData.map((ob) => {
      return {
        Name: ob.Name,
      };
    });
    const Data = await brandCol.find();
    const brands = Data.map((ob) => {
      return {
        Name: ob.Name,
      };
    });
    res.render("adminfold/catandbrand", { admin: true, categories, brands });
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      req.flash("error", "Category already exists");
      res.redirect('/admin/categoryandbrand')
    } else {
      res.render("adminfold/error", { admin: true });
    }
  }
}

async function submitBrand(req, res) {
  try {
    await brandCol.create(req.body);
    const Data = await brandCol.find();
    const brands = Data.map((ob) => {
      return {
        Name: ob.Name,
      };
    });
    const catData = await categoryCol.find();
    const categories = catData.map((ob) => {
      return {
        Name: ob.Name,
      };
    });

    res.render("adminfold/catandbrand", { admin: true, brands, categories });
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      req.flash("error", "Brand already exists");
      res.redirect('/admin/categoryandbrand')
    } else {
      res.render("adminfold/error", { admin: true });
    }

  }
}

async function editBrand(req, res) {

  try {

    const name = req.params.name

    const details = await brandCol.findOne({ Name: name }).lean()

    res.render('adminfold/editBrand', { admin: true, details })


  } catch (error) {
    console.log(error);
    res.render('adminfold/error')
  }
}

async function brandEditSubmit(req, res) {

  try {

    const name = req.body.Name;
    const id = req.query.id

    await brandCol.updateOne({ _id: id }, { $set: { Name: name } })

    res.redirect('/admin/categoryandbrand')

  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      req.flash("error", "Brand already exists");
      res.redirect('/admin/categoryandbrand')
    } else {
      res.render("adminfold/error", { admin: true });
    }
  }
}

async function removeBrand(req, res) {

  try {


    const brand = req.params.name

    await brandCol.deleteOne({ Name: brand })

    res.redirect('/admin/categoryandbrand')

  } catch (error) {
    console.log(error);
    res.render('adminfold/error', { admin: true })
  }
}

async function submitProduct(req, res) {
  try {
    const product = req.body;
    product.Images = req.files;
    const Images = req.files.map((ob) => {
      return ob.filename;
    });
    product.Images = Images;
    ImageCrop(Images);

    const data=await productCol.create(product);

    checkBrandOffer(req,res,data._id)
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function softDelete(req, res) {
  try {
    const id = req.query.id;
    const status = req.query.status;
    if (status == "disable") {
      await productCol.updateOne({ _id: id }, { $set: { IsActive: false } });
      res.redirect("/admin/products");
    } else {
      await productCol.updateOne({ _id: id }, { $set: { IsActive: true } });
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function blockUnblock(req, res) {
  try {
    const id = req.query.id;
    const status = req.query.status;
    if (status == "disable") {
      await userCol.updateOne({ _id: id }, { $set: { isActive: false } });

      res.redirect("/admin/customers");
    } else {
      await userCol.updateOne({ _id: id }, { $set: { isActive: true } });
      res.redirect("/admin/customers");
    }
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function editProduct(req, res) {
  try {
    const id = req.query.prod;
    const productData = await productCol.find({ _id: id }).lean();
    let img;
    productData.forEach((ob) => {
      img = ob.Images;
    });

    let CategoryName = {};

    productData.Images = img;

    let BrandName = {};

    const brandData = await brandCol.find();
    const brands = brandData.map((ob) => {
      if (ob._id.equals(productData[0].Brand)) {
        BrandName.Name = ob.Name;
        BrandName._id = ob._id;
      }

      return {
        Name: ob.Name,
        _id: ob._id,
      };
    });

    const catData = await categoryCol.find().lean();
    const categories = catData.map((ob) => {
      if (ob._id.equals(productData[0].Category)) {
        CategoryName.Name = ob.Name;
        CategoryName._id = ob._id;
      }
      return {
        Name: ob.Name,
        _id: ob._id,
      };
    });

    productData[0].Images = img;
    const product = productData[0];

    res.render("adminfold/editProduct", {
      admin: true,
      product,
      brands,
      categories,
      CategoryName,
      BrandName,
    });
  } catch (error) {
    res.render("adminfold/error", { admin: true });
    console.log(error);
  }
}

let oldProductImages = [];
let existing = [];

let ToRemove = [];

async function removeSingleImage(req, res) {
  try {
    const image = req.query.image;
    const prodId = req.query.prodId;

    ToRemove.push(image);

    oldProductImages = await productCol.findOne(
      { _id: prodId },
      { Images: 1, _id: 0 }
    );

    await productCol.updateOne(
      { _id: prodId },
      { $pull: { Images: { $in: ToRemove } } }
    );

    existing = await productCol.findOne({ _id: prodId }, { Images: 1, _id: 0 });

    await productCol.updateOne(
      { _id: prodId },
      { $set: { Images: oldProductImages.Images } }
    );
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function editProductSubmit(req, res) {
  try {
    const product = req.body;
    product.Images = req.files;

    let Images = existing.Images;

    if (req.files.Image1) {
      Images.push(req.files.Image1[0].filename);
    }
    if (req.files.Image2) {
      Images.push(req.files.Image2[0].filename);
    }
    if (req.files.Image3) {
      Images.push(req.files.Image3[0].filename);
    }

    product.Images = Images;

    ImageCrop(Images);
    await productCol.updateOne({ _id: req.query.id }, { $set: product });
    checkBrandOffer(req,res,req.query.id)
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function editCategory(req, res) {
  try {
    const data = await categoryCol.find({ Name: req.query.Name });
    const catData = data.map((ob) => {
      return {
        _id: ob._id,
        Name: ob.Name,
      };
    });

    res.render("adminfold/editcategory", { admin: true, catData });
  } catch (error) { }
}

async function submitEditCategory(req, res) {
  try {
    const catName = req.body.Name;
    const id = req.query.id;
    await categoryCol.updateOne({ _id: id }, { $set: { Name: catName } });
    res.redirect("/admin/categoryandbrand");
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      req.flash("error", "Category already exists");
      res.redirect('/admin/categoryandbrand')
    } else {
      res.render("adminfold/error", { admin: true });
    }
  }
}

async function removeCategory(req, res) {
  try {
    await categoryCol.deleteOne({ Name: req.query.Name });
    res.redirect("/admin/categoryandbrand");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error");
  }
}

async function getDashboard(req, res) {
  try {

    let pageNum = req.query.page || 1
    const perPage = 10;

    pageNum = parseInt(pageNum)

    let orderSummary = await ordersCol.find()
      .sort({ Order_Date: -1 })
      .populate("User_id").lean();

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length = orderSummary.length

    orderSummary = orderSummary.slice(startIndex, endIndex);
    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }


    orderSummary.forEach((ob) => {
      const mongoDBDate = ob.Order_Date;

      const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ob.Order_Date = formattedDate
    })

    const totalUsers = await userCol.find().count()

    const totalRevenuedata = await ordersCol.aggregate([
      { $match: { Payment_Status: 'PAID' } }, { $group: { _id: null, total: { $sum: '$Total_Amount' } } }
    ])

    let totalRevenue

    if (totalRevenuedata.length > 0) {

      totalRevenue = totalRevenuedata[0].total
    }
    res.render("adminfold/dashboard", { admin: true, orderSummary, totalUsers, totalRevenue, pageNum, prev, next });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function salesReport(req, res) {
  try {
    const params = req.params.period;
    let data;
    let labels
    let total

    if (params == "Day") {
      data = await ordersCol.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$Order_Date" } },
            total: { $sum: "$Total_Amount" },
          },
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]);

      labels = data.map((ob) => {
        return ob._id
      });

      total = data.map((ob) => {
        return ob.total
      })

    } else if (params == 'Week') {
      data = await ordersCol.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$Order_Date" }, // Extract the year
              week: { $week: "$Order_Date" }  // Extract the week within the year
            },
            total: { $sum: "$Total_Amount" }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]);

      labels = data.map((ob) => {
        return ob._id.week
      });

      total = data.map((ob) => {
        return ob.total
      })
    } else if (params == 'Month') {
      data = await ordersCol.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$Order_Date" } },
            total: { $sum: "$Total_Amount" },
          },
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]);

      labels = data.map((ob) => {
        return ob._id
      });

      total = data.map((ob) => {
        return ob.total
      })
    } else {
      data = await ordersCol.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y", date: "$Order_Date" } },
            total: { $sum: "$Total_Amount" },
          },
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]);

      labels = data.map((ob) => {
        return ob._id
      });

      total = data.map((ob) => {
        return ob.total
      })

    }

    res.json({ labels, total });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}


async function getSalesReportpage(req, res) {

  try {

    let pageNum = req.query.page || 1
    const perPage = 10;

    pageNum = parseInt(pageNum)

    let salesSummary = await ordersCol.find({ Status: 'Delivered' }).populate("User_id").lean()
    let total = 0

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length = salesSummary.length

    salesSummary = salesSummary.slice(startIndex, endIndex);
    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }
    salesSummary.forEach((ob) => {

      const mongoDBDate = ob.Order_Date;

      const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ob.Order_Date = formattedDate

      total = total + ob.Total_Amount
    })


    res.render('adminfold/salesReport', { admin: true, salesSummary, date: true, total, pageNum, prev, next })

  } catch (error) {
    console.log(error);
    res.render('adminfold/error')
  }
}









module.exports = {
  viewProducts,
  addProduct,
  getCustomers,
  logoutAdmin,
  searchCustomer,
  viewProducts,
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
  removeBrand

};
