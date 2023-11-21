const categorycancel = document.getElementById('categoryName');
const categorycanbutton = document.getElementById('canbutton')



function validateBrand() {

  const field = document.getElementById('addBrandId')
  const error = document.getElementById('addBrandError')
  const form = document.getElementById('addBrandForm')

  const namePattern = /^[a-z ,.'-]+$/i;

  if (!namePattern.test(field.value.trim())) {
    error.innerHTML = 'Please Enter a valid name'
  } else {
    form.submit()
  }
}

function validateCategory() {

  const field = document.getElementById('categoryName')
  const error = document.getElementById('categErr')
  const form = document.getElementById('categoryForm')

  const namePattern = /^[a-z ,.'-]+$/i;

  if (!namePattern.test(field.value.trim())) {
    error.innerHTML = 'Please Enter a valid name'
  } else {
    form.submit()
  }

}

function editCategoryValidation() {

  const field = document.getElementById('categoryNameEdit')
  const error = document.getElementById('edtctErr')
  const form = document.getElementById('editCategoryForm')

  const namePattern = /^[a-z ,.'-]+$/i;

  if (!namePattern.test(field.value.trim())) {
    error.innerHTML = 'Please Enter a valid name'
  } else {
    form.submit()
  }
}

function editBrandValidation() {

  const field = document.getElementById('edtBrandId')
  const error = document.getElementById('edtbrandError')
  const form = document.getElementById('edtBrandForm')

  const namePattern = /^[a-z ,.'-]+$/i;

  if (!namePattern.test(field.value.trim())) {
    error.innerHTML = 'Please Enter a valid name'
  } else {
    form.submit()
  }
}

function validateCoupon() {

  let form = document.getElementById('couponForm')
  let code = document.getElementById('coupon_code')
  const codePattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/
  let codeError = document.getElementById('cpCodeerr')
  let discount = document.getElementById('discountcpn')
  let discountError = document.getElementById('discountcpnErr')
  let dataDate = document.getElementById('expiry_datecpn')
  let currentDate = Date.now()
  let dateError = document.getElementById('datecpnErr')
  dataDate = new Date(document.getElementById('expiry_datecpn').value)
  let MinimumOrderAmount = document.getElementById('minimum_ordercpn')
  let MinimumOrderAmountError = document.getElementById('minimum_ordercpnErr')
  let type = document.getElementById('couponType')
  let typeError = document.getElementById('couponTypeErr')
  let usageLimit = document.getElementById('usage_limit')
  let usageLimitError = document.getElementById('usage_limitErr')
  let couponStatus = document.getElementById('couponStatus')
  let couponStatusError = document.getElementById('couponStatusErr')

  if (!codePattern.test(code.value.trim())) {
    codeError.innerHTML = 'Coupon code must have at least 5 characters, one alphabet, one number, and one special character.'
    return
  }
  if (type.value.trim() == '') {
    typeError.innerHTML = 'This field is required'
    codeError.innerHTML = null
    return
  }
  if (discount.value.trim() == '') {
    discountError.innerHTML = 'This field is required'
    typeError.innerHTML = null
    codeError.innerHTML = null
    return
  }
  if (discount.value > 100) {
    discountError.innerHTML = 'Discount should be less than 100'
    typeError.innerHTML = null
    codeError.innerHTML = null
    return
  }
  if (discount.value < 0) {
    discountError.innerHTML = 'Discount should be a positve value'
    codeError.innerHTML = null
    typeError.innerHTML = null
    return
  }

  if (dataDate == 'Invalid Date') {
    dateError.innerHTML = 'This field is required'
    discountError.innerHTML = null
    codeError.innerHTML = null
    typeError.innerHTML = null
    return
  }
  if (dataDate < currentDate) {
    dateError.innerHTML = 'Date should be a future date'
    discountError.innerHTML = null
    codeError.innerHTML = null
    typeError.innerHTML = null

    return
  }

  if (MinimumOrderAmount.value < 1) {
    MinimumOrderAmountError.innerHTML = 'Minimum Order amount should be a positve number'
    dateError.innerHTML = null
    codeError.innerHTML = null
    typeError.innerHTML = null
    discountError.innerHTML = null
    return
  }
  if (usageLimit.value <= 0) {
    dateError.innerHTML = null
    codeError.innerHTML = null
    typeError.innerHTML = null
    discountError.innerHTML = null
    MinimumOrderAmountError.innerHTML = null
    usageLimitError.innerHTML = 'This field should be a positive number'
    return
  }
  if (couponStatus.value.trim() == '') {
    dateError.innerHTML = null
    codeError.innerHTML = null
    typeError.innerHTML = null
    discountError.innerHTML = null
    MinimumOrderAmountError.innerHTML = null
    usageLimitError.innerHTMLr = null
    couponStatusError.innerHTML = 'This field is required'
    return
  }

  form.submit()

}

function editCoupon(Code, CouponType, Discount, ExpiryDate, MinimumOrderAmount, UsageLimit, IsActive, _id) {


  document.getElementById('edit_coupon_code').value = Code;
  document.getElementById('edit_discountcpn').value = Discount;
  document.getElementById('edit_minimum_ordercpn').value = MinimumOrderAmount;

  // Set the selected option based on the CouponType value
  let couponTypeSelect = document.getElementById('edit_couponType');
  for (let i = 0; i < couponTypeSelect.options.length; i++) {
    if (couponTypeSelect.options[i].text === CouponType) {
      couponTypeSelect.selectedIndex = i;
      break;
    }
  }

  // Set the selected option based on the IsActive value
  let isActiveSelect = document.getElementById('edit_couponStatus');
  for (let i = 0; i < isActiveSelect.options.length; i++) {
    if (isActiveSelect.options[i].value === IsActive.toString()) {
      isActiveSelect.selectedIndex = i;
      break;
    }
  }

  // Format date to 'YYYY-MM-DD' for the input type date
  const expiryDate = new Date(Date.parse(ExpiryDate + "Z"));
  console.log(expiryDate);

  // Format date to 'YYYY-MM-DD' for the input type date
  const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
  console.log(formattedExpiryDate);
  document.getElementById('edit_expiry_datecpn').value = formattedExpiryDate;

  document.getElementById('edit_usage_limit').value = UsageLimit;

  let form = document.getElementById('couponFormEdit');
  form.action = `/admin/edit-submit-coupon/${_id}`

}

function editCouponValidation() {

  let form = document.getElementById('couponFormEdit');

  let code = document.getElementById('edit_coupon_code');
  const codePattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
  let codeError = document.getElementById('edit_cpCodeerr');

  let discount = document.getElementById('edit_discountcpn');
  let discountError = document.getElementById('edit_discountcpnErr');

  let expiryDateInput = document.getElementById('edit_expiry_datecpn');
  let expiryDate = new Date(expiryDateInput.value);
  let currentDate = new Date();

  let minimumOrderAmount = document.getElementById('edit_minimum_ordercpn');
  let minimumOrderAmountError = document.getElementById('edit_minimum_ordercpnErr');

  let type = document.getElementById('edit_couponType');
  let typeError = document.getElementById('edit_couponTypeErr');

  let usageLimit = document.getElementById('edit_usage_limit');
  let usageLimitError = document.getElementById('edit_usage_limitErr');

  let couponStatus = document.getElementById('edit_couponStatus');
  let couponStatusError = document.getElementById('edit_couponStatusErr');

  if (!codePattern.test(code.value.trim())) {
    codeError.innerHTML = 'Coupon code must have at least 5 characters, one alphabet, one number, and one special character.';
    return;
  }

  if (type.value.trim() == '') {
    typeError.innerHTML = 'This field is required';
    codeError.innerHTML = null;
    return;
  }

  if (discount.value.trim() == '') {
    discountError.innerHTML = 'This field is required';
    typeError.innerHTML = null;
    codeError.innerHTML = null;
    return;
  }

  if (discount.value > 100) {
    discountError.innerHTML = 'Discount should be less than 100';
    typeError.innerHTML = null;
    codeError.innerHTML = null;
    return;
  }

  if (discount.value < 0) {
    discountError.innerHTML = 'Discount should be a positive value';
    codeError.innerHTML = null;
    typeError.innerHTML = null;
    return;
  }

  if (expiryDateInput.value === '' || expiryDate == 'Invalid Date') {
    document.getElementById('edit_datecpnErr').innerHTML = 'This field is required';
    discountError.innerHTML = null;
    codeError.innerHTML = null;
    typeError.innerHTML = null;
    return;
  }

  if (expiryDate < currentDate) {
    document.getElementById('edit_datecpnErr').innerHTML = 'Date should be a future date';
    discountError.innerHTML = null;
    codeError.innerHTML = null;
    typeError.innerHTML = null;
    return;
  }

  if (minimumOrderAmount.value < 1) {
    minimumOrderAmountError.innerHTML = 'Minimum Order amount should be a positive number';
    document.getElementById('edit_datecpnErr').innerHTML = null;
    codeError.innerHTML = null;
    typeError.innerHTML = null;
    discountError.innerHTML = null;
    return;
  }

  if (usageLimit.value <= 0) {

    codeError.innerHTML = null;
    typeError.innerHTML = null;
    discountError.innerHTML = null;
    minimumOrderAmountError.innerHTML = null;
    usageLimitError.innerHTML = 'Usage limit should be a positive number'
    return;
  }

  if (couponStatus.value.trim() == '') {
    document.getElementById('edit_datecpnErr').innerHTML = null;
    codeError.innerHTML = null;
    typeError.innerHTML = null;
    discountError.innerHTML = null;
    minimumOrderAmountError.innerHTML = null;
    usageLimitError.innerHTML = null;

    return;
  }

  form.submit();

}

function validateBanner() {

  let bannerTitle = document.getElementById('BannerTitle')
  let statusSelect = document.getElementById('bannerStatus');
  let bannerImage = document.getElementById('bannerImage').files[0];
  let form = document.getElementById('bannerForm')

  const namePattern = /^[a-z ,.'-]+$/i;

  if (!namePattern.test(bannerTitle.value.trim())) {
    document.getElementById('bntitleErr').textContent = 'Enter a valid Title.';
    return
  }
  if (statusSelect == '') {
    document.getElementById('bnstatusErr').innerHTML = 'This field is required'
    return
  }
  if (!bannerImage) {
    document.getElementById('bnimageErr').innerHTML = 'Please choose an image'
    return
  }

  form.submit()
}



function validateEditBanner() {
  let bannerTitle = document.getElementById('editBannerTitle');
  let statusSelect = document.getElementById('editBannerStatus');
  let bannerImage = document.getElementById('editBannerImage').files[0];
  let form = document.getElementById('editBannerForm');

  const namePattern = /^[a-z ,.'-]+$/i; // Update the pattern as needed

  if (!namePattern.test(bannerTitle.value.trim())) {
    document.getElementById('editBntitleErr').textContent = 'Enter a valid Title.';
    return;
  }

  if (statusSelect.value === '') {
    document.getElementById('editBnstatusErr').textContent = 'This field is required';
    return;
  }



  form.submit();
}

function validateAddProductForm() {

  const productNameField = document.getElementById('productName');
  const prodNameErr = document.getElementById('prodNameErr');

  // Product Description
  const productDescriptionField = document.getElementById('productDescription');
  const prodDisErr = document.getElementById('prodDisErr');

  // Product Price
  const productPriceField = document.getElementById('productPrice');
  const proPriceErr = document.getElementById('proPriceErr');

  // Discount Price
  const productDisPriceField = document.getElementById('productDisPrice');
  const PodDisPriceErr = document.getElementById('PodDisPriceErr');

  // Product Images
  const productImagesField = document.getElementById('productImages');
  const prodImgErr = document.getElementById('prodImgErr');

  // Product Category
  const productCategoryField = document.getElementById('productCategory');
  const prodCatErr = document.getElementById('prodCatErr');

  // Product Color
  const productColorField = document.getElementById('productColor');
  const prodColErr = document.getElementById('prodColErr');

  // Quantity
  const quantityField = document.getElementById('Quantity');
  const proQtyErr = document.getElementById('proQtyErr');

  // Product Brand
  const productBrandField = document.getElementById('productBrand');
  const prodBrandErr = document.getElementById('prodBrandErr');

  // Product RAM
  const productRAMField = document.getElementById('productRAM');
  const ramErr = document.getElementById('ramErr');

  // Internal Storage
  const productStorageField = document.getElementById('productStorage');
  const storageErr = document.getElementById('storageErr');

  // Product Status
  const productStatusField = document.getElementById('productStatus');
  const prodStausErr = document.getElementById('prodStausErr');

  const form = document.getElementById('addProductForm');

  // Check Product Name
  if (productNameField.value.trim() === '') {
    prodNameErr.textContent = 'Product Name is required.';
    return;
  } else {
    prodNameErr.textContent = '';
  }

  // Check Product Description
  if (productDescriptionField.value.trim() === '') {
    prodDisErr.textContent = 'Product Description is required.';
    return;
  } else {
    prodDisErr.textContent = '';
  }

  // Check Product Price
  if (productPriceField.value.trim() === '') {
    proPriceErr.textContent = 'Product Price is required.';
    return;
  } else {
    proPriceErr.textContent = '';
  }
  if (productPriceField.value <= 0) {
    proPriceErr.textContent = 'Product Price should be positive number.';
    return;
  } else {
    proPriceErr.textContent = '';
  }


  // Check Discount Price
  if (productDisPriceField.value.trim() === '') {
    PodDisPriceErr.textContent = 'Discount Price is required.';
    return;
  } else {
    PodDisPriceErr.textContent = '';
  }
  if (productDisPriceField.value <= 0) {
    PodDisPriceErr.textContent = 'Discount should be positive number';
    return;
  } else {
    PodDisPriceErr.textContent = '';
  }

  // Check Product Images
  if (!productImagesField.files.length) {
    prodImgErr.textContent = 'Please choose at least one image.';
    return;
  } else {
    prodImgErr.textContent = '';
  }

  // Check Product Category (Dropdown)
  if (productCategoryField.value.trim() === '') {
    prodCatErr.textContent = 'Product Category is required.';
    return;
  } else {
    prodCatErr.textContent = '';
  }

  // Check Product Color
  if (productColorField.value.trim() === '') {
    prodColErr.textContent = 'Product Color is required.';
    return;
  } else {
    prodColErr.textContent = '';
  }

  // Check Quantity
  if (quantityField.value.trim() === '') {
    proQtyErr.textContent = 'Quantity is required.';
    return;
  } else {
    proQtyErr.textContent = '';
  }
  if (quantityField.value <= 0) {
    proQtyErr.textContent = 'Quantity should be positive number.';
    return
  } else {
    proQtyErr.textContent = '';
  }

  // Check Product Brand (Dropdown)
  if (productBrandField.value.trim() === '') {
    prodBrandErr.textContent = 'Product Brand is required.';
    return;
  } else {
    prodBrandErr.textContent = '';
  }

  // Check Product RAM (Dropdown)
  if (productRAMField.value.trim() === '') {
    ramErr.textContent = 'Product RAM is required.';
    return;
  } else {
    ramErr.textContent = '';
  }

  // Check Internal Storage (Dropdown)
  if (productStorageField.value.trim() === '') {
    storageErr.textContent = 'Internal Storage is required.';
    return;
  } else {
    storageErr.textContent = '';
  }

  // Check Product Status (Dropdown)
  if (productStatusField.value.trim() === '') {
    prodStausErr.textContent = 'Product Status is required.';
    return;
  } else {
    prodStausErr.textContent = '';
  }

  // If all fields are non-empty, submit the form
  form.submit();
}

function validateEditProductForm() {
  // Product Name
  // Input fields
  const productNameField = document.getElementById('productName');
  const productDescriptionField = document.getElementById('productDescription');
  const productPriceField = document.getElementById('productPrice');
  const productDisPriceField = document.getElementById('productDisPrice');
  const productImagesField0 = document.getElementById('productImages0');
  const productImagesField1 = document.getElementById('productImages1');
  const productImagesField2 = document.getElementById('productImages2');
  const productCategoryField = document.getElementById('productCategory');
  const productColorField = document.getElementById('productColor');
  const quantityField = document.getElementById('Quantity');
  const productBrandField = document.getElementById('productBrand');
  const productRAMField = document.getElementById('productRAM');
  const productStorageField = document.getElementById('productStorage');
  const productStatusField = document.getElementById('productStatus');
  const form = document.getElementById('editProdForm')

  // Error messages
  const prodNameErr = document.getElementById('editProdNameErr');
  const prodDisErr = document.getElementById('editProdDisErr');
  const proPriceErr = document.getElementById('editProPriceErr');
  const PodDisPriceErr = document.getElementById('editPodDisPriceErr');
  const prodImgErr = document.getElementById('prodImgErr');
  const prodCatErr = document.getElementById('editProdCatErr');
  const prodColErr = document.getElementById('editProdColErr');
  const proQtyErr = document.getElementById('editProQtyErr');
  const prodBrandErr = document.getElementById('editProdBrandErr');
  const ramErr = document.getElementById('editRamErr');
  const storageErr = document.getElementById('editStorageErr');
  const prodStausErr = document.getElementById('editProdStatusErr');

  if (!productNameField.value.trim()) {
    prodNameErr.textContent = 'Product name cannot be empty.';
    return;
  }

  // Product Description
  if (!productDescriptionField.value.trim()) {
    prodDisErr.textContent = 'Product description cannot be empty.';
    return;
  }

  // Product Price
  if (!productPriceField.value.trim()) {
    proPriceErr.textContent = 'Product price cannot be empty.';
    return;
  }
  if (productPriceField.value <= 0) {
    proPriceErr.textContent = 'Product price should be a positive number.';
    return;
  }

  // Discount Price
  if (!productDisPriceField.value.trim()) {
    PodDisPriceErr.textContent = 'Discount price cannot be empty.';
    return;
  }
  if (productDisPriceField.value <= 0) {
    PodDisPriceErr.textContent = 'Discount price should be positive number.';
    return;
  }


  // Product Category
  if (!productCategoryField.value.trim()) {
    prodCatErr.textContent = 'Product category cannot be empty.';
    return;
  }

  // Product Color
  if (!productColorField.value.trim()) {
    prodColErr.textContent = 'Product color cannot be empty.';
    return;
  }

  // Quantity
  if (!quantityField.value.trim()) {
    proQtyErr.textContent = 'Quantity cannot be empty.';
    return;
  }
  if (quantityField.value <= 0) {
    proQtyErr.textContent = 'Quantity should be a positive bumber.';
    return;
  }


  // Product Brand
  if (!productBrandField.value.trim()) {
    prodBrandErr.textContent = 'Product brand cannot be empty.';
    return;
  }

  // Product RAM
  if (!productRAMField.value.trim()) {
    ramErr.textContent = 'Product RAM cannot be empty.';
    return;
  }

  // Internal Storage
  if (!productStorageField.value.trim()) {
    storageErr.textContent = 'Internal storage cannot be empty.';
    return;
  }

  // Product Status
  if (!productStatusField.value.trim()) {
    prodStausErr.textContent = 'Product status cannot be empty.';
    return;
  }
  form.submit();
}

function validateOfferForm() {

  // Offer Name
  const offerNameField = document.getElementById('offerName');
  const offnameErr = document.getElementById('offnameErr');

  // Brand
  const offproductBrandField = document.getElementById('offproductBrand');
  const offBrandErr = document.getElementById('offBrandErr');

  // Discount Percentage
  const offdiscountPercentageField = document.getElementById('offdiscountPercentage');
  const offDisErr = document.getElementById('offDisErr');

  // Expiry Date
  const offexpiryDateField = document.getElementById('offexpiryDate');
  const offExpdateErr = document.getElementById('offExpdate');
  let expiryDate = new Date(offexpiryDateField.value);
  let currentDate = new Date();
  // Status
  const offStatusField = document.getElementById('offproductBrand');
  const offStatErr = document.getElementById('offStatErr');


  // Submit Button
  const submitOfferBtnoff = document.getElementById('submitOfferBtnoff');
  const form = document.getElementById('offerForm')

  if (offerNameField.value.trim() === '') {
    offnameErr.textContent = 'Offer Name cannot be empty';
    return;
  } else {
    offnameErr.textContent = '';
  }

  if (offproductBrandField.value === '') {
    offBrandErr.textContent = 'Please select a Brand';
    return;
  } else {
    offBrandErr.textContent = '';
  }

  if (offdiscountPercentageField.value.trim() === '') {
    offDisErr.textContent = 'Discount Percentage cannot be empty';
    return;
  } else {
    offDisErr.textContent = '';
  }
  if (offdiscountPercentageField.value <= 0) {
    offDisErr.textContent = 'Discount should be positive number';
    return;
  } else {
    offDisErr.textContent = '';
  }
  if (offdiscountPercentageField.value >= 100) {
    offDisErr.textContent = 'Discount should be less than 100';
    return;
  } else {
    offDisErr.textContent = '';
  }

  if (offexpiryDateField.value.trim() === '') {
    offExpdateErr.textContent = 'Expiry Date cannot be empty';
    return;
  } else {
    offExpdateErr.textContent = '';
  }
  console.log(expiryDate, 'asd', currentDate)
  if (expiryDate < currentDate) {
    offExpdateErr.textContent = 'Expiry Date should be a future date';
    return
  } else {
    offExpdateErr.textContent = '';
  }

  if (offStatusField.value === '') {
    offStatErr.textContent = 'Please select a Status';
    return;
  }

  form.submit()


}

function editBrandOffer(_id, brand, offerName, discount, ExpiryDate, IsActive) {
  document.getElementById('editofferName').value = offerName;
  document.getElementById('editoffproductBrand').value = brand;
  document.getElementById('editoffdiscountPercentage').value = discount;

  console.log(offerName, ExpiryDate, )

  let brandSelected = document.getElementById('editoffproductBrand');
  for (let i = 0; i < brandSelected.options.length; i++) {
    if (brandSelected.options[i].text === brand) { // Use the 'brand' variable instead of 'CouponType'
      brandSelected.selectedIndex = i;
      break;
    }
  }

  // Set the selected option based on the IsActive value
  let isActiveSelect = document.getElementById('editoffproductStatus'); // Use 'editoffproductStatus' as the correct ID
  for (let i = 0; i < isActiveSelect.options.length; i++) {
    if (isActiveSelect.options[i].value === IsActive.toString()) {
      isActiveSelect.selectedIndex = i;
      break;
    }
  }

  // Format date to 'YYYY-MM-DD' for the input type date
  const expiryDate = new Date(Date.parse(ExpiryDate + "Z"));
  console.log(expiryDate);

  // Format date to 'YYYY-MM-DD' for the input type date
  const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
  console.log(formattedExpiryDate);
  document.getElementById('editoffexpiryDate').value = formattedExpiryDate;

  let form = document.getElementById('editofferForm');
  form.action = `/admin/edit-submit-brandOffer/${_id}`;
}


function validateEditOfferForm() {
  // Offer Name
  const editOfferNameField = document.getElementById('editofferName');
  const editoffnameErr = document.getElementById('editoffnameErr');

  // Brand
  const editoffproductBrandField = document.getElementById('editoffproductBrand');
  const editoffBrandErr = document.getElementById('editoffBrandErr');

  // Discount Percentage
  const editoffdiscountPercentageField = document.getElementById('editoffdiscountPercentage');
  const editoffDisErr = document.getElementById('editoffDisErr');

  // Expiry Date
  const editoffexpiryDateField = document.getElementById('editoffexpiryDate');
  const editoffExpdateErr = document.getElementById('editoffExpdate');
  let expiryDate = new Date(editoffexpiryDateField.value);
  let currentDate = new Date();

  // Status
  const editoffStatusField = document.getElementById('editoffproductBrand');
  const editoffStatErr = document.getElementById('editoffStatErr');

  const form = document.getElementById('editofferForm')
  // Check if any field is empty
  if (editOfferNameField.value.trim() === '') {
    editoffnameErr.textContent = 'Offer Name cannot be empty';
    return;
  } else {
    editoffnameErr.textContent = '';
  }

  if (editoffproductBrandField.value === '') {
    editoffBrandErr.textContent = 'Please select a Brand';
    return;
  } else {
    editoffBrandErr.textContent = '';
  }

  if (editoffdiscountPercentageField.value.trim() === '') {
    editoffDisErr.textContent = 'Discount Percentage cannot be empty';
    return;
  } else {
    editoffDisErr.textContent = '';
  }

  // Check if discount is a positive number
  if (parseFloat(editoffdiscountPercentageField.value) <= 0) {
    editoffDisErr.textContent = 'Discount should be a positive number';
    return;
  } else {
    editoffDisErr.textContent = '';
  }

  // Check if discount is less than 100
  if (parseFloat(editoffdiscountPercentageField.value) >= 100) {
    editoffDisErr.textContent = 'Discount should be less than 100';
    return;
  } else {
    editoffDisErr.textContent = '';
  }
  if (editoffexpiryDateField.value.trim() === '') {
    editoffExpdateErr.textContent = 'Please choose a date'
    return
  } else {
    editoffExpdateErr.textContent = ''
  }
  if (expiryDate <= currentDate) {
    editoffExpdateErr.textContent = 'Please choose a future date'
    return
  } else {
    editoffExpdateErr.textContent = ''
  }

  form.submit()

}

function validateSalesReport() {
  const start = document.getElementById('startDatesales');
  const end = document.getElementById('endDateSales');
  const currentDate = Date.now();

  const startError = document.getElementById('startsldtErr');
  const endError = document.getElementById('endsldtErr');

  if (!start.value && !end.value) {
    startError.innerHTML = 'Choose a date';
    endError.innerHTML = 'Choose a date';
    return;
  } else {
    startError.innerHTML = null;
    endError.innerHTML = null;
  }

  if (!start.value) {
    startError.innerHTML = 'Choose a date';
    return;
  } else {
    startError.innerHTML = null;
  }

  if (!end.value) {
    endError.innerHTML = 'Choose a date';
    return;
  } else {
    endError.innerHTML = null;
  }

  const startDate = new Date(start.value);
  const endDate = new Date(end.value);

  if (startDate > currentDate) {
    startError.innerHTML = 'Please choose a past date';
    return;
  } else {
    startError.innerHTML = null;
  }

  if (endDate < startDate) {
    endError.innerHTML = 'Please choose a date after the Start date';
    return;
  } else {
    endError.innerHTML = null;
  }

  document.getElementById('salesReportForm').submit();
}


