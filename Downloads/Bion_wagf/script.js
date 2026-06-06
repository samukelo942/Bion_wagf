/**
 * BIONWAGF CLOTHING STORE — script.js
 * Handles: Product loading, Cart (localStorage), Product detail,
 *          Navigation, Search, Filters, WhatsApp integration
 *
 * HOW TO CONNECT A BACKEND API:
 * Replace the fetch('./data/products.json') calls with your API URL.
 * Example: fetch('https://your-api.com/api/products')
 * The rest of the code will work as-is if your API returns the same JSON format.
 */

// =============================================
// CONFIGURATION
// =============================================
const CONFIG = {
  // ⚠️ IMPORTANT: Replace with your actual WhatsApp number
  // Format: country code + number, NO + sign, NO spaces
  // South Africa example: 27821234567
  WHATSAPP_NUMBER: '27000000000',

  // Storage key for cart data
  CART_KEY: 'bionwagf_cart',

  // Prices coming soon message
  PRICE_COMING_SOON: true, // Set to false when you have real prices

  /**
   * FUTURE API CONNECTION POINT
   * Replace this URL with your backend API endpoint
   * Example: 'https://your-backend.com/api/products'
   * Or use a CMS API like Shopify Storefront API, Contentful, Strapi etc.
   */
  PRODUCTS_API: './data/products.json',
};

