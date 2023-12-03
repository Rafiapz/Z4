
//edit profile form validation
function validateProfileForm() {
  const nameField = document.getElementById("profileFullName");
  const oldPasswordField = document.getElementById("profileOldPassword");
  const newPasswordField = document.getElementById("profileNewPassword");
  const confirmPasswordField = document.getElementById(
    "profileConfirmPassword"
  );
  const mobileNumberField = document.getElementById("profileMobileNumber");

  const nameError = document.getElementById("profileNameError");
  const oldPasswordError = document.getElementById("profileOldPasswordError");
  const newPasswordError = document.getElementById("profileNewPasswordError");
  const confirmPasswordError = document.getElementById(
    "profileConfirmPasswordError"
  );
  const mobileNumberError = document.getElementById("profileMobileNumberError");

  let isValid = true;

  nameError.textContent = "";
  oldPasswordError.textContent = "";
  newPasswordError.textContent = "";
  confirmPasswordError.textContent = "";

  const mobilePattern = /(7|8|9)\d{9}/;

  if (nameField.value.trim() == '') {
    nameError.innerHTML = "Name must contain only letters and be at least 4 characters long"
    isValid = false
    return
  }

  if (mobileNumberField.value == "") {
    isValid = true;
  } else {
    if (!mobilePattern.test(mobileNumberField.value)) {
      mobileNumberError.innerHTML = "Please enter a valid mobile number";
      isValid = false;
      return
    }
  }

  const namePattern = /^[a-z ,.'-]+$/i;
  if (!namePattern.test(nameField.value.trim())) {
    nameError.textContent =
      "Name must contain only letters and be at least 4 characters long";
    isValid = false;
    return
  }


  if (newPasswordField.value == "") {
    isValid = true;
  } else {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(newPasswordField.value)) {
      newPasswordError.textContent =
        "Minimum eight characters, at least one letter, one number and one special character";
      isValid = false;
      return
    }

    if (newPasswordField.value !== confirmPasswordField.value) {
      confirmPasswordError.textContent =
        "New password and confirmation don't match";
      isValid = false;
      return
    }
  }

  if (isValid) {

    document.getElementById("profileForm").submit();
  }
}

// Ensure the JavaScript code is executed after the DOM has fully loaded.
document.addEventListener("DOMContentLoaded", function () {
  // Your code here
});

//address form validation

//resend OTP

function OneTimePasswordResend() {
  $.ajax({
    url: "/resendOTP",
    method: "get",
    success: (response) => {

    },
  });
}

function productDetailsUser(prodId) {
  window.location = `/detailed?product=${prodId}`;
}

//zoom image
var options = {
  width: 180,
  zoomWidth: 500,

  offset: { vertical: 0, horizontal: -580 },
};

var imageZoom;
imageZoom = new ImageZoom(document.getElementById("img-container"), options);

//change image
function changeSrc(id) {
  let mainImage = document.getElementById("mainim");
  mainImage.src = `/uploads/cropped/${id}`;
  mainImage.dataset.zoomImage = `/uploads/original/${id}`;

  document.getElementById("img-container").innerHTML = `
    <img id="mainim" src="/uploads/cropped/${id}" alt="Product Image" class="img-fluid">`;
  imageZoom = new ImageZoom(document.getElementById("img-container"), options);
}

function viewCart() {
  window.location = "/viewcart";
}

