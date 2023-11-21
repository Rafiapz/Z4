const addressCol = require("../model/addressModel");
const { ObjectId } = require("mongoose").Types;

function addAddress(req, res) {
  res.render("usersfold/address", { user: true });
}

async function submitAdress(req, res) {
  try {
    const data = req.body;
    data.User_id = req.session.userId;
    await addressCol.create(data);
    res.redirect("/savedaddresses");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}
async function getAdresses(req, res) {
  try {
    const addressesData = await addressCol.find({
      User_id: req.session.userId,
    });

    const address = addressesData.map((ob) => {
      return {
        AddressId: ob._id,
        FullName: ob.FullName,
        PinCode: ob.PinCode,
      };
    });

    return address;
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function editaddress(req, res) {
  try {

    console.log(req.params.AddressId);
    const addressId = new ObjectId(req.params.AddressId);
    console.log(addressId);
    let data = await addressCol.find({ _id: addressId });
    data = data.map((ob) => {
      return {
        AddressId: ob._id,
        FullName: ob.FullName,
        MobileNumber: ob.MobileNumber,
        Locality: ob.Locality,
        HouseNo: ob.HouseNo,
        PinCode: ob.PinCode,
        City: ob.City,
      };
    });

    const address = data[0];
    res.render("usersfold/editaddress", { user: true, address, profile: true });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error");
  }
}

async function addressEditSubmit(req, res) {
  try {
    await addressCol.updateOne(
      { _id: req.params.AddressId },
      { $set: req.body }
    );
    res.redirect("/savedaddresses");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function addressRemoval(req, res) {
  try {
    const AddressId = req.query.id;

    await addressCol.deleteOne({ _id: AddressId });

    res.redirect("/checkout");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

async function addressRemovalProfile(req, res) {
  try {
    const AddressId = req.query.id;

    await addressCol.deleteOne({ _id: AddressId });

    res.redirect("/savedaddresses");
  } catch (error) {
    console.log(error);
    res.render("adminfold/error", { user: true });
  }
}

module.exports = {
  addAddress,
  submitAdress,
  getAdresses,
  editaddress,
  addressEditSubmit,
  addressRemoval,
  addressRemovalProfile,
};