const SAMPLE_PRODUCTS = [
  {
    "id": 1,
    "name": "SA Flag Hoodie",
    "category": "hoodies",
    "featured": true,
    "new": true,
    "inStock": true,
    "price": 799,
    "originalPrice": 999,
    "rating": 4.9,
    "reviews": 215,
    "badge": "NEW DROP",
    "description": "A premium hoodie celebrating South African heritage with bold prints and soft fleece lining.",
    "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80"
    ],
    "sizes": ["S","M","L","XL"],
    "colors": ["Black","Camel"],
    "specs": {
      "Material": "100% Cotton Fleece",
      "Fit": "Relaxed",
      "Origin": "Designed in South Africa"
    }
  },
  {
    "id": 2,
    "name": "Street Logo T-Shirt",
    "category": "t-shirts",
    "featured": true,
    "new": false,
    "inStock": true,
    "price": 299,
    "rating": 4.7,
    "reviews": 124,
    "badge": "BESTSELLER",
    "description": "Lightweight streetwear tee with our signature logo print and premium cotton feel.",
    "image": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80"
    ],
    "sizes": ["S","M","L","XL"],
    "colors": ["White","Black"],
    "specs": {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Care": "Machine wash cold"
    }
  },
  {
    "id": 3,
    "name": "Mavundla Crewneck",
    "category": "crewnecks",
    "featured": false,
    "new": true,
    "inStock": true,
    "price": 649,
    "rating": 4.8,
    "reviews": 98,
    "badge": "LIMITED",
    "description": "Soft crewneck with a clean silhouette, designed to go everywhere from street to studio.",
    "image": "https://images.unsplash.com/photo-1495121605193-b116b5b9c5d4?w=900&q=80",
    "images": [
      "https://images.unsplash.com/photo-1495121605193-b116b5b9c5d4?w=900&q=80"
    ],
    "sizes": ["S","M","L","XL"],
    "colors": ["Grey","Navy"],
    "specs": {
      "Material": "French Terry",
      "Fit": "Modern",
      "Details": "Ribbed cuffs and hem"
    }
  },
  {
    "id": 4,
    "name": "Track Pants",
    "category": "bottoms",
    "featured": true,
    "new": false,
    "inStock": true,
    "price": 499,
    "rating": 4.6,
    "reviews": 76,
    "badge": "ICONIC",
    "description": "Comfort-first track pants with tapered legs and matte finish for street-ready style.",
    "image": "https://images.unsplash.com/photo-1520975698513-bf93541eefab?w=900&q=80",
    "images": [
      "https://images.unsplash.com/photo-1520975698513-bf93541eefab?w=900&q=80"
    ],
    "sizes": ["S","M","L","XL"],
    "colors": ["Black","Olive"],
    "specs": {
      "Material": "Poly-cotton blend",
      "Fit": "Tapered",
      "Feature": "Elastic waist with drawcord"
    }
  },
  {
    "id": 5,
    "name": "Graphic Tee",
    "category": "t-shirts",
    "featured": false,
    "new": true,
    "inStock": true,
    "price": 329,
    "rating": 4.5,
    "reviews": 63,
    "badge": "SA PROUD",
    "description": "Bold graphic tee celebrating local street culture with a soft premium finish.",
    "image": "https://images.unsplash.com/photo-1520975698513-bf93541eefab?w=900&q=80",
    "images": [
      "https://images.unsplash.com/photo-1520975698513-bf93541eefab?w=900&q=80"
    ],
    "sizes": ["S","M","L","XL"],
    "colors": ["White","Black"],
    "specs": {
      "Material": "100% Cotton",
      "Fit": "Standard",
      "Print": "Water-based ink"
    }
  },
  {
    "id": 6,
    "name": "Camo Hoodie",
    "category": "hoodies",
    "featured": false,
    "new": false,
    "inStock": false,
    "price": 849,
    "rating": 4.7,
    "reviews": 89,
    "badge": "BESTSELLER",
    "description": "Army-inspired camo hoodie with soft brushed lining and street-smart detailing.",
    "image": "https://images.unsplash.com/photo-1520975698513-bf93541eefab?w=900&q=80",
    "images": [
      "https://images.unsplash.com/photo-1520975698513-bf93541eefab?w=900&q=80"
    ],
    "sizes": ["S","M","L","XL"],
    "colors": ["Camo"],
    "specs": {
      "Material": "Cotton blend",
      "Fit": "Relaxed",
      "Feature": "Kangaroo pocket"
    }
  },
  {
    "id": 7,
    "name": "SA Skate Shorts",
    "category": "bottoms",
    "featured": false,
    "new": true,
    "inStock": true,
    "price": 349,
    "rating": 4.4,
    "reviews": 37,
    "badge": "LIMITED",
    "description": "Lightweight skate shorts made for summer sessions and city style.",
    "image": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80",
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80"
    ],
    "sizes": ["S","M","L","XL"],
    "colors": ["Black","Khaki"],
    "specs": {
      "Material": "Lightweight cotton",
      "Fit": "Relaxed",
      "Feature": "Side pockets"
    }
  },
  {
    "id": 8,
    "name": "Classic Logo Sweat",
    "category": "crewnecks",
    "featured": false,
    "new": false,
    "inStock": true,
    "price": 579,
    "rating": 4.8,
    "reviews": 142,
    "badge": "ICONIC",
    "description": "A clean crewneck with premium embroidery and an everyday street-ready look.",
    "image": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80"
    ],
    "sizes": ["S","M","L","XL"],
    "colors": ["Grey","Black"],
    "specs": {
      "Material": "French Terry",
      "Fit": "Classic",
      "Details": "Embroidered logo"
    }
  }
];

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Format price in South African Rands
 * When prices are "coming soon", show a placeholder
 */
function formatPrice(price) {
  if (CONFIG.PRICE_COMING_SOON) {
    return '<span class="product-price coming-soon">Price Coming Soon</span>';
  }
  return `<span class="product-price">R${price.toLocaleString()}</span>`;
}

function formatPriceValue(price) {
  return CONFIG.PRICE_COMING_SOON ? 'TBA' : `R${price.toLocaleString()}`;
}

/** Generate star rating HTML */
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '★'.repeat(full);
  if (half) stars += '½';
  return stars;
}

/** Map badge label to CSS class */
function getBadgeClass(badge) {
  if (!badge) return '';
  const map = {
    'NEW DROP': 'badge-new',
    'BESTSELLER': 'badge-bestseller',
    'LIMITED': 'badge-limited',
    'ICONIC': 'badge-iconic',
    'SA PROUD': 'badge-sa',
  };
  return map[badge] || 'badge-new';
}

/** Show toast notification */
function showToast(msg, type = 'default') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, 3000);
}

