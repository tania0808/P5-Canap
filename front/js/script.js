const API_ROOT = 'http://localhost:3000/api';

//request a data from api and inserting it in HTML
function getAllProducts(showElements) {
    fetch(`${API_ROOT}/products`)
    .then(response => response.json())
    .then(items => {
        //function to execute
        showElements(items);
    })
}