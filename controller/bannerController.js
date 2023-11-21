const bannerCol = require("../model/bannerModel");
const flash = require("express-flash");

async function getBanners(req, res) {
  try {
    
    let pageNum = req.query.page||1
    const perPage = 1;

    pageNum=parseInt(pageNum)

    let Banners = await bannerCol.find().lean();

    const startIndex = (pageNum - 1) * perPage;
    const endIndex = pageNum * perPage;
    let length=Banners.length
  
    Banners = Banners.slice(startIndex, endIndex);
    let prev=pageNum-1
    let next=pageNum+1

    if(prev<1){
      prev=false
    }
 
    if(next>Math.ceil(length/perPage)){
      next=false
    }


    res.render("adminfold/banner", {
      admin: true,
      Banners,
      success: req.flash(),
      pageNum,prev,next 
    });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function addBanner(req, res) {
  try {
    let data = {};

    data.Banner_Title = req.body.Banner_Title;
    data.IsActive = req.body.IsActive;
    data.Banner_Image = req.file.filename;

    await bannerCol.create(data);

    req.flash("success", "Banner succesfully added");

    res.redirect("/admin/banners");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function editBanner(req, res) {
  try {
    const Banner = await bannerCol.findOne({ _id: req.params.id }).lean();

    res.render("adminfold/editBanner", { admin: true, Banner });

  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function editSubmitBanner(req, res) {
  try {
    let data = {};

    data.Banner_Title = req.body.Banner_Title;
    data.IsActive = req.body.IsActive;

    if (req.file) {
      data.Banner_Image = data.Banner_Image = req.file.filename;
    } else {
      const document = await bannerCol.findOne({ _id: req.body.bid });
      data.Banner_Image = document.Banner_Image;
    }

    await bannerCol.updateOne({ _id: req.body.bid }, { $set: data });
    req.flash("success", "Banner edited succesfully");

    res.redirect("/admin/banners");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { admin: true });
  }
}

async function deleteBanner(req, res) {
  try {
    const id = req.params.id;

    await bannerCol.deleteOne({ _id: id });

    req.flash("success", "Banner deleted succesfully");

    res.redirect("/admin/banners");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error");
  }
}

module.exports = {
  getBanners,
  addBanner,
  editBanner,
  editSubmitBanner,
  deleteBanner,
};
