const cartCol = require("../model/cartModel");
const productsCol = require("../model/productsModel");

async function cartSummary(req, res, couponDiscountPercentage,checkout) {

  try {

    let userCart
    if(checkout==='checkout'){
      userCart=req.session.order
    }else{
     userCart = await cartCol
      .findOne({ User_id: req.session.userId })
      .populate("Items.Product_id")
      .exec();
    }
    if (userCart) {

      const cartproducts = userCart.Items.map((ob) => {
        ob.TotalDiscountPrice = ob.Product_id.DiscountPrice * ob.Quantity;

        return {
          data: ob.TotalDiscountPrice,
        };
      });

      let finalAmount = 0;
      cartproducts.forEach((ob) => {
        finalAmount = finalAmount + ob.data;
      });
      if (req.session.couponDiscountPercentage) {       
        const discount = Math.floor((finalAmount * req.session.couponDiscountPercentage) / 100)
        finalAmount = finalAmount - discount
        req.session.couponDiscountAmount = discount
      } else if (couponDiscountPercentage) {
        const discount = Math.floor((finalAmount * couponDiscountPercentage) / 100)
        finalAmount = finalAmount - discount;      
        req.session.couponDiscountPercentage = couponDiscountPercentage
        req.session.couponDiscountAmount = discount  
         

      }

      return finalAmount;
    } else {      
      return 0;
    }
  } catch (error) {
    console.log(error);
    res.render('usresfold/error',{user:true})
  }


}

module.exports = cartSummary;
