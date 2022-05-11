const API_ROOT = 'http://localhost:3000/api';

//request a data from api and inserting it in HTML
function getAllProducts(showElements) {
    fetch(`${API_ROOT}/products`)
    .then(response => response.json())
    .then(items => {
        /**
         *executing a function in order to insert all items with the information from API
         @param {Object []} items
         */
        showElements(items);
    })
}

getAllProducts(showAllProducts);

//loop into every product of the API
function showAllProducts(items) {
    for (let i = 0; i < items.length; i++) {

        const oneItem = items[i];
        
        createCard(oneItem);
    }
}

//create and insert data for each card
function createCard (product) {
        
    const items = document.getElementById('items');

    //link
    const itemCard = document.createElement('a');
    itemCard.setAttribute('href', `./product.html?id=${product._id}`)
    items.appendChild(itemCard);
    
    //article
    const itemCardArticle = document.createElement('article');
    itemCard.appendChild(itemCardArticle);
    
    //images
    const itemCardImage = document.createElement('img');
    itemCardImage.setAttribute('src', `${product.imageUrl}`);
    itemCardImage.setAttribute('alt', `${product.altTxt}` )
    itemCardArticle.appendChild(itemCardImage);

    //h3
    const itemCardTitle = document.createElement('h3');
    itemCardTitle.innerText = product.name;
    itemCardArticle.appendChild(itemCardTitle);

    //description
    const itemCardDescription = document.createElement('p');
    itemCardDescription.innerText = product.description;
    itemCardArticle.appendChild(itemCardDescription);
}