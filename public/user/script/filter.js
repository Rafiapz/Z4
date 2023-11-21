// Initialize an array to store selected brands and prices
let selectedFilters = {
    brand: [],
    price: []
  };
  
  // Event listener for brand filter
  document.getElementById('brandFilter').addEventListener('change', (ev) => {
    if (ev.target.checked) {
        selectedFilters.brand.push(ev.target.id);
    } else {
        const index = selectedFilters.brand.indexOf(ev.target.id);
        if (index !== -1) {
            selectedFilters.brand.splice(index, 1);
        }
    }
  
    // Call the filter function to update the product list
    filterProducts(selectedFilters);
  });
  
  // Event listener for price filter
  document.getElementById('priceFilter').addEventListener('change', (ev) => {
    if (ev.target.checked) {
        selectedFilters.price.push(ev.target.value);
    } else {
        const index = selectedFilters.price.indexOf(ev.target.value);
        if (index !== -1) {
            selectedFilters.price.splice(index, 1);
        }
    }
  
  
    filterProducts(selectedFilters);
  });
  
  
  function filterProducts(filters) {
    $.ajax({
        url: '/get-products-filtered',
        method: 'get',
        data: {
            brand: filters.brand,
            price: filters.price
        },
        success: (response) => {
            let products = response.data;
            let isGuest=response.isGuest
    
            updateProductList(products,isGuest);
        }
    });
  }
  
  
  function updateProductList(products,isGuest) {
    var productHTML = ''; 
  
    if (products.length > 0) {
        for (var i = 0; i < products.length; i++) {
          productHTML += `
          <div class="col-md-3">
      <figure class="card card-sm card-product">
          <div class="img-wrap" id="${products[i]._id}" style="padding: 5px;">
              <img onclick="productDetailsUser('${products[i]._id}')" src="/uploads/cropped/${products[i].Images[0]}">
              
              ${isGuest ? '' : `
                  <div onclick="toWishList('${products[i]._id}')" class="wishlist-icon">
                      <i class="fa fa-heart"></i>
                  </div>`
              }
          </div>
  
          <figcaption class="info-wrap text-center">
              <h6 class="title text-truncate"><a href="#">${products[i].Name}</a></h6>
              <div class="rating-wrap mb-2">
                  ${products[i].Average_Rating.map(rating => rating ? `<i class="fas fa-star" style="color: rgb(237, 229, 15);"></i>` : `<i class="fas fa-star"></i>`).join('')}
                  <br>
                  <div class="label-rating">RAM: ${products[i].RAM}; Internal Storage: ${products[i].InternalStorage}</div>
              </div>
          
              <div class="product-prices">
                  <span class="original-price"><del style="color: red;">₹${products[i].Price}</del></span>
                  <span class="discount-price">₹${products[i].DiscountPrice}</span>
              </div>
              <p>
                  ${isGuest ? `
                      <button id="btnVIEWDETAILS" onclick="productDetailsUser('${products[i]._id}')" class="btn alert btn-info">
                          VIEW DETAILS
                      </button>`
                  : `
                      <button id="btnaddtocart" onclick="addToCart('${products[i]._id}')" class="btn alert btn-info">
                          <i class="fa fa-shopping-cart"></i> ADD TO CART
                      </button>`
                  }
              </p>
          </figcaption>
      </figure>
  </div>
  `
        }
    }
  
  
    document.getElementById('proloop').innerHTML = productHTML;
  }
  