const API_ROOT = 'http://localhost:3000/api';

// getting elements from api
async function getProducts() {
    let response = await fetch(`${API_ROOT}/products/`);
    let products = await response.json();
    return products;
}

//executing all the functions
async function awaitForDataAndShowItemsFromTheCart() {
    const items = await getProducts();
    const productsOfCart = [];
    
    findAndCompareItemsInAPI(items, productsOfCart);
    
    showAllItemsInTheCart(productsOfCart);
    
    calculateTotals(productsOfCart);
    
    
    const inputField = document.querySelectorAll('.itemQuantity');
    updateTotals(inputField, productsOfCart);
    
    const deleteItemBtn = document.querySelectorAll('.deleteItem');
    const sectionOfCartItems = document.getElementById('cart__items');
    const articleCartItem = document.querySelectorAll('.cart__item');
    deleteItemFromTheCart(deleteItemBtn,productsOfCart, sectionOfCartItems, articleCartItem);
}

awaitForDataAndShowItemsFromTheCart();


/**
 * find items in API array to extract additional data and push every found item to a new array
 * @param {Object []} item 
 * @param {Object []} cartProductItems 
 */
function findAndCompareItemsInAPI(item, cartProductItems) {
    let itemsLocalStorage = getItemsLocalStorage();

    if (itemsLocalStorage != null) {
        for (let i = 0; i < itemsLocalStorage.length; i++) {
            const itemId = itemsLocalStorage[i].id;
            const found = item.find(element => element._id == itemId);
            cartProductItems.push({
                'id': found._id,
                'name': found.name,
                'color': itemsLocalStorage[i].color,
                'price': found.price,
                'imgUrl': found.imageUrl,
                'quantity' : itemsLocalStorage[i].quantity,
                'altTxt' : found.altTxt
            })
        }
    }
}

// get local storage
function getItemsLocalStorage() {
    return JSON.parse(
        localStorage.getItem('items')
        );
}

// loop through our cart and show all the products
function showAllItemsInTheCart(items) {
    for(let i = 0; i < items.length; i++) {
        var item = items[i]; 
        // create elements
        createProductInBasket(item);
    }
}
//create HTML elements for each cart product  
function createProductInBasket(product) {
        //article
    const productItemsCart = document.getElementById('cart__items');
    const itemArticleCart = document.createElement('article');
    itemArticleCart.classList.add('cart__item');
    setAttributes(itemArticleCart, {
        "data-id": product.id,
        "data-color" : product.color
    })
    productItemsCart.appendChild(itemArticleCart);
    
    //div cart_item_img
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('cart__item__img');
    itemArticleCart.appendChild(imgContainer)
    const productImg = document.createElement('img');
    productImg.classList.add('cart__item__image');
    setAttributes(productImg, {
        "src": product.imgUrl,
        "alt" : product.altTxt
    })
    imgContainer.appendChild(productImg);
    
    //div cart__item__content
    const cartItemContent = document.createElement('div');
    cartItemContent.classList.add('cart__item__content');
    itemArticleCart.appendChild(cartItemContent);
    
    //cart__item__content__description ----- div
    const cartItemDescription = document.createElement('div');
    cartItemDescription.classList.add('cart__item__content__description');
    cartItemContent.appendChild(cartItemDescription);
    //cart__item__content__description ----- tags
    //h3
    const cartItemTitle = document.createElement('h2');
    cartItemTitle.innerText = product.name;
    cartItemDescription.appendChild(cartItemTitle);
    //p color
    const cartItemColor = document.createElement('p');
    cartItemColor.innerText = product.color;
    cartItemDescription.appendChild(cartItemColor);
    //p price
    const cartItemPrice = document.createElement('p');
    cartItemPrice.classList.add('cart__item__content__price');
    cartItemPrice.innerText = `${product.price}€`;
    cartItemDescription.appendChild(cartItemPrice);
    
    //div  cart__item__content__settings
    const cartItemSettings = document.createElement('div');
    cartItemSettings.classList.add('cart__item__content__settings');
    cartItemContent.appendChild(cartItemSettings);
    // div quantity
    const cartItemQuantity = document.createElement('div');
    cartItemQuantity.classList.add('cart__item__content__settings__quantity');
    cartItemSettings.appendChild(cartItemQuantity);
    // p quantité
    const cartItemQuantityLabel = document.createElement('p');
    cartItemQuantityLabel.innerText = "Qté : ";
    cartItemQuantity.appendChild(cartItemQuantityLabel);
    //input quantity
    const cartItemQuantityInput = document.createElement('input');
    cartItemQuantityInput.classList.add('itemQuantity');
    setAttributes(cartItemQuantityInput, {
    "type" : "number",
    "name" : "itemQuantity",
    "min" : "1",
    "max" : "100",
    "value" : product.quantity
    })
    cartItemQuantity.appendChild(cartItemQuantityInput);
    // div delete button
    const cartItemDelete = document.createElement('div');
    cartItemDelete.classList.add('cart__item__content__settings__delete');
    cartItemSettings.appendChild(cartItemDelete);
    //p delete
    const cartItemDeleteBth = document.createElement('p');
    cartItemDeleteBth.classList.add("deleteItem")
    cartItemDeleteBth.innerText = "Supprimer";
    cartItemDelete.appendChild(cartItemDeleteBth);
}