function addToCart(productId) {
  $.ajax({
    url: `/addtocart/${productId}`,
    method: "get",
    success: (response) => {
      if (response.status == true) {

        Toastify({
          text: "Item added to cart",
          duration: 1500,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          onClick: function () { } // Callback after click
        }).showToast();

        const cartcount = document.getElementById("cartcount");
        if (response.cartcount) {
          const count = parseInt(response.cartcount);
          cartcount.innerHTML = count;
        } else {
          cartcount.innerHTML = null;
        }
      } else {

      }
    },
    error: (error) => {
      console.error(error);
    },
  });
}

  
function changeQuantity(
  productId,
  count,
  PRICE,
  DISCOUNTPRICE,
  QUANTITY,
  STOCK
) {
  const showCount = document.getElementById(`countDisplay${productId}`);
  const currentCount = parseInt(showCount.innerHTML);

  const priceId = document.getElementById(`pricecart${productId}`);
  const DiscountPriceId = document.getElementById(`dispricecart${productId}`);

  const price = parseInt(PRICE);
  const discountPrice = parseInt(DISCOUNTPRICE);
  const quantity = parseInt(QUANTITY);
  const stock = parseInt(STOCK);

  const subtotal = document.getElementById("subtotal");
  const finalamt = document.getElementById("finalamt");
  const couponDiscount = document.getElementById('couponDiscountAmount')


  if (currentCount <= 1 && count <= 0) {
    return;
  }
  if (currentCount >= stock && count >= 0) {
    Toastify({
      text: "Stock limit exeedes",
      duration: 1500,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#FF0000',
        color: "#ffffff",
      },
      onClick: function () { } // Callback after click
    }).showToast();
    return;
  }

  $.ajax({
    url: `/change-product-quantity`,
    data: {
      productId: productId,
      count: count,
    },
    method: "post",
    success: (response) => {
      if (response.status == true) {
        const qty = parseInt(response.Quantity);

        showCount.innerHTML = response.Quantity;

        priceId.innerHTML = price * response.Quantity;
        DiscountPriceId.innerHTML = discountPrice * response.Quantity;
        subtotal.innerHTML = response.Subtotal;
        finalamt.innerHTML = response.Subtotal;



        if (response.couponDiscountAmount) {
          couponDiscount.innerHTML = '₹-' + response.couponDiscountAmount
          subtotal.innerHTML = response.Subtotal + response.couponDiscountAmount
        }
        if (response.couponNotApplicable) {
          couponDiscount.innerHTML = null

          Toastify({
            text: "Coupon can't apply less than minimum order amount",
            duration: 3500,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function () { } // Callback after click
          }).showToast();

          const error = document.getElementById('couponEror')

          error.innerHTML = null

        }
      }
    },
  });
}

function removeItemFromCart(productid) {
  const subtotal = document.getElementById("subtotal");
  const finalamt = document.getElementById("finalamt");
  const countValue = cartcount.value;
  const couponDiscount = document.getElementById('couponDiscountAmount')


  $.ajax({
    url: `/removecartitem/${productid}`,
    method: "get",
    success: (response) => {
      const cartcount = document.getElementById("cartcount");

      if (response.cartCount == 0) {
        cartcount.innerHTML = null
      } else {
        cartcount.innerHTML = response.cartCount;
      }
      const cartdv = document.getElementById(`cartItemsContainer${productid}`);
      cartdv.innerHTML = null;
      subtotal.innerHTML = response.Subtotal;
      finalamt.innerHTML = response.Subtotal;

      if (response.couponDiscountAmount) {
        couponDiscount.innerHTML = '₹-' + response.couponDiscountAmount
        subtotal.innerHTML = response.Subtotal + response.couponDiscountAmount
      }
      if (response.couponNotApplicable) {
        couponDiscount.innerHTML = null

        Toastify({
          text: "Coupon can't apply less than minimum order amount",
          duration: 3500,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          onClick: function () { } // Callback after click
        }).showToast();

        const error = document.getElementById('couponEror')

        error.innerHTML = null

      }
      Toastify({
        text: "Item removed from cart",
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () { } // Callback after click
      }).showToast();
    },
  });
}

function checkout(id) {

  let ids = []

  $.ajax({
    url: `/check-product-stock`,
    method: 'get',
    success: (response) => {
      if (response.Status) {
        window.location = "/checkout";
      } else {
        ids = response.Items
        console.log(response);
        for (let i = 0; i < ids.length; i++) {
          document.getElementById(`out${ids[i].id}`).textContent = 'This product is unavailable'

        }
        Toastify({
          text: "Sorry remove the unavailable product",
          duration: 1500,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: '#FF0000',
            color: "#ffffff",
          },
          onClick: function () { } // Callback after click
        }).showToast();
      }
    }
  })


}

function removeAddressFromProfile(id) {
  const modal = document.getElementById("removemodalProfile");

  modal.setAttribute("href", `/removeaddress-profile?id=${id}`);
}