/** Build a WhatsApp message URL */
function buildWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encoded}`;
}

// =============================================
// CART MANAGEMENT
// =============================================
/**
 * CART SYSTEM
 * - Cart data is saved to localStorage under the key defined in CONFIG.CART_KEY
 * - Each cart item stores: id, name, price, image, size, color, quantity
 * - The cart badge count updates across all pages
 *
 * FUTURE: When you add a backend, replace localStorage with API calls:
 * - GET /api/cart  → load cart
 * - POST /api/cart/add  → add item
 * - PATCH /api/cart/update  → update qty
 * - DELETE /api/cart/remove/:id  → remove item
 */

/** Load cart from localStorage */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.CART_KEY)) || [];
  } catch {
    return [];
  }
}

/** Save cart to localStorage */
function saveCart(cart) {
  localStorage.setItem(CONFIG.CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/** Add item to cart */
function addToCart(product, size = 'M', color = null, qty = 1) {
  const cart = loadCart();
  // Create a unique key per product+size+color combination
  const cartKey = `${product.id}-${size}-${color || 'default'}`;
  const existing = cart.find(i => i.cartKey === cartKey);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      cartKey,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size,
      color: color || (product.colors && product.colors[0]) || 'Default',
      quantity: qty,
    });
  }
  saveCart(cart);
  showToast(`✓ ${product.name} added to cart`, 'success');
}

/** Remove item from cart */
function removeFromCart(cartKey) {
  let cart = loadCart();
  cart = cart.filter(i => i.cartKey !== cartKey);
  saveCart(cart);
}

/** Update quantity */
function updateCartQty(cartKey, newQty) {
  const cart = loadCart();
  const item = cart.find(i => i.cartKey === cartKey);
  if (item) {
    if (newQty <= 0) {
      removeFromCart(cartKey);
      return;
    }
    item.quantity = newQty;
    saveCart(cart);
  }
}

/** Get cart total */
function getCartTotal() {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/** Get total item count */
function getCartCount() {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/** Update the cart badge on the navbar */
function updateCartBadge() {
  const badges = document.querySelectorAll('#cartCount');
  const count = getCartCount();
  badges.forEach(badge => {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  });
}

// =============================================
// PRODUCT CARD RENDERING
// =============================================
/**
 * Renders a single product card HTML
 * Used on homepage featured, new arrivals, products listing, and related products
 */
function renderProductCard(product) {
  const badgeHtml = product.badge
    ? `<span class="product-badge ${getBadgeClass(product.badge)}">${product.badge}</span>`
    : '';

  const priceHtml = CONFIG.PRICE_COMING_SOON
    ? `<span class="product-price coming-soon">Price Soon</span>`
    : `
      <div>
        <span class="product-price">R${product.price.toLocaleString()}</span>
        ${product.originalPrice ? `<span class="price-original">R${product.originalPrice.toLocaleString()}</span>` : ''}
      </div>
    `;

  return `
    <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
      <div class="product-img-wrap">
        ${badgeHtml}
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/400x500/f0ede8/333?text=BIONWAGF'"
        />
        <!-- Quick add overlay - shown on hover -->
        <div class="product-quick-add" onclick="event.stopPropagation()">
          <button
            class="quick-add-btn"
            onclick="quickAdd(${product.id})"
          >+ Add to Cart</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price-row">
          ${priceHtml}
          <button
            class="add-to-cart-btn"
            onclick="event.stopPropagation(); quickAdd(${product.id})"
            aria-label="Add to cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Global products cache — fetched once and reused
let allProducts = [];

/**
 * Fetch products from JSON (or future API)
 * FUTURE API POINT: Replace CONFIG.PRODUCTS_API with your backend URL
 * Example: await fetch('https://your-backend.com/api/products', {
 *   headers: { 'Authorization': `Bearer ${userToken}` }
 * })
 */
async function fetchProducts() {
  if (allProducts.length > 0) return allProducts;
  try {
    const res = await fetch(CONFIG.PRODUCTS_API);
    if (!res.ok) throw new Error('Failed to load products');
    allProducts = await res.json();
    return allProducts;
  } catch (err) {
    console.warn('Product fetch error:', err);
    allProducts = SAMPLE_PRODUCTS;
    return allProducts;
  }
}