// set multiple attributes
function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

// calculate total articles and total price
function calculateTotals(items) {
    const totalQuantityOfArticles = document.getElementById('totalQuantity');
    const totalPriceOfArticles = document.getElementById('totalPrice');
    totalQuantityOfArticles.innerText = calculateQuantity(items);
    totalPriceOfArticles.innerText = calculateTotalPrice(items);
}

// calculate total quantity of products
function calculateQuantity(items) {
    return items.reduce((a, b) => {
        return a + b.quantity;
    }, 0);
}
// calculate total price of products
function calculateTotalPrice(items) {
    //total du prix
    return items.reduce((a, b) => {
        return a + (b.price * b.quantity);
    }, 0);
}

// update local storage, the cart and the totals on changing quantity
function updateTotals(input, cartItems) {
    for (let i = 0; i < input.length; i++) {
        input[i].addEventListener("change", (event) =>  {
            const targetElement = event.target.closest('.cart__item').dataset;
            const dataId = targetElement.id;
            const dataColor = targetElement.color;
            let itemsLocalStorage = getItemsLocalStorage();

            const found = cartItems.find(element => element.id == dataId && element.color == dataColor);
            found.quantity = Number(event.target.value);


            let index = itemsLocalStorage.findIndex(element => element.id == dataId && element.color == dataColor);
            itemsLocalStorage[index].quantity = Number(event.target.value);

            let newLocalStorage = JSON.stringify(itemsLocalStorage);
            localStorage.setItem('items', newLocalStorage);

            calculateTotals(cartItems);
        })
    }
}

// delete the product from local storage and cart on click
function deleteItemFromTheCart(deleteBtn,cartItems, section, article) { 
    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener("click", (event) => {
            const targetElement = event.target.closest('.cart__item').dataset;
            const dataId = targetElement.id;
            const dataColor = targetElement.color;
            let itemsLocalStorage = getItemsLocalStorage();

            let indexLs = itemsLocalStorage.findIndex(element => element.id == dataId && element.color == dataColor);

            let indexCartItems = cartItems.findIndex(element => element.id == dataId && element.color == dataColor);
            section.removeChild(article[indexCartItems]);
            
            itemsLocalStorage.splice(indexLs, 1);
            let newLocalStorage = JSON.stringify(itemsLocalStorage);
            localStorage.setItem('items', newLocalStorage); 

            cartItems.splice(indexCartItems, 1);

            calculateTotals(cartItems);
            
            console.log(cartItems);         
        })
    }
};


