const adminCol = require("../model/adminModel");
const multer = require("multer");
const path = require("path");

function isAdmininSession(req, res, next) {
  if (req.session.adminId) {
    next();
  } else {
    res.render("adminfold/login");
  }
}


async function validateadmin(req, res, next) {
  const adminData = await adminCol.findOne({ Email_Id: req.body.Email_Id });
  if (!adminData) {
    res.render("adminfold/login", {
      invalid: "Incorrect username or password",
    });
  } else {
    if (req.body.Password == adminData.Password) {
      req.session.adminId = req.body.Email_Id;
      res.redirect("/admin/dashboard");
    } else {
      res.render("adminfold/login", {
        invalid: "Incorrect username or password",
      });
    }
  }
}



const storage = multer.diskStorage({
  destination:(req, file, cb)=> {
    cb(null, './public/uploads')
  },
  filename:(req, file, cb) =>{
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})


const bannerStorage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./public/uploads/banners')
  },
  filename:(req,file,cb)=>{
    const uniqueSuffix=Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,file.fieldname+'-' + uniqueSuffix)
  }
})



const upload = multer({ storage: storage });

const uploadBanner=multer({storage:bannerStorage})




module.exports = { isAdmininSession, validateadmin, upload,uploadBanner };
