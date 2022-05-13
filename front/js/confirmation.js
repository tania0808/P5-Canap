const orderId = new URLSearchParams(window.location.search).get('id');

const id = document.getElementById('orderId');

id.innerText = orderId;