// Creation of regEx for email, adress, and simple names
const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const nameFormat = /^[A-Z][^0-9!?@#$%^&*)(':;=+/]{1,15}$/;
const adressFormat = /^[0-9]+,* *[a-zA-Z][^0-9]*$/;

// Getting values from form inputs
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
const form = document.querySelector('.cart__order__form');

// HTML elements for errror messages
const emptyCartMsg = document.createElement('p');
const submitContainer = document.querySelector('.cart__order__form__submit');
submitContainer.style.flexDirection = "column";
emptyCartMsg.style.textAlign = 'center';
emptyCartMsg.style.color = '#fbbcbc';
submitContainer.appendChild(emptyCartMsg);


// Valadation of the form and if all data is valid, create an object which contain requested data to an API
function isValidForm(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validName(firstName)&& validName(lastName) && validAdress(address) && validName(city) && validEmail(email)) {
            const requestedData = {
                contact: {
                    firstName,
                    lastName,
                    address,
                    city,
                    email
                },
                products: []
            };

            const localProducts = getItemsLocalStorage();
            
            // get the id's of all products in the cart and add them to requestedData.products array
            if (localProducts != null) {
                for (let i = 0; i < localProducts.length; i++) {
                    requestedData.products.push(localProducts[i].id)
                }
            };
            // fill the requestedData.contact object with contact information
            requestedData.contact.firstName =  firstName.value;
            requestedData.contact.lastName = lastName.value;
            requestedData.contact.address = address.value;
            requestedData.contact.city = city.value;
            requestedData.contact.email = email.value;
            

            // POST order information to API, get orderId and redirection to confirmation page
            // if the cart is empty, display error message
            if (localProducts == null) {
                emptyCartMsg.innerText = 'Veuillez choisir des produits, votre panier est vide';
            } else {
                postInformationToApiAndShowOrderNumber(requestedData)
            }
        }
        else {
            return false;
        }
    })
}

isValidForm(form);

// validation of simple input ex. name, surname, city (without numbers and some special characters)
const validName = function (inputName) {
    //création de la regex pour la validation de nom
    const nameFormat = /^[A-Z][^0-9!?@#$%^&*)(':;=+/]{1,15}$/;
    if (inputName.value.match(nameFormat)) {
        inputName.nextElementSibling.innerText = "";
        return true;
    } else {
        inputName.nextElementSibling.innerText = "Votre nom n'est pas valide";
        return false;
    }
}

// validation of adress input (number of street is necessary)
const validAdress = function(inputName) {
    //création de la regex pour la validation d'adresse
    const adressFormat = /^[0-9]+,* *[a-zA-Z][^0-9]*$/;
    if (inputName.value.match(adressFormat)) {
        inputName.nextElementSibling.innerText = "";
        return true;
    } else {
        inputName.nextElementSibling.innerText = "Votre adresse n'est pas valide, veuillez indiquez le numero de la voie";
        return false;
    }
}

// validation of email
const validEmail = function (inputName) {
    //création de la regex pour la validation d'email
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputName.value.match(emailFormat)) {
        inputName.nextElementSibling.innerText = "";
        return true;
    } else {
        inputName.nextElementSibling.innerText = "Votre adresse mail n'est pas valide, ex: exemple@domain.com";
        return false;
    }
}

// request data by passing the object with contact data and product id's
// redirection to confirmation page
// clearing localStorage after passing the order
const postInformationToApiAndShowOrderNumber = function(requestedData){
    fetch(`${API_ROOT}/products/order`, {
        method: 'POST',
        body: JSON.stringify(requestedData),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json())
    .then(json => {
                redirectionToConfirmationPage(json.orderId);
                localStorage.clear();
            })
    .catch(err => console.log(err));
} 

function redirectionToConfirmationPage(url) {
    document.location.href = `confirmation.html?id=${url}`;
}