/** Quick add to cart without opening product page */
async function quickAdd(productId) {
  const products = await fetchProducts();
  const product = products.find(p => p.id === productId);
  if (product) {
    addToCart(product, 'M');
  }
}

// =============================================
// HOMEPAGE
// =============================================
async function initHomepage() {
  const products = await fetchProducts();

  // Featured products
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    const featured = products.filter(p => p.featured).slice(0, 4);
    featuredGrid.innerHTML = featured.map(renderProductCard).join('');
    lucide.createIcons(); // re-init icons inside new HTML
  }

  // New Arrivals
  const newGrid = document.getElementById('newArrivalsGrid');
  if (newGrid) {
    const newArrivals = products.filter(p => p.new).slice(0, 4);
    // If not enough new, fill with featured
    const display = newArrivals.length >= 2 ? newArrivals : products.slice(4, 8);
    newGrid.innerHTML = display.map(renderProductCard).join('');
    lucide.createIcons();
  }
}

// =============================================
// PRODUCTS PAGE
// =============================================
async function initProductsPage() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productCount');
  const emptyState = document.getElementById('emptyState');

  const products = await fetchProducts();
  let filtered = [...products];

  // Read URL params for initial category/filter
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get('category');
  const urlFilter = params.get('filter');
  const urlSearch = params.get('search');
  const pageTitle = document.getElementById('pageTitle');
  const breadcrumbCat = document.getElementById('breadcrumbCat');

  if (urlSearch) {
    const searchInputEl = document.getElementById('searchInput');
    if (searchInputEl) searchInputEl.value = urlSearch;
  }

  // If a category is passed in URL, pre-select radio button
  if (urlCategory) {
    const radio = document.querySelector(`input[name="category"][value="${urlCategory}"]`);
    if (radio) radio.checked = true;
    if (pageTitle) pageTitle.textContent = urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);
    if (breadcrumbCat) breadcrumbCat.textContent = urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);
  }
  if (urlFilter === 'new') {
    const newCheck = document.getElementById('filterNew');
    if (newCheck) newCheck.checked = true;
  }

  function applyFilters() {
    const category = document.querySelector('input[name="category"]:checked')?.value || 'all';
    const sort = document.getElementById('sortSelect')?.value || 'default';
    const onlyNew = document.getElementById('filterNew')?.checked;
    const onlyInStock = document.getElementById('filterInStock')?.checked;
    const searchVal = document.getElementById('searchInput')?.value.toLowerCase().trim();

    filtered = products.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (onlyNew && !p.new) return false;
      if (onlyInStock && !p.inStock) return false;
      if (searchVal && !p.name.toLowerCase().includes(searchVal) && !p.category.toLowerCase().includes(searchVal)) return false;
      return true;
    });

    // Sort
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'new') filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));

    renderGrid();
  }

  function renderGrid() {
    if (!grid) return;
    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (countEl) countEl.textContent = '0 products';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      grid.innerHTML = filtered.map(renderProductCard).join('');
      if (countEl) countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
      lucide.createIcons();
    }
  }

  // Event listeners for filters
  document.querySelectorAll('input[name="category"]').forEach(r => r.addEventListener('change', applyFilters));
  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);
  document.getElementById('filterNew')?.addEventListener('change', applyFilters);
  document.getElementById('filterInStock')?.addEventListener('change', applyFilters);
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    const radios = document.querySelectorAll('input[name="category"]');
    if (radios[0]) radios[0].checked = true;
    const sort = document.getElementById('sortSelect');
    if (sort) sort.value = 'default';
    const newCheck = document.getElementById('filterNew');
    if (newCheck) newCheck.checked = false;
    const stockCheck = document.getElementById('filterInStock');
    if (stockCheck) stockCheck.checked = true;
    applyFilters();
  });

  // Mobile filter sidebar toggle
  const filterToggle = document.getElementById('filterToggle');
  const sidebar = document.getElementById('filtersSidebar');
  const overlay = document.getElementById('navOverlay');
  if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    });
  }

  // Initial render
  applyFilters();
}

