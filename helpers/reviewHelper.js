const reviewCol = require("../model/reviewModel");
const orderCol = require("../model/orderModel");
const { ObjectId } = require("mongoose").Types;

async function isUserBoughtProduct(req, res, query) {
  try {
  
    let queryy=new ObjectId(query)
    const userId=new ObjectId(req.session.userId)

    const userProducts=await orderCol.aggregate([
        {$match:{User_id:userId}},{$unwind:'$Items'},{$match:{'Items.Product_id':queryy}}])
        .exec()
            
      if(userProducts.length>0){
        return true
      }else{
        return false
      }
  } catch (error) {
    console.log(error);
    res.render("usersfold/error",{user:true});
  }
}

module.exports = { isUserBoughtProduct };
