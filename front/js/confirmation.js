// get order id from URL and displaying it on the page
const orderId = new URLSearchParams(window.location.search).get('id');

document.getElementById('orderId').innerText = orderId;