// =============================================
// PRODUCT DETAIL PAGE
// =============================================
async function initProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  const container = document.getElementById('productDetail');
  if (!container) return;

  const products = await fetchProducts();
  const product = products.find(p => p.id === productId);

  if (!product) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1; text-align:center; padding:80px 0;">
        <h2>Product Not Found</h2>
        <p>This product may no longer be available.</p>
        <a href="products.html" class="btn btn-primary" style="margin-top:24px;">Back to Shop</a>
      </div>`;
    return;
  }

  // Update page title
  document.title = `${product.name} — BIONWAGF`;

  // Build WhatsApp message for this product
  const waMsg = `Hi BIONWAGF! 👋 I'm interested in the *${product.name}*. Can you please tell me the price and availability? Thank you!`;

  const badgeHtml = product.badge
    ? `<span class="product-badge pd-badge ${getBadgeClass(product.badge)}">${product.badge}</span>`
    : '';

  const priceHtml = CONFIG.PRICE_COMING_SOON
    ? `<div class="pd-price-coming">Prices Coming Soon 🔜</div>
       <p class="pd-price-note">Chat with us on WhatsApp to get the current price and place your order.</p>`
    : `<div class="pd-price">R${product.price.toLocaleString()}</div>
       ${product.originalPrice ? `<div class="pd-original">Was R${product.originalPrice.toLocaleString()}</div>` : ''}`;

  const sizesHtml = product.sizes
    ? product.sizes.map(s => `<button class="size-btn" data-size="${s}">${s}</button>`).join('')
    : '';

  const colorsHtml = product.colors
    ? product.colors.map(c => `<span class="color-tag" style="font-size:0.85rem;margin-right:8px;">${c}</span>`).join('')
    : '';

  const specsHtml = product.specs
    ? Object.entries(product.specs).map(([k, v]) =>
        `<div class="spec-row"><span class="spec-key">${k}</span><span class="spec-val">${v}</span></div>`
      ).join('')
    : '';

  const thumbsHtml = (product.images || [product.image])
    .map((img, i) => `
      <div class="pd-thumb ${i === 0 ? 'active' : ''}" onclick="switchImage('${img}', this)">
        <img src="${img}" alt="${product.name}" loading="lazy" />
      </div>
    `).join('');

  container.innerHTML = `
    <!-- Images Column -->
    <div class="pd-images">
      <div class="pd-main-img" id="mainImg">
        <img src="${product.image}" alt="${product.name}" id="mainImgEl" />
      </div>
      <div class="pd-thumbs">${thumbsHtml}</div>
    </div>

    <!-- Info Column -->
    <div class="pd-info">
      <p class="pd-breadcrumb"><a href="index.html">Home</a> / <a href="products.html">Shop</a> / ${product.name}</p>
      ${badgeHtml}
      <h1 class="pd-name">${product.name}</h1>
      <div class="pd-rating">
        <span class="stars">${renderStars(product.rating)}</span>
        <span class="rating-count">(${product.reviews} reviews)</span>
      </div>

      <div class="pd-price-block">${priceHtml}</div>

      <!-- WhatsApp Order Banner -->
      <div class="pd-wa-order">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25d366" width="22" height="22">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span>Want to order? <a href="${buildWhatsAppUrl(waMsg)}" target="_blank" rel="noopener">WhatsApp us</a> for price and availability.</span>
      </div>

      <!-- Sizes -->
      ${product.sizes ? `
        <div class="pd-option-label">Select Size</div>
        <div class="pd-sizes" id="pdSizes">${sizesHtml}</div>
      ` : ''}

      <!-- Colors -->
      ${product.colors && product.colors.length > 1 ? `
        <div class="pd-option-label">Color</div>
        <div class="pd-colors">${colorsHtml}</div>
      ` : ''}

      <!-- Actions -->
      <div class="pd-actions">
        <button class="btn btn-primary" onclick="handleAddToCart(${product.id})">Add to Cart</button>
        <a href="${buildWhatsAppUrl(waMsg)}" target="_blank" rel="noopener" class="btn btn-wa">
          WhatsApp Order
        </a>
      </div>

      <!-- Description -->
      <div class="pd-description">
        <p>${product.description}</p>
      </div>

      <!-- Specs -->
      <div class="pd-specs">
        <h4>Product Details</h4>
        ${specsHtml}
      </div>
    </div>
  `;

  // Size button selection
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Related products
  const relatedSection = document.getElementById('relatedSection');
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedSection && relatedGrid) {
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    if (related.length > 0) {
      relatedSection.style.display = 'block';
      relatedGrid.innerHTML = related.map(renderProductCard).join('');
    }
  }

  lucide.createIcons();
}

