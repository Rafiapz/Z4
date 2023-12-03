


function removeBanner(id) {


  const button = document.getElementById('removemodalbnr')

  button.setAttribute('href', `/admin/delete-banner/${id}`)

}


function removeCoupon(id) {

  const button = document.getElementById('removemodalcpn')

  button.setAttribute('href', `/admin/deleteCoupon/${id}`)

}

function removeBrandOffer(id){

  const button = document.getElementById('removemodaloffr')

  button.setAttribute('href', `/admin/delete-brandOffer/${id}`)
}





function removeBrand(name) {

  const btn = document.getElementById('removBrandemodal')

  btn.setAttribute('href', `/admin/remove-brand/${name}`)
}

function removeCategoryjs(name) {

  const btn = document.getElementById('removBrandemodal2')

  btn.setAttribute('href', `/admin/removecategory?Name=${name}`)
}



function previewImages() {
  var preview = document.getElementById('imagePreview');
  var files = document.getElementById('productImages').files;

  // Clear the current content of the preview div
  preview.innerHTML = '';

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var reader = new FileReader();

    reader.onload = function (event) {
      var img = document.createElement('img');
      img.src = event.target.result;
      img.className = 'preview-image';
      preview.appendChild(img);
    }

    reader.readAsDataURL(file);
  }
}

function previewImages() {
  const imageInput = document.getElementById('imageInput');
  const imagePreviews = document.getElementById('imagePreviews');

  if (imageInput.files && imageInput.files.length > 0) {
    for (let i = 0; i < imageInput.files.length; i++) {
      const reader = new FileReader();
      const imageCount = imagePreviews.getElementsByClassName('imagePreview').length;

      const previewContainer = document.createElement('div');
      previewContainer.className = 'image-container';

      const img = document.createElement('img');
      img.className = 'imagePreview';
      img.style.maxWidth = '200px';
      img.style.display = 'block';

      const removeButton = document.createElement('button');
      removeButton.className = 'removeImageButton';
      removeButton.type = 'button';
      removeButton.style.display = 'block';

      reader.onload = function (e) {
        img.src = e.target.result;
        previewContainer.appendChild(img);
        previewContainer.appendChild(removeButton);
        imagePreviews.appendChild(previewContainer);
      };

      reader.readAsDataURL(imageInput.files[i]);
    }
  }
}

const removeButtons = document.getElementsByClassName('removeImageButton');

for (let i = 0; i < removeButtons.length; i++) {
  removeButtons[i].addEventListener('click', function () {
    const imageInput = document.getElementById('imageInput');
    const imagePreviews = document.getElementById('imagePreviews');
    const imageContainers = imagePreviews.getElementsByClassName('image-container');

    // Reset the file input and hide the image and remove button
    imageInput.value = ''; // Reset the file input
    imageContainers[i].remove(); // Remove the image and its container
  });
}




function viewIMG(event, img, prodId, no) {

  document.getElementById(`edtImg${no}`).src = URL.createObjectURL(event.target.files[0])

  $.ajax({
    url: `/admin/remove-single-image?image=${img}&prodId=${prodId}`,
    method: 'get',
    success: (response) => {

    }
  })



}



//chage order status

function changeTheOrderStatus(Order_id, status) {
  const button = document.getElementById(`ordstatbtn${Order_id}`)

  $.ajax({
    url: `/admin/changeorderstatus/${Order_id}?status=${status}`,
    method: "get",
    success: (response) => {
      button.innerHTML = response.Status

      if (response.Status == 'Delivered') {
        button.style.backgroundColor = '#00CC00'
      } else if (response.Status == 'Placed') {
        button.style.backgroundColor = '#0000FF'
      } else if (response.Status == 'Shipped') {
        button.style.backgroundColor = '#FFA500'
      } else if (response.Status == 'Cancelled') {
        button.style.backgroundColor = '#FF0000'
      } else if (response.Status == 'Refunded') {
        button.style.backgroundColor = '#FF0000'
      }

    },
    error: (error) => {
      console.error(error);
    },
  });
}

function actionRefund(id, status) {

  location.href = `/admin/refund-update/${id}?status=${status}`
}

function editBrandOfferAjax(id) {

  const offerName = document.getElementById('offerName')

  $.ajax({
    url: `/edit-brand-Offer/${id}`,
    method: 'get',
    success: (response) => {

    }
  })
}


function prevBannerImage(event) {
  document.getElementById(`imageBannerPreview`).src = URL.createObjectURL(event.target.files[0])
}

function brandOfferStatus(id, status) {

  $.ajax({
    url: `/admin/offer-status-change/${id}?status=${status}`,
    menubar: 'get',
    success: (response) => {

    }
  })
}





