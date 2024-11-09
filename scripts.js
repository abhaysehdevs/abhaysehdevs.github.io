// Initialize an empty array to hold cart items or load existing items from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];

// Function to add an item to the cart
function addToCart(productName, price) {
    const existingItemIndex = cartItems.findIndex(item => item.name === productName);
    
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
    } else {
        cartItems.push({ name: productName, price: price, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    alert(`${productName} has been added to your cart!`);
}

// Function to update the cart item count displayed on the cart icon
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalCount;
}

// Function to load cart items on the cart page and update checkout button status
function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.total-price');
    const checkoutBtn = document.getElementById('checkout-btn'); // Assuming you have an ID for the checkout button

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is currently empty.</p>';

        // Disable checkout button if cart is empty
        if (checkoutBtn) {
            checkoutBtn.classList.add('disabled');
            checkoutBtn.disabled = true;
        }
    } else {
        cartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <p><strong>${item.name}</strong> - ₹${item.price} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        // Enable checkout button if cart has items
        if (checkoutBtn) {
            checkoutBtn.classList.remove('disabled');
            checkoutBtn.disabled = false;
        }
    }

    if (cartTotalElement) {
        cartTotalElement.textContent = `₹${total.toFixed(2)}`;
    }
}

// Function to remove an item from the cart
function removeFromCart(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
    } else {
        cartItems.splice(index, 1);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    loadCartItems();
}

// Function to empty the cart
function emptyCart() {
    cartItems = [];
    localStorage.removeItem('cartItems');
    updateCartCount();
    loadCartItems();
    alert('Your cart has been emptied.');
}

// Function to save the user's order when they checkout
function saveOrder() {
    const order = {
        orderId: Date.now(), 
        items: cartItems,
        date: new Date().toLocaleString(),
        totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };

    userOrders.push(order);
    localStorage.setItem('userOrders', JSON.stringify(userOrders));

    // Clear the cart after checkout
    cartItems = [];
    localStorage.removeItem('cartItems');
    updateCartCount();
}

// Function to proceed to checkout, ensuring the user is logged in
function proceedToCheckout() {
    const isLoggedIn = localStorage.getItem('loggedIn');

    if (isLoggedIn) {
        saveOrder();
        alert('Checkout successful! Your order has been placed.');
        window.location.href = 'dashboard.html';
    } else {
        alert('You must be logged in to proceed to checkout.');
        window.location.href = 'login.html';
    }
}

// Function to submit the order on checkout page
function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postal-code').value;
    const phone = document.getElementById('phone').value;

    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items to your cart before checking out.');
        return;
    }

    saveOrder();
    alert('Thank you for your purchase! Your order has been placed.');
    window.location.href = 'dashboard.html';
}

/** LOGIN AND REGISTRATION FUNCTIONALITY **/
// Function to simulate user registration
function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const user = { name, email, password };
    localStorage.setItem('user', JSON.stringify(user));

    alert('Registration successful! You can now log in.');
    window.location.href = 'login.html';
}

// Function to simulate user login
function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        localStorage.setItem('loggedIn', 'true');
        alert('Login successful!');
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password.');
    }
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const userLink = document.getElementById('user-link');
    const logoutLink = document.querySelector('.logout-link');
    const loginForm = document.getElementById('login-section');

    if (isLoggedIn) {
        userLink.textContent = 'Dashboard';
        userLink.href = 'dashboard.html';
        logoutLink.style.display = 'block';
        loginForm.style.display = 'none';
    } else {
        userLink.textContent = 'Login/Register';
        userLink.href = 'login.html';
        logoutLink.style.display = 'none';
        loginForm.style.display = 'flex';
    }
}

// Function to log out the user
function logoutUser() {
    localStorage.removeItem('loggedIn');
    alert('You have been logged out.');
    window.location.href = 'index.html';
}

// Function to load the user's orders in the dashboard
function loadUserOrders() {
    const ordersContainer = document.querySelector('.orders-container');
    const storedOrders = JSON.parse(localStorage.getItem('userOrders')) || [];

    if (storedOrders.length === 0) {
        ordersContainer.innerHTML = '<p>You have no orders yet.</p>';
        return;
    }

    storedOrders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order-item');
        orderElement.innerHTML = `
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Total:</strong> ₹${order.totalAmount.toFixed(2)}</p>
            <p><strong>Items:</strong></p>
            <ul>
                ${order.items.map(item => `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`).join('')}
            </ul>
        `;
        ordersContainer.appendChild(orderElement);
    });
}

// Function to update the username on the dashboard
function updateDashboardUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
    const usernameElement = document.getElementById('username');
    
    if (user) {
        usernameElement.textContent = user.name;
    }
}

// Call functions on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.cart-items')) {
        loadCartItems();
    }
    if (document.querySelector('.orders-container')) {
        loadUserOrders();
        updateDashboardUsername();
    }

    updateCartCount();
    checkLoginStatus();
});

// Function to initialize featured products
function initFeaturedProducts() {
    const products = [
        { name: "Product 1", price: 999.99 },
        { name: "Product 2", price: 1499.99 },
        { name: "Product 3", price: 1999.99 }
    ];

    const featuredContainer = document.querySelector('.featured-products');
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ₹${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        `;
        featuredContainer.appendChild(productElement);
    });
}

// Initialize featured products if on the homepage
if (document.title === 'GharDazzle - Home') { // Replace with the actual title of your homepage
    initFeaturedProducts();
}
