/* =============================================
   TechNest E-Commerce | Karlyle Ambursley
   Student ID: 2111685 | CIT2011 | IA#2
   script.js — External JavaScript (linked to all pages)
   ============================================= */

/* =============================================
   IA#2 — PRODUCT DATA (shared across pages)
   ============================================= */
const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro",   price: 4999, emoji: "🎧", image: "../earbuds.jfif",      category: "Audio",       desc: "True wireless, 30hr battery, noise cancellation." },
  { id: 2, name: "Mechanical Keyboard",    price: 7500, emoji: "⌨️", image: "../keyboard.jpg",     category: "Peripherals", desc: "RGB backlit, tactile switches, compact TKL layout." },
  { id: 3, name: "USB-C Hub 7-in-1",       price: 3200, emoji: "🔌", image: "../usb-hub.jpg",      category: "Accessories", desc: "HDMI 4K, 3×USB-A, SD card, 100W PD charging." },
  { id: 4, name: "Portable SSD 1TB",       price: 8900, emoji: "💾", image: "../SSD.jpg",          category: "Storage",     desc: "540MB/s read, USB 3.2, shock-resistant casing." },
  { id: 5, name: "Webcam 1080p HD",        price: 5500, emoji: "📷", image: "../WEBCAM.jfif",      category: "Peripherals", desc: "Auto-focus, built-in mic, plug-and-play USB." },
  { id: 6, name: "Smart LED Desk Lamp",    price: 2800, emoji: "💡", image: "../DESK-lamp.jpg",    category: "Accessories", desc: "Touch dimmer, USB charging port, 5 colour temps." },
  { id: 7, name: "Gaming Mouse 16000 DPI", price: 4200, emoji: "🖱️", image: "../mouse.jfif",       category: "Peripherals", desc: "Programmable buttons, RGB, ergonomic design." },
  { id: 8, name: "Phone Stand Adjustable", price: 1500, emoji: "📱", image: "../phone stand.jfif", category: "Accessories", desc: "Aluminium, 360° rotation, fits all phone sizes." }
];

/* =============================================
   IA#2 — CART UTILITIES
   Functions: getCart, saveCart, addToCart, removeFromCart, updateQty, clearCart
   Creator: Karlyle Ambursley
   ============================================= */

/**
 * getCart — retrieves cart array from localStorage
 * @returns {Array} cart items
 */
function getCart() {
  /* IA#2 — DOM/Storage: read cart from localStorage */
  return JSON.parse(localStorage.getItem("tn_cart") || "[]");
}

/**
 * saveCart — persists cart array to localStorage
 * @param {Array} cart
 */
function saveCart(cart) {
  localStorage.setItem("tn_cart", JSON.stringify(cart));
  updateCartBadge();
}

/**
 * addToCart — adds a product to the cart or increments qty
 * @param {number} productId
 */
function addToCart(productId) {
  /* IA#2 — Control structure: find existing item */
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
  }
  saveCart(cart);
  showToast(`Added to cart!`);
}

/**
 * removeFromCart — removes an item from the cart by id
 * @param {number} productId
 */
function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

/**
 * updateQty — updates quantity of a cart item
 * @param {number} productId
 * @param {number} delta — +1 or -1
 */
function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  /* IA#2 — Control structure: remove if qty drops to 0 */
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
}

/**
 * clearCart — empties the entire cart
 */
function clearCart() {
  saveCart([]);
}

/**
 * getCartTotal — calculates subtotal, discount, tax, total
 * @returns {Object} { subtotal, discount, tax, total }
 */
function getCartTotal() {
  /* IA#2 — Arithmetic calculations */
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal >= 10000 ? Math.round(subtotal * 0.1) : 0; /* 10% off orders over $10,000 */
  const taxable  = subtotal - discount;
  const tax      = Math.round(taxable * 0.15);  /* 15% GCT */
  const total    = taxable + tax;
  return { subtotal, discount, tax, total };
}

/**
 * getCartCount — returns total number of items in cart
 * @returns {number}
 */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/* =============================================
   IA#2 — UI UTILITIES
   ============================================= */

/**
 * updateCartBadge — updates the cart count badge in nav
 * Creator: Karlyle Ambursley
 */