function removeAddress(AddressId) {
  const removeModalLink = document.getElementById("removemodal");

  removeModalLink.setAttribute("href", `/removeaddress?id=${AddressId}`);
}
//place order
const makepaymentdiv = document.getElementById("makepayment");
const placeorderdiv = document.getElementById("placeorderdiv");
const cashOnDelivery = document.getElementById("cashOnDelivery");
const addressradio = document.getElementById("shpaddress");
const togglebt = document.getElementById("togglebt");
const confirmModal = document.getElementById("exampleModalCenter");
const wallet = document.getElementById('wallet')

document.addEventListener("DOMContentLoaded", () => {

  if (cashOnDelivery !== null) {
    cashOnDelivery.addEventListener("change", () => {
      placeorderdiv.style.display = "block";
      makepaymentdiv.style.display = "none";
    });
  }

  if (makepaymentdiv !== null) {
    document.getElementById("razorpay").addEventListener("change", () => {
      makepaymentdiv.style.display = "block";
      placeorderdiv.style.display = "none";
    });
  }

  if (makepaymentdiv !== null) {
    document.getElementById("wallet").addEventListener("change", () => {
      placeorderdiv.style.display = "block";
      makepaymentdiv.style.display = "none";
    });
  }





});

let Address;
function sentAddress(AddressId) {
  Address = AddressId;
  console.log(Address);
}
let method;

function paymentMethod(paymethod) {
  console.log(paymethod);
  method = paymethod;
}

async function placeOrder() {
  const addresserror = document.getElementById("noaddress");
  const nopaymentmethoderror = document.getElementById("nopaymentmethod");

  if (!Address && !method) {
    addresserror.innerHTML = "Address is required field";
    nopaymentmethoderror.innerHTML = "Please select a payment method";
    return;
  } else if (!Address) {
    addresserror.innerHTML = "Address is required field";
    return;
  } else if (!method) {
    nopaymentmethoderror.innerHTML = "Please select a payment method";
    return;
  }

  $.ajax({
    url: `/check-product-stock`,
    method: 'get',
    success: async (response) => {
      if (response.Status) {
        $.ajax({
          url: "placetheorder",
          method: "post",
          data: {
            method,
            Address,
          },
          success: (response) => { },
        });
        await swal(
          "Order Placed!",
          "You have placed an order successfully!",
          "success"
        );

        window.location.href = "/myorders";



      } else {
        ids = response.Items
        console.log(response);

        Toastify({
          text: "Sorry remove the unavailable product from cart",
          duration: 1500,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: '#FF0000',
            color: "#ffffff",
          },
          onClick: function () { } // Callback after click
        }).showToast();
      }
    }
  })




}

function hideModal() { }

const returnButton = document.getElementById('rtnn')
function cancelOrder(Order_id) {
  const statusTag = document.getElementById("userordstatustg");

  $.ajax({
    url: `/usercancelorder?OrderId=${Order_id}`,
    method: "get",
    success: (response) => {
      if (response.refund) {
        statusTag.innerHTML = `<strong>Status:${response.Status}</strong>`;
        returnButton.style.display = 'none'

        Toastify({
          text: "Amount is credited to your wallet",
          duration: 1500,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          onClick: function () { } // Callback after click
        }).showToast();
      } else {
        statusTag.innerHTML = `<strong>Status:${response.Status}</strong>`;
        returnButton.style.display = 'none'

      }


    },
  });
}

function returnItems(Order_id) {
  const statusTag = document.getElementById("userordstatustg");

  $.ajax({
    url: `/user-return-items?OrderId=${Order_id}`,
    method: "get",
    success: (response) => {
      statusTag.innerHTML = `<strong>Status:${response.Status}</strong>`;
      returnButton.style.display = 'none'

    },
  });

}

function toWishList(id) {

  const count = document.getElementById('wishcount')
  $.ajax({
    url: `/add-to-wishlist/${id}`,
    method: "get",
    success: (response) => {

      Toastify({
        text: `${response.message}`,
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () { } // Callback after click
      }).showToast();

      count.innerHTML = response.wishCount

    },
  });
}

