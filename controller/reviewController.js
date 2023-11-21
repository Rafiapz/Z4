const reviewCol = require("../model/reviewModel");
const productCol = require('../model/productsModel')




async function getRating(req, res) {

  try {

    req.session.ratingOfprod = req.query.rating

    console.log(req.session.ratingOfprod);

    res.send({})
  } catch (error) {
    console.log(error);
    res.render('adminfold/error')
  }
}


async function postReview(req, res) {
  try {
    console.log(req.session.ratingOfprod);
    const productId = req.params.id;
    let ratings = req.session.ratingOfprod
    ratingOfprod = null
    if (ratings) {
      ratings = ratings.split('')
      ratings = ratings.pop();
    }
    let feedback
    if (req.body.feedback) {
      feedback = req.body.feedback;
    }
    let image
    if (req.file) {
      image = req.file.filename
    }
    let data = {}
    if (feedback) {
      data.Feedback = feedback
    }
    if (ratings) {
      data.Rating = ratings
    }
    if (image) {
      data.Image = image
    }
    console.log(data);
    if (data.Feedback || data.Rating) {
      await reviewCol.updateOne(
        { User_id: req.session.userId, Product_id: productId },
        { $set: data },
        { upsert: true }
      );
    }
    const { rating } = await averageRating(req, res, productId)

    await productCol.updateOne({ _id: productId }, { $set: { Average_Rating: rating } })

    res.redirect(`/detailed?product=${productId}`)

  } catch (error) {
    console.log(error);
    res.render("usersfold/error", { user: true });
  }
}


async function allReviewofaProduct(req, res) {

  try {

    let reviews = await reviewCol.find({ Product_id: req.query.product }).populate('User_id').exec()

    reviews = reviews.map((ob) => {

      ob.ratings;

      if (ob.Rating == 1) {
        ob.ratings = [true, false, false, false, false]
      } else if (ob.Rating == 2) {
        ob.ratings = [true, true, false, false, false]
      } else if (ob.Rating == 3) {
        ob.ratings = [true, true, true, false, false]
      } else if (ob.Rating == 4) {
        ob.ratings = [true, true, true, true, false]
      } else if (ob.Rating == 5) {
        ob.ratings = [true, true, true, true, true]
      }

      return {
        Name: ob.User_id.Full_Name,
        Feedback: ob.Feedback,
        Rating: ob.ratings,
        Image: ob.Image
      }
    })


    return reviews

  } catch (error) {
    console.log(error);
    res.render('usersfold/error', { user: true })
  }
}

async function userAllReviews(req, res) {

  try {

    let allReviews = await reviewCol.find({ User_id: req.session.userId }).populate('Product_id').lean()

    allReviews = allReviews.map((ob) => {

      ob.ratings;

      if (ob.Rating == 1) {
        ob.ratings = [true, false, false, false, false]
      } else if (ob.Rating == 2) {
        ob.ratings = [true, true, false, false, false]
      } else if (ob.Rating == 3) {
        ob.ratings = [true, true, true, false, false]
      } else if (ob.Rating == 4) {
        ob.ratings = [true, true, true, true, false]
      } else if (ob.Rating == 5) {
        ob.ratings = [true, true, true, true, true]
      }

      return {
        Name: ob.Product_id.Name,
        Feedback: ob.Feedback,
        Rating: ob.ratings
      }
    })


    res.render('usersfold/profile/reviews', { user: true, profile: true, allReviews })

  } catch (error) {
    console.log(error);
    res.render('usersfold/eroor', { user: true })
  }
}

async function averageRating(req, res, productId) {

  try {

    const data = await reviewCol.find({ Product_id: productId })

    let count = 0;
    let sum = 0
    data.forEach((ob) => {

      count++
      sum = ob.Rating + sum

    })

    let average = Math.floor(sum / count)

    let rating = []

    if (average == 1) {
      rating = [true, false, false, false, false]
    } else if (average == 2) {
      rating = [true, true, false, false, false]
    } else if (average == 3) {
      rating = [true, true, true, false, false]
    } else if (average == 4) {
      rating = [true, true, true, true, false]
    } else if (average == 5) {
      rating = [true, true, true, true, true]
    } else {
      rating = [false, false, false, false, false]
    }



    return { rating, sum, count }

  } catch (error) {
    console.log(error);
    res.render('usersfold/error', { user: true })
  }
}

module.exports = { postReview, allReviewofaProduct, userAllReviews, averageRating, getRating };