/** Switch main product image */
function switchImage(src, thumbEl) {
  const mainImg = document.getElementById('mainImgEl');
  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 150);
  }
  document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

/** Handle add to cart from product detail page */
async function handleAddToCart(productId) {
  const products = await fetchProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const activeSize = document.querySelector('.size-btn.active')?.dataset.size || 'M';
  addToCart(product, activeSize);
}

// =============================================
// CART PAGE
// =============================================
function initCartPage() {
  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  const emptyCart = document.getElementById('emptyCart');
  if (!cartItems) return;

  function renderCart() {
    const cart = loadCart();

    if (cart.length === 0) {
      cartItems.innerHTML = '';
      if (cartSummary) cartSummary.style.display = 'none';
      if (emptyCart) emptyCart.style.display = 'block';
      return;
    }

    if (cartSummary) cartSummary.style.display = 'block';
    if (emptyCart) emptyCart.style.display = 'none';

    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="ci-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="ci-details">
          <div class="ci-name">${item.name}</div>
          <div class="ci-meta">Size: ${item.size} · Color: ${item.color}</div>
          <div class="ci-qty">
            <button class="qty-btn" onclick="changeQty('${item.cartKey}', ${item.quantity - 1})">−</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQty('${item.cartKey}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <div class="ci-right">
          <div class="ci-price">${CONFIG.PRICE_COMING_SOON ? 'TBA' : `R${(item.price * item.quantity).toLocaleString()}`}</div>
          <button class="ci-remove" onclick="removeItem('${item.cartKey}')" aria-label="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    // Update summary
    const subtotal = getCartTotal();
    const subtotalEl = document.getElementById('summarySubtotal');
    const totalEl = document.getElementById('summaryTotal');
    const shippingEl = document.getElementById('summaryShipping');

    if (subtotalEl) subtotalEl.textContent = CONFIG.PRICE_COMING_SOON ? 'TBA' : `R${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = CONFIG.PRICE_COMING_SOON ? 'TBA' : `R${subtotal.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = subtotal >= 800 ? 'FREE 🎉' : 'Calculated at checkout';

    // Build WhatsApp order button
    const waOrderBtn = document.getElementById('waOrderBtn');
    if (waOrderBtn) {
      const itemsList = cart.map(i => `• ${i.name} (Size: ${i.size}, Qty: ${i.quantity})`).join('\n');
      const msg = `Hi BIONWAGF! 👋 I'd like to place an order:\n\n${itemsList}\n\nPlease confirm availability and total price. Thank you!`;
      waOrderBtn.href = buildWhatsAppUrl(msg);
    }
  }

  // Expose to onclick handlers
  window.changeQty = function(cartKey, newQty) {
    updateCartQty(cartKey, newQty);
    renderCart();
  };
  window.removeItem = function(cartKey) {
    removeFromCart(cartKey);
    renderCart();
    showToast('Item removed from cart');
  };

  renderCart();
}

// =============================================
// CHECKOUT PAGE
// =============================================
function initCheckoutPage() {
  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const checkoutWaBtn = document.getElementById('checkoutWaBtn');

  const cart = loadCart();

  if (checkoutItems) {
    if (cart.length === 0) {
      checkoutItems.innerHTML = '<p style="color:var(--text-secondary);font-size:0.9rem;">Your cart is empty. <a href="products.html" style="color:var(--accent);">Shop now</a></p>';
    } else {
      checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item-row">
          <span>${item.name} (${item.size}) × ${item.quantity}</span>
          <span>${CONFIG.PRICE_COMING_SOON ? 'TBA' : `R${(item.price * item.quantity).toLocaleString()}`}</span>
        </div>
      `).join('');
    }
  }

  if (checkoutTotal) {
    checkoutTotal.textContent = CONFIG.PRICE_COMING_SOON ? 'TBA (prices coming soon)' : `R${getCartTotal().toLocaleString()}`;
  }

  // Build dynamic WhatsApp order URL with cart contents
  if (checkoutWaBtn && cart.length > 0) {
    const itemsList = cart.map(i => `• ${i.name} (Size: ${i.size}, Qty: ${i.quantity})`).join('\n');
    const msg = `Hi BIONWAGF! 👋 I'd like to complete my order:\n\n${itemsList}\n\nCan you confirm availability and pricing? Thank you!`;
    checkoutWaBtn.href = buildWhatsAppUrl(msg);
  }
}

// =============================================
// NAVIGATION
// =============================================
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navClose = document.getElementById('navClose');
  const navOverlay = document.getElementById('navOverlay');
  const navbar = document.getElementById('navbar');
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.add('open');
    navOverlay?.classList.add('show');
    hamburger.classList.add('active');
  });

  const closeNav = () => {
    navLinks?.classList.remove('open');
    navOverlay?.classList.remove('show');
    hamburger?.classList.remove('active');
    // Don't close filter sidebar here
  };

  navClose?.addEventListener('click', closeNav);
  navOverlay?.addEventListener('click', () => {
    closeNav();
    // Also close filter sidebar if open
    document.getElementById('filtersSidebar')?.classList.remove('open');
  });

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Search toggle
  searchToggle?.addEventListener('click', () => {
    searchBar?.classList.toggle('active');
    if (searchBar?.classList.contains('active')) {
      searchInput?.focus();
    }
  });

  // Search submit — redirect to products page with search
  const searchSubmit = document.getElementById('searchSubmit');
  const doSearch = () => {
    const q = searchInput?.value.trim();
    if (q) window.location.href = `products.html?search=${encodeURIComponent(q)}`;
  };
  searchSubmit?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });

  // Update cart badge
  updateCartBadge();
}

