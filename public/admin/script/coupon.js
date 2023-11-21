
const modal = document.getElementById("couponModalss");


window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// function couponAddAjax() {

//     const btn = document.getElementById('submitBtn')

//     var formData = $("#couponForm").serialize();

//     console.log(formData);

//     $.ajax({
//         url: '/admin/add-coupon',
//         method: 'POST',
//         data: formData,
//         success: function (response) {

//             btn.setAttribute('data-dismiss', 'modal')
//         },
//         error: function (error) {


//         }
//     });

// }