function addToCartFromWishlist(productId) {
  const button = document.getElementById(`tocart${productId}`);
  const incartbtn = document.getElementById(`itemincart${productId}`);

  $.ajax({
    url: `/addtocart/${productId}`,
    method: "get",
    success: (response) => {
      if (response.status == true) {
        Toastify({
          text: "Item added to cart",
          duration: 1500,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          onClick: function () { } // Callback after click
        }).showToast();

        button.style.display = "none";
        incartbtn.style.display = "block";

        const cartcount = document.getElementById("cartcount");
        if (response.cartcount) {
          const count = parseInt(response.cartcount);
          cartcount.innerHTML = count;
        } else {
          cartcount.innerHTML = null;
        }
      } else {
        Toastify({
          text: "Somethink went wrong",
          duration: 1500,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: '#FF0000',
            color: "#ffffff",
          },
          onClick: function () { } // Callback after click
        }).showToast();
      }
    },
    error: (error) => {
      console.error(error);
    },
  });
}

function removeItemFromWishlist(id) {
  const container = document.getElementById(`wishlistcontainer${id}`);
  const count = document.getElementById('wishcount')
  console.log("hh cled");
  $.ajax({
    url: `/remove-wishlist-item/${id}`,
    method: "get",
    success: (response) => {

      Toastify({
        text: `${response.message}`,
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () { } // Callback after click
      }).showToast();
      container.innerHTML = null;
      if (response.wishCount == 0) {
        count.innerHTML = null
      } else {
        count.innerHTML = response.wishCount
      }
    },
  });
}



async function razorpaycall() {
  const addresserror = document.getElementById("noaddress");
  const nopaymentmethoderror = document.getElementById("nopaymentmethod");

  if (!Address && !method) {
    addresserror.innerHTML = "Address is required field";
    nopaymentmethoderror.innerHTML = "Please select a payment method";
    return;
  } else if (!Address) {
    addresserror.innerHTML = "Address is required field";
    return;
  } else if (!method) {
    nopaymentmethoderror.innerHTML = "Please select a payment method";
    return;
  }

  $.ajax({
    url: `/check-product-stock`,
    method: 'get',
    success: (response) => {
      if (response.Status) {

        $.ajax({
          url: "/makepayment",
          method: "post",
          data: {
            method,
            Address,
          },
          success: async (response) => {

            const order_id = response.id

            var options = {
              key: "rzp_test_n7T0wcONYZwk3H", // Enter the Key ID generated from the Dashboard
              amount: response.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
              currency: "INR",
              name: "Z4 Mobiles",
              description: "Test Transaction",
              image: "https://example.com/your_logo",
              order_id: order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
              handler: async (response) => {

                placeOrder()

              },
              prefill: {
                name: "Gaurav Kumar",
                email: "gaurav.kumar@example.com",
                contact: "9000090000",
              },
              notes: {
                address: "Razorpay Corporate Office",
              },
              theme: {
                color: "#800080",
              },
            };

            var rzp1 = new Razorpay(options);
            await rzp1.open();


          },
        });


      } else {

        Toastify({
          text: "Sorry remove the unavailable product",
          duration: 1500,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: '#FF0000',
            color: "#ffffff",
          },
          onClick: function () { } // Callback after click
        }).showToast();
      }
    }
  })

}

function verifypayment(payment, order_id) {

  $.ajax({
    url: `/verify-online-payment`,
    data: {
      payment,
      order_id
    },
    method: 'post'
  })

}

function couponApplyAjax() {


  const error = document.getElementById('couponEror')
  const total = document.getElementById('finalamt')
  const couponDiscount = document.getElementById('couponDiscountAmount')
  const licpnn = document.getElementById('licpnn')
  const subtotal = document.getElementById('subtotal')
  const coupon_id = document.getElementById('couponidmain').value

  if (!coupon_id) {
    error.innerHTML = 'Sorry, Enter a valid coupon';
    return
  }

  $.ajax({
    url: `/apply-coupon/${coupon_id}`,
    method: 'get',
    success: (response) => {

      if(!response.message){
        error.style.color = 'red'
        error.innerHTML = 'Invalid coupon'
      }else{

      if (response.status) {
        error.style.color = 'green'
        error.innerHTML = response.message
        total.innerHTML = response.total

        if (response.couponDiscountAmount) {

          couponDiscount.innerHTML = '₹-' + response.couponDiscountAmount
          subtotal.innerHTML = response.total + response.couponDiscountAmount

        }
      } else {
        error.style.color = 'red'
        error.innerHTML = response.message
      }
    }
  }
  })

}

function validateAddressform() {

  const form = document.getElementById('shipping-form')
  const fullName = document.getElementById('adressname').value.trim();
  const fullNameRegex = /^[a-zA-Z\s]+$/;
  if (!fullNameRegex.test(fullName)) {
    document.getElementById('adname-error').textContent = 'Invalid Full Name';
    return;
  }
  document.getElementById('adname-error').textContent = '';

  // Mobile Number validation
  const mobileNumber = document.getElementById('addressmobile').value.trim();
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobileNumber)) {
    document.getElementById('admobile-error').textContent = 'Invalid Mobile Number';
    return;
  }
  document.getElementById('admobile-error').textContent = '';

  // House No., Building Name validation
  const houseNo = document.getElementById('address').value.trim();
  if (!houseNo) {
    document.getElementById('address-error').textContent = 'This field is required';
    return;
  }
  document.getElementById('address-error').textContent = '';

  // Locality validation
  const locality = document.getElementById('locality').value.trim();
  if (!locality) {
    document.getElementById('locality-error').textContent = 'This field is required';
    return;
  }
  document.getElementById('locality-error').textContent = '';

  // City/District validation
  const city = document.getElementById('city').value.trim();
  if (!city) {
    document.getElementById('city-error').textContent = 'This field is required';
    return;
  }
  if (!fullNameRegex.test(city)) {

    document.getElementById('city-error').textContent = 'Enter a valid city name';
    return;

  }
  document.getElementById('city-error').textContent = '';

  // Pin Code validation
  const pinCode = document.getElementById('zip').value.trim();
  const pinCodeRegex = /^[0-9]{6}$/;
  if (!pinCodeRegex.test(pinCode)) {
    document.getElementById('zip-error').textContent = 'Invalid Pin Code';
    return;
  }
  document.getElementById('zip-error').textContent = '';



  form.submit()



}


function validateEditAddressForm() {


  const form = document.getElementById('shipping-form-edit');

  // Full Name validation
  const fullName = document.getElementById('edit-name').value.trim();
  const fullNameRegex = /^[a-zA-Z\s]+$/;
  if (!fullNameRegex.test(fullName)) {
    document.getElementById('adname-error').textContent = 'Invalid Full Name';
    return;
  }
  document.getElementById('adname-error').textContent = '';

  // Mobile Number validation
  const mobileNumber = document.getElementById('edit-mobile').value.trim();
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobileNumber)) {
    document.getElementById('admobile-error').textContent = 'Invalid Mobile Number';
    return;
  }
  document.getElementById('admobile-error').textContent = '';

  // House No., Building Name validation
  const houseNo = document.getElementById('edit-address').value.trim();
  if (!houseNo) {
    document.getElementById('address-error').textContent = 'This field is required';
    return;
  }
  document.getElementById('address-error').textContent = '';

  // Locality validation
  const locality = document.getElementById('edit-locality').value.trim();
  if (!locality) {
    document.getElementById('locality-error').textContent = 'This field is required';
    return;
  }
  document.getElementById('locality-error').textContent = '';

  // City/District validation
  const city = document.getElementById('edit-city').value.trim();
  if (!city) {
    document.getElementById('city-error').textContent = 'This field is required';
    return;
  }
  if (!fullNameRegex.test(city)) {
    document.getElementById('city-error').textContent = 'Enter a valid city name';
    return;
  }
  document.getElementById('city-error').textContent = '';

  // Pin Code validation
  const pinCode = document.getElementById('edit-zip').value.trim();
  const pinCodeRegex = /^[0-9]{6}$/;
  if (!pinCodeRegex.test(pinCode)) {
    document.getElementById('zip-error').textContent = 'Invalid Pin Code';
    return;
  }
  document.getElementById('zip-error').textContent = '';

  // If all validations pass, you can submit the form
  form.submit();

}