function updateCartBadge() {
  /* IA#2 — DOM Manipulation: getElementById */
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

/**
 * showToast — displays a brief notification message
 * @param {string} msg
 * Creator: Karlyle Ambursley
 */
function showToast(msg) {
  /* IA#2 — DOM Manipulation: createElement, appendChild */
  let toast = document.getElementById("tn-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "tn-toast";
    toast.style.cssText = `
      position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999;
      background:var(--clr-accent); color:#fff; padding:0.7rem 1.2rem;
      border-radius:8px; font-family:var(--font-mono); font-size:0.85rem;
      box-shadow:0 4px 20px rgba(233,69,96,0.4); opacity:0;
      transition:opacity 0.3s ease; pointer-events:none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  /* IA#2 — setTimeout: auto-hide toast */
  setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}

/**
 * formatPrice — formats a number as JMD currency string
 * @param {number} amount
 * @returns {string}
 */
function formatPrice(amount) {
  return "J$" + amount.toLocaleString();
}

/* =============================================
   IA#2 — FORM VALIDATION UTILITIES
   Creator: Karlyle Ambursley
   ============================================= */

/**
 * showError — displays an error message under a field
 * @param {string} fieldId
 * @param {string} msg
 */
function showError(fieldId, msg) {
  /* IA#2 — DOM Manipulation: querySelector, classList */
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + "-err");
  if (field)  field.classList.add("error");
  if (errEl) { errEl.textContent = msg; errEl.classList.add("show"); }
}

/**
 * clearError — clears error state from a field
 * @param {string} fieldId
 */
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + "-err");
  if (field)  field.classList.remove("error");
  if (errEl)  errEl.classList.remove("show");
}

/**
 * validateEmail — checks if a string is a valid email
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  /* IA#2 — Regex validation */
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * validatePassword — checks password strength (min 8 chars, 1 number)
 * @param {string} pw
 * @returns {boolean}
 */
function validatePassword(pw) {
  return pw.length >= 8 && /\d/.test(pw);
}

/* =============================================
   IA#2 — PAGE INIT: runs on every page load
   ============================================= */
document.addEventListener("DOMContentLoaded", function () {
  /* IA#2 — Event listener: DOMContentLoaded */
  updateCartBadge();
  highlightActiveNav();
});

/**
 * highlightActiveNav — marks the current page link as active
 * Creator: Karlyle Ambursley
 */
function highlightActiveNav() {
  /* IA#2 — DOM Manipulation: querySelectorAll, classList */
  const links = document.querySelectorAll(".nav-links a");
  const current = window.location.pathname.split("/").pop();
  links.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === current) link.classList.add("active");
  });
}

/* =============================================
   IA#2 — PRODUCTS PAGE
   ============================================= */

/**
 * renderProducts — builds product cards into #product-grid
 * @param {Array} list — array of product objects to render
 * Creator: Karlyle Ambursley
 */
function renderProducts(list) {
  /* IA#2 — DOM Manipulation: getElementById, innerHTML */
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--clr-text); grid-column:1/-1;">No products found.</p>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="product-card" aria-label="${p.name}">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" class="product-img" />
      </div>
      <div class="product-info">
        <span class="section-label">${p.category}</span>
        <p class="product-name">${p.name}</p>
        <p class="product-desc">${p.desc}</p>
        <p class="product-price">${formatPrice(p.price)}</p>
        <div class="product-actions">
          <button class="btn btn-solid btn-sm" onclick="addToCart(${p.id})" aria-label="Add ${p.name} to cart">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

/**
 * filterProducts — filters products by category or search term
 * Creator: Karlyle Ambursley
 */
function filterProducts() {
  /* IA#2 — DOM Manipulation + control structures */
  const search   = (document.getElementById("search-input")?.value || "").toLowerCase();
  const category = document.getElementById("cat-filter")?.value || "all";

  const filtered = PRODUCTS.filter(p => {
    const matchCat    = category === "all" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  renderProducts(filtered);
}

/* =============================================
   IA#2 — CART PAGE
   ============================================= */

/**
 * renderCart — builds the cart table and summary
 * Creator: Karlyle Ambursley
 */
function renderCart() {
  /* IA#2 — DOM Manipulation: getElementById, innerHTML */
  const tbody   = document.getElementById("cart-tbody");
  const summary = document.getElementById("cart-summary");
  const emptyEl = document.getElementById("cart-empty");
  const tableEl = document.getElementById("cart-table-wrap");
  if (!tbody) return;

  const cart = getCart();

  /* IA#2 — Control structure: show empty state */
  if (cart.length === 0) {
    if (emptyEl)  emptyEl.style.display = "block";
    if (tableEl)  tableEl.style.display = "none";
    if (summary)  summary.style.display = "none";
    return;
  }

  if (emptyEl)  emptyEl.style.display = "none";
  if (tableEl)  tableEl.style.display = "block";
  if (summary)  summary.style.display = "block";

  /* IA#2 — Arithmetic: subtotal per row */
  tbody.innerHTML = cart.map(item => `
    <tr>
      <td>${item.emoji} ${item.name}</td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
      </td>
      <td>${formatPrice(item.price * item.qty)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="removeItem(${item.id})" aria-label="Remove ${item.name}">Remove</button></td>
    </tr>
  `).join("");

  /* IA#2 — Arithmetic: totals */
  const { subtotal, discount, tax, total } = getCartTotal();
  document.getElementById("sum-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("sum-discount").textContent = discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0);
  document.getElementById("sum-tax").textContent      = formatPrice(tax);
  document.getElementById("sum-total").textContent    = formatPrice(total);
}

/**
 * changeQty — wrapper called from cart table buttons
 * @param {number} id
 * @param {number} delta
 */
function changeQty(id, delta) {
  updateQty(id, delta);
  renderCart();
}

/**
 * removeItem — wrapper called from cart table remove button
 * @param {number} id
 */
function removeItem(id) {
  removeFromCart(id);
  renderCart();
}

/**
 * clearAllCart — clears cart and re-renders
 */
function clearAllCart() {
  clearCart();
  renderCart();
  showToast("Cart cleared.");
}

/* =============================================
   IA#2 — CHECKOUT PAGE
   ============================================= */

/**
 * renderCheckoutSummary — populates order summary on checkout page
 * Creator: Karlyle Ambursley
 */
function renderCheckoutSummary() {
  const list = document.getElementById("checkout-items");
  if (!list) return;
  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = `<p style="color:var(--clr-text);">Your cart is empty. <a href="products.html">Shop now</a></p>`;
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="summary-row">
      <span>${item.emoji} ${item.name} × ${item.qty}</span>
      <span>${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join("");

  const { subtotal, discount, tax, total } = getCartTotal();
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl("co-subtotal", formatPrice(subtotal));
  setEl("co-discount", discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0));
  setEl("co-tax",      formatPrice(tax));
  setEl("co-total",    formatPrice(total));
  setEl("co-amount",   formatPrice(total));
}

/**
 * validateCheckout — validates the checkout shipping form
 * @returns {boolean}
 * Creator: Karlyle Ambursley
 */
function validateCheckout() {
  /* IA#2 — Form validation */
  let valid = true;
  const fields = ["co-name", "co-address", "co-city", "co-phone"];
  fields.forEach(id => {
    clearError(id);
    const val = document.getElementById(id)?.value.trim();
    if (!val) { showError(id, "This field is required."); valid = false; }
  });
  return valid;
}

/**
 * submitCheckout — handles checkout form submission
 * Creator: Karlyle Ambursley
 */
function submitCheckout() {
  /* IA#2 — Event handler for checkout confirm */
  if (!validateCheckout()) return;
  const cart = getCart();
  if (cart.length === 0) { showToast("Your cart is empty!"); return; }

  /* Show confirmation modal */
  const modal = document.getElementById("confirm-modal");
  if (modal) modal.classList.add("show");
}

/**
 * confirmOrder — finalises the order
 */
function confirmOrder() {
  clearCart();
  const modal = document.getElementById("confirm-modal");
  if (modal) modal.classList.remove("show");
  const successEl = document.getElementById("order-success");
  const formEl    = document.getElementById("checkout-form-wrap");
  if (successEl) successEl.style.display = "block";
  if (formEl)    formEl.style.display    = "none";
  updateCartBadge();
}

/**
 * cancelCheckout — closes the confirm modal
 */
function cancelCheckout() {
  const modal = document.getElementById("confirm-modal");
  if (modal) modal.classList.remove("show");
}

/* =============================================
   IA#2 — LOGIN PAGE
   ============================================= */

/**
 * handleLogin — validates and processes login form
 * Creator: Karlyle Ambursley
 */
function handleLogin(e) {
  /* IA#2 — Event handler: form submit */
  e.preventDefault();
  let valid = true;

  const username = document.getElementById("login-username")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  clearError("login-username");
  clearError("login-password");

  /* IA#2 — Form validation: empty check */
  if (!username) { showError("login-username", "Username is required."); valid = false; }
  if (!password) { showError("login-password", "Password is required."); valid = false; }

  if (!valid) return;

  /* IA#2 — Check against stored users */
  const users = JSON.parse(localStorage.getItem("tn_users") || "[]");
  const user  = users.find(u => u.username === username && u.password === password);

  const alertEl = document.getElementById("login-alert");
  if (!user) {
    if (alertEl) { alertEl.textContent = "Invalid username or password."; alertEl.className = "alert alert-error show"; }
    return;
  }

  localStorage.setItem("tn_session", JSON.stringify({ username: user.username, name: user.name }));
  showToast(`Welcome back, ${user.name}!`);
  setTimeout(() => { window.location.href = "index.html"; }, 1000);
}

/* =============================================
   IA#2 — REGISTER PAGE
   ============================================= */

/**
 * handleRegister — validates and processes registration form
 * Creator: Karlyle Ambursley
 */
function handleRegister(e) {
  /* IA#2 — Event handler: form submit */
  e.preventDefault();
  let valid = true;

  const fields = {
    "reg-name":     document.getElementById("reg-name")?.value.trim(),
    "reg-dob":      document.getElementById("reg-dob")?.value,
    "reg-email":    document.getElementById("reg-email")?.value.trim(),
    "reg-username": document.getElementById("reg-username")?.value.trim(),
    "reg-password": document.getElementById("reg-password")?.value,
    "reg-confirm":  document.getElementById("reg-confirm")?.value
  };

  /* IA#2 — Clear all errors first */
  Object.keys(fields).forEach(id => clearError(id));

  /* IA#2 — Validate each field */
  if (!fields["reg-name"])     { showError("reg-name",     "Full name is required.");       valid = false; }
  if (!fields["reg-dob"])      { showError("reg-dob",      "Date of birth is required.");   valid = false; }
  if (!fields["reg-email"])    { showError("reg-email",    "Email is required.");            valid = false; }
  else if (!validateEmail(fields["reg-email"])) { showError("reg-email", "Enter a valid email address."); valid = false; }
  if (!fields["reg-username"]) { showError("reg-username", "Username is required.");         valid = false; }
  if (!fields["reg-password"]) { showError("reg-password", "Password is required.");         valid = false; }
  else if (!validatePassword(fields["reg-password"])) {
    showError("reg-password", "Min 8 characters, at least 1 number."); valid = false;
  }
  if (fields["reg-password"] !== fields["reg-confirm"]) {
    showError("reg-confirm", "Passwords do not match."); valid = false;
  }

  if (!valid) return;

  /* IA#2 — Check for duplicate username */
  const users = JSON.parse(localStorage.getItem("tn_users") || "[]");
  if (users.find(u => u.username === fields["reg-username"])) {
    showError("reg-username", "Username already taken."); return;
  }

  /* IA#2 — Save new user */
  users.push({
    name:     fields["reg-name"],
    dob:      fields["reg-dob"],
    email:    fields["reg-email"],
    username: fields["reg-username"],
    password: fields["reg-password"]
  });
  localStorage.setItem("tn_users", JSON.stringify(users));

  const alertEl = document.getElementById("reg-alert");
  if (alertEl) { alertEl.textContent = "Account created! Redirecting to login…"; alertEl.className = "alert alert-success show"; }
  setTimeout(() => { window.location.href = "login.html"; }, 1500);
}

/**
 * updateStrengthBar — visually shows password strength
 * @param {string} pw
 * Creator: Karlyle Ambursley
 */
function updateStrengthBar(pw) {
  /* IA#2 — DOM Manipulation: querySelector, style */
  const fill = document.getElementById("strength-fill");
  if (!fill) return;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw))    score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const colours = ["#e94560", "#f5a623", "#f5a623", "#4caf50"];
  const widths  = ["25%", "50%", "75%", "100%"];
  fill.style.width      = score > 0 ? widths[score - 1] : "0%";
  fill.style.background = score > 0 ? colours[score - 1] : "transparent";
}