// =============================================
// NEWSLETTER FORM
// =============================================
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    showToast(`✓ ${email} subscribed! You'll be first to know about drops.`, 'success');
    form.reset();
    /**
     * FUTURE API POINT:
     * await fetch('https://your-backend.com/api/newsletter', {
     *   method: 'POST',
     *   body: JSON.stringify({ email }),
     *   headers: { 'Content-Type': 'application/json' }
     * })
     * Or connect to Mailchimp, ConvertKit, Klaviyo etc.
     */
  });
}

// =============================================
// FOOTER WHATSAPP LINK
// =============================================
function initFooterLinks() {
  const footerWa = document.getElementById('footerWhatsapp');
  if (footerWa) {
    footerWa.href = buildWhatsAppUrl('Hi BIONWAGF! 👋 I have a question about pricing and availability.');
    footerWa.target = '_blank';
  }
}

// =============================================
// PAGE ROUTER — Detect which page we're on
// =============================================
function detectPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';

  if (filename === 'index.html' || filename === '' || filename === '/') return 'home';
  if (filename === 'products.html') return 'products';
  if (filename === 'product.html') return 'product';
  if (filename === 'cart.html') return 'cart';
  if (filename === 'checkout.html') return 'checkout';
  return 'unknown';
}

// =============================================
// INIT — Run on DOM ready
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
  // Always init navbar and newsletter
  initNavbar();
  initNewsletter();
  initFooterLinks();

  // Initialise Lucide icons
  lucide.createIcons();

  // Route to the correct page initialiser
  const page = detectPage();
  switch(page) {
    case 'home':     await initHomepage();       break;
    case 'products': await initProductsPage();   break;
    case 'product':  await initProductDetail();  break;
    case 'cart':     initCartPage();             break;
    case 'checkout': initCheckoutPage();         break;
  }

  // Re-init icons after dynamic content loads
  lucide.createIcons();
});

// Expose functions needed by inline onclick handlers
window.quickAdd = async function(productId) {
  const products = await fetchProducts();
  const product = products.find(p => p.id === productId);
  if (product) addToCart(product, 'M');
};
window.switchImage = switchImage;
window.handleAddToCart = handleAddToCart;