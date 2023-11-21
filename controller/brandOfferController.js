const brandCol = require('../model/brandModel')
const brandOffCol = require('../model/brandOfferModel')
const cron = require('node-cron')
const shell = require('shelljs')
const productCol = require('../model/productsModel')
const { ObjectId } = require("mongoose").Types;


async function checkBrandOffer(req,res,id){

  try {

    const product=await productCol.findOne({_id:id},{Brand:1})
      
    const offers=await brandOffCol.findOne({Brand:product.Brand}).lean()
    
    id=new ObjectId(id)

    if(offers){
      const discountPercentage=offers.Discount

      const discount=offers.Discount/100
       await productCol.updateOne({ _id:id}, [
      {
        $set: {
          DiscountPrice: {
            $floor: {
              $subtract: ["$Price", { $multiply: ["$Price", discount] }]
            }
          }, Offer_Percentage: discountPercentage
        }
      }
    ])
    }else{
      
      await productCol.updateOne({ _id: id }, [{ $set: { DiscountPrice: '$Price', Offer_Percentage: 0 } }])
    }   

    
  } catch (error) {
    console.log(error);
    res.render('admnfold/eroor',{admin:true})
  }
}

async function getBrandOffers(req, res) {

  try {

    let pageNum = req.query.page || 1
    const perPage = 10;

    pageNum = parseInt(pageNum)

    const brands = await brandCol.find().lean()

    let brandOffers = await brandOffCol.find().populate('Brand').lean()

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length = brandOffers.length

    brandOffers = brandOffers.slice(startIndex, endIndex);
    let prev = pageNum - 1
    let next = pageNum + 1

    if (prev < 1) {
      prev = false
    }

    if (next > Math.ceil(length / perPage)) {
      next = false
    }

    brandOffers.forEach((ob) => {

      const mongoDBDateCreated = ob.Created_Date;
      const mongoDBDateExpiry = ob.Expiry_Date;

      const formattedDateCreated = mongoDBDateCreated.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ob.Created_Date = formattedDateCreated

      const formattedDateExpiry = mongoDBDateExpiry.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ob.Expiry_Date = formattedDateExpiry

    })

    res.render('adminfold/offers', { admin: true, brands, brandOffers, success: req.flash(), pageNum, prev, next })

  } catch (error) {
    console.log(error);
    res.render('adminfold/error', { admin: true })
  }
}

async function addBrandOffer(req, res) {

  try {

    const data = req.body

    data.Created_Date = Date.now()

    const discount = data.Discount / 100

    const discountPercentage = parseInt(data.Discount)

    await brandOffCol.create(data)

    const products = await productCol.updateMany({ Brand: data.Brand }, [
      {
        $set: {
          DiscountPrice: {
            $floor: {
              $subtract: ["$Price", { $multiply: ["$Price", discount] }]
            }
          }, Offer_Percentage: discountPercentage
        }
      }
    ])


    res.redirect('/admin/offers')

  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      req.flash("success", "This brand already have an offer");
      res.redirect('/admin/offers')
    } else {
      res.render("adminfold/error", { admin: true });
    }


  }
}

async function editSubmitBrandOffer(req, res) {

  try {

    const id = req.params.id

    await brandOffCol.updateOne({ _id: id }, { $set: req.body })

    await changeOfferStatus(req, res, req.body.IsActive)


    req.flash("success", "Offer edited successfully");

    res.redirect('/admin/offers')


  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      req.flash("success", "This brand already have an offer");
      res.redirect('/admin/offers')
    } else {
      res.render("adminfold/error", { admin: true });
    }
  }
}

async function deleteBrandOffer(req, res) {

  try {

    const id = req.params.id

    const data = await brandOffCol.findOne({ _id: id })

    await brandOffCol.deleteOne({ _id: id })

    await productCol.updateMany({ Brand: data.Brand }, [{ $set: { DiscountPrice: '$Price', Offer_Percentage: 0 } }])

    req.flash("success", "Offer deleted successfully");

    res.redirect('/admin/offers')

  } catch (error) {
    console.log(error);
    res.render('adminfold/error')
  }
}

async function changeOfferStatus(req, res, statuss) {

  try {

    const status = statuss

    await brandOffCol.updateOne({ _id: req.params.id }, { $set: { IsActive: status } })

    const data = await brandOffCol.findOne({ _id: req.params.id }).lean()

    const discount = data.Discount / 100

    const discountPercentage = parseInt(data.Discount)

    if (status) {
      console.log('cll');
      await productCol.updateMany({ Brand: data.Brand }, [
        {
          $set: {
            DiscountPrice: {
              $floor: {
                $subtract: ["$Price", { $multiply: ["$Price", discount] }]
              }
            }, Offer_Percentage: discountPercentage
          }
        }
      ])

    }


  } catch (error) {
    console.log(error);
    res.render('adminfold/error', { admin: true })
  }
}


const task = cron.schedule('* * * * * *', async () => {

  try {

    const currentTime = Date.now()

    const data = await brandOffCol.find().lean()

    if (data.length > 0) {

      data.forEach(async (ob) => {
        if (ob.Expiry_Date <= currentTime) {

          await brandOffCol.updateOne({ _id: ob._id }, { $set: { IsActive: 'false' } })

        }
      })

      const updatedData = await brandOffCol.find().lean()


      updatedData.forEach(async (ob) => {

        if (ob.IsActive == false) {

          await productCol.updateMany({ Brand: ob.Brand }, [{ $set: { DiscountPrice: '$Price', Offer_Percentage: 0 } }])

        }
      })
    } else {

    }
  } catch (error) {
    console.log(error);
  }

});


task.start();

module.exports = { getBrandOffers, addBrandOffer, changeOfferStatus, editSubmitBrandOffer, deleteBrandOffer, checkBrandOffer }