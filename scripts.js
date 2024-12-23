// Initialize cart items and orders, loading existing data from localStorage if available
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];

// Function to add items to the cart
function addToCart(productName, price) {
    const existingItemIndex = cartItems.findIndex(item => item.name === productName);
    
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
    } else {
        cartItems.push({ name: productName, price: price, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    console.log(`${productName} added to cart with price ${price}`);
    alert(`${productName} has been added to your cart!`);
}

// Function to update cart item count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalCount;
}

// Function to load cart items and update checkout button status
function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutCartTotal = document.getElementById('cart-totalP');

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is currently empty.</p>';
        if (checkoutCartTotal) {
            // checkoutBtn.classList.add('disabled');
            // checkoutBtn.disabled = true;
            // checkoutCartTotal.classList.add('display');
            checkoutCartTotal.style.display = 'none';
        }
    } else {
        cartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <p><strong>${item.name}</strong> - ₹${item.price} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</p>
                 <div class="cart-controls">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${index})">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        
        if (checkoutBtn) {
            checkoutBtn.classList.remove('disabled');
            checkoutBtn.disabled = false;
        }
    }

    if (cartTotalElement) {
        cartTotalElement.textContent = `₹${total.toFixed(2)}`;
    }
}

// Function to increase the quantity of an item
function increaseQuantity(index) {
    cartItems[index].quantity += 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    loadCartItems();
}

// Function to decrease the quantity of an item
function decreaseQuantity(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
    } else {
        cartItems.splice(index, 1); // Remove item if quantity becomes 0
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

// Check if the login form is hidden when logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const userLink = document.getElementById('user-link');
    const logoutLink = document.querySelector('.logout-link');
    const loginForm = document.getElementById('login-section');

    if (isLoggedIn) {
        userLink.textContent = 'Dashboard';
        userLink.href = 'dashboard.html';
        logoutLink.style.display = 'block';
        if (loginForm) loginForm.style.display = 'none';
    } else {
        userLink.textContent = 'Login/Register';
        userLink.href = 'login.html';
        logoutLink.style.display = 'none';
        if (loginForm) loginForm.style.display = 'flex';
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
function updateCart(productName, price, action) {
    const productQuantityElement = document.getElementById(`${productName}-quantity`);
    let productQuantity = parseInt(productQuantityElement.textContent);

    if (action === 'increment') {
        productQuantity += 1;
        addToCart(productName, price);
    } else if (action === 'decrement' && productQuantity > 0) {
        productQuantity -= 1;
        removeFromCartByName(productName);
    }

    productQuantityElement.textContent = productQuantity;
}

// Function to remove one item by product name
function removeFromCartByName(productName) {
    const productIndex = cartItems.findIndex(item => item.name === productName);
    if (productIndex !== -1) {
        if (cartItems[productIndex].quantity > 1) {
            cartItems[productIndex].quantity -= 1;
        } else {
            cartItems.splice(productIndex, 1);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
    }
}
function buyNow(productName, price) {
    // Create a temporary cart with only this product
    const temporaryCart = [{ name: productName, price: price, quantity: 1 }];
    localStorage.setItem('temporaryCart', JSON.stringify(temporaryCart));

    // Redirect to checkout page
    window.location.href = 'checkout.html';
}
function updateCart(productName, price, action) {
    const quantitySpan = document.getElementById(`${productName}-quantity`);
    const buyNowButton = document.getElementById(`${productName}-buy`);

    let quantity = parseInt(quantitySpan.textContent);

    if (action === 'increment') {
        quantity++;
    } else if (action === 'decrement' && quantity > 0) {
        quantity--;
    }

    // Update quantity display
    quantitySpan.textContent = quantity;

    // Enable or disable the "Buy Now" button
    if (quantity > 0) {
        buyNowButton.classList.remove('disabled');
        buyNowButton.disabled = false;
    } else {
        buyNowButton.classList.add('disabled');
        buyNowButton.disabled = true;
    }

    // Add or remove the product from the cart
    if (quantity > 0) {
        const existingItemIndex = cartItems.findIndex(item => item.name === productName);
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity = quantity;
        } else {
            cartItems.push({ name: productName, price: price, quantity: quantity });
        }
    } else {
        cartItems = cartItems.filter(item => item.name !== productName);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
}
// Function to manage the "Place Order" button state
function managePlaceOrderButton() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const placeOrderButton = document.querySelector('.checkout-btn');

    if (cartItems.length === 0) {
        placeOrderButton.disabled = true; // Disable button
        placeOrderButton.classList.add('disabled'); // Add disabled styling
        placeOrderButton.title = 'Your cart is empty. Please add items to place an order.';
    } else {
        placeOrderButton.disabled = false; // Enable button
        placeOrderButton.classList.remove('disabled'); // Remove disabled styling
        placeOrderButton.title = ''; // Remove tooltip
    }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', managePlaceOrderButton);

// Product data for demonstration
const products = {
    product1: {
        name: 'Stylish Sofa Set',
        price: 15000,
        description: 'A comfortable and stylish sofa set for your living room.',
        imageUrl: 'product1.jpg',
    },
    product2: {
        name: 'Modern Floor Lamp',
        price: 3500,
        description: 'A sleek lamp for modern interiors.',
        imageUrl: 'product2.jpg',
    },
    product3: {
        name: 'Decorative Wall Mirror',
        price: 2800,
        description: 'A beautiful mirror to enhance your wall decor.',
        imageUrl: 'product3.jpg',
    },
};

// Redirect to product preview page
function redirectToProductPreview(productId) {
    window.location.href = `product_preview.html?product=${productId}`;
}

// Load product details dynamically in the preview page
function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    const product = products[productId];

    if (product) {
        document.querySelector('.product-image').src = product.imageUrl;
        document.querySelector('.product-name').textContent = product.name;
        document.querySelector('.product-price').textContent = `₹${product.price}`;
        document.querySelector('.product-description').textContent = product.description;
    } else {
        document.querySelector('.product-preview').innerHTML = '<p>Product not found.</p>';
    }
}

// Add to Cart from the preview page
function addToCartFromPreview() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    const product = products[productId];

    if (product) {
        addToCart(product.name, product.price);
    }
}

// Buy Now functionality
function buyNow() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    const product = products[productId];

    if (product) {
        alert(`Proceeding to checkout for ${product.name}`);
        // Redirect to checkout page or handle purchase
        window.location.href = 'checkout.html';
    }
}

// Load product details on preview page
document.addEventListener('DOMContentLoaded', loadProductDetails);
