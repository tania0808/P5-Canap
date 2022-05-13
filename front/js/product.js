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


// inserting a product from the API
function showProductInformation (item) {
    //product container
    const itemImg = document.querySelector('.item__img');

    //image
    const itemCardImage = document.createElement('img');
    itemCardImage.setAttribute('src', `${item.imageUrl}`);
    itemCardImage.setAttribute('alt', `${item.altTxt}` )
    itemImg.appendChild(itemCardImage);

    //title
    const title = document.getElementById('title');
    title.innerText = `${item.name}`;
    
    //price
    const price = document.getElementById('price');
    price.innerText = `${item.price}`;

    //description
    const description = document.getElementById('description');
    description.innerText = `${item.description}`;

    //select field
    const colors = document.getElementById('colors');

    /**
     * create options for select field
     * @param {Object} item 
     * @param {HTMLElement} colors 
     */
    createOptions(item, colors);
    
    //add to cart
    addEventListenerOnAddToCartBtn();
}

//create select with options
function createOptions(item, select) {
    for(let op = 0; op < item.colors.length; op++) {
        const option = document.createElement('option');
        option.setAttribute('value', `${item.colors[op]}`);
        option.innerText = `${item.colors[op]}`;
        select.appendChild(option)
    }
}

const emptyDataMsg = document.createElement('p');
const submitContainer = document.querySelector('.item__content__addButton');
submitContainer.style.flexDirection = "column";
emptyDataMsg.style.color = '#fbbcbc';
emptyDataMsg.style.textAlign = 'center';
submitContainer.appendChild(emptyDataMsg);

// adding the event listener to button  on click
function addEventListenerOnAddToCartBtn() {
    const btn = document.getElementById('addToCart');
    const quantityInput = document.getElementById('quantity');
    const selectBox = document.getElementById('colors');

    btn.addEventListener('click', () => {
        const item = {"id":productId, "color": colors.value, "quantity" : parseInt(quantityInput.value)};
        // if the color and input are valid, add them to cart and reset values
        if(isItemValid(item)) {
            addToCart(item);
            emptyDataMsg.innerText = 'Votre commande a été bien prise en compte ! ';
            quantityInput.value = 0;
            selectBox.selectedIndex = 0;
        } else {
            emptyDataMsg.innerText = 'La couleur et le nombre doivent être choisis !';
        }
    })
}

// verify if required items are not empty
function isItemValid(item) {
    const selectBox = document.getElementById('colors');

   return selectBox.selectedIndex != 0 && Number.isInteger(item.quantity) && item.quantity > 0;
}

// save items to the cart
function saveItems(items) {
   localStorage.setItem('items', JSON.stringify(items));
}

// if the cart is empty, array is created
// if not, get the array of objects which represents out cart
function getAllItems() {
    let items = localStorage.getItem('items');
    if (items == null) {
        return [];
    }

    return JSON.parse(items);
}

// if in a cart the item with the same id and color already exists, the quantity changes
// if not, we add the item to the cart
function addToCart(item) {
    let listOfProducts = getAllItems();
    
    let itemExists = listOfProducts.find(element => {
        return element.id == item.id && element.color == item.color;
    });

    if(itemExists === undefined) {
        listOfProducts.push(item)
    } else {
        itemExists.quantity += item.quantity;
    }

    //save a cart in the localStorage after the modifications
    saveItems(listOfProducts);
}