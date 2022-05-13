const orderId = new URLSearchParams(window.location.search).get('id');

document.getElementById('orderId').innerText = orderId;
