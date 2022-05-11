const API_ROOT = 'http://localhost:3000/api';

//getting the id of a product from URL
const productId = new URLSearchParams(window.location.search).get('id');

function getAllProducts(showDescription) {
    fetch(`${API_ROOT}/products/${productId}`)
    .then(response => response.json())
    .then(item => {
        showDescription(item);
    })
}

getAllProducts(showProductInformation);