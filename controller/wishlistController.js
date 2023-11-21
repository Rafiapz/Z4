const wishCol = require("../model/wishlistModel");
const { ObjectId } = require("mongoose").Types;

async function getWishlist(req, res) {
  try {

    const userWishlist = await wishCol.findOne({ User_id: req.session.userId }).populate('Items.Product_id').exec()
    let Items
    if (userWishlist) {
      Items = userWishlist.Items.map((Items) => Items.Product_id.toJSON())

    }

    if (Items) {
      Items.forEach((ob) => {

        if (ob.Price === ob.DiscountPrice) {
          ob.Price = false
        }
      })
    }

    req.session.couponDiscountPercentage = null
    req.session.couponDiscountAmount = null
    res.render("usersfold/wishlist", { user: true, Items });
  } catch (error) {
    console.log(error);
    res.render("usersfold/error", { user: true });
  }
}

async function addToWishlist(req, res) {
  try {
    const productId = new ObjectId(req.params.id)

    const userWishlist = await wishCol.findOne({ User_id: req.session.userId });

    if (userWishlist) {
      const existing = userWishlist.Items.find((Items) => {

        return Items.Product_id.toString() == productId.toString();
      });


      if (existing) {
        const wishListCountData = await wishCol.findOne({ User_id: req.session.userId })

        const wishCount = wishListCountData.Items.length

        res.json({ message: "Item is already in the wishlist", wishCount });
      } else {
        await wishCol.updateOne(
          { User_id: req.session.userId },
          { $push: { Items: { Product_id: productId } } }
        );

        const wishListCountData = await wishCol.findOne({ User_id: req.session.userId })

        const wishCount = wishListCountData.Items.length
        res.json({ message: "Item added to wishlist ", wishCount });
      }
    } else {


      await wishCol.create({ User_id: req.session.userId, Items: [{ Product_id: productId }] })
      const wishListCountData = await wishCol.findOne({ User_id: req.session.userId })

      const wishCount = wishListCountData.Items.length

      res.json({ message: 'Item added to wishlist', wishCount })

    }
  } catch (error) {
    console.log(error);
    res.render("usersfold/error", { user: true });
  }
}


async function wishlistItemRemove(req, res) {

  try {

    const productId = req.params.id
    await wishCol.updateOne({ User_id: req.session.userId }, { $pull: { Items: { Product_id: productId } } })
    const wishListCountData = await wishCol.findOne({ User_id: req.session.userId })

    const wishCount = wishListCountData.Items.length
    res.json({ message: 'Item removed from wishlist', wishCount })

  } catch (error) {
    console.log(error);
    res.render('usersfold/error', { user: true })
  }
}

module.exports = { getWishlist, addToWishlist, wishlistItemRemove };

