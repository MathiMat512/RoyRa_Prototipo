/* Catálogo ficticio, tarjetas de producto y formulario. Requiere components.js (waLink). */
const PRODUCTS = {
  camisetas: [
    { name: "Camiseta Dry Fit Pro", slug: "dry-fit-pro", price: 59, description: "Camiseta ligera de secado rápido, pensada para entrenamientos intensos y carreras." },
    { name: "Camiseta Training Lite", slug: "training-lite", price: 49, description: "Prenda suave y transpirable para acompañarte en tus sesiones de entrenamiento." },
    { name: "Camiseta Run Aire", slug: "run-aire", price: 55, description: "Diseño ventilado y cómodo para correr con libertad en cualquier rutina." }
  ],
  shorts: [
    { name: "Short Runner 2 en 1", price: 69 },
    { name: "Short Training Flex", price: 59 },
    { name: "Short Trail Ligero", price: 65 }
  ],
  medias: [
    { name: "Medias Pro Compresión", price: 29 },
    { name: "Medias Running Cortas", price: 19 },
    { name: "Medias Deportivas Largas", price: 25 }
  ],
  chalecos: [
    { name: "Chaleco Térmico Ligero", price: 99 },
    { name: "Chaleco Cortaviento", price: 109 },
    { name: "Chaleco Reflectivo Run", price: 89 }
  ],
  kids: [
    { name: "Camiseta KID", slug: "camiseta-kid", price: 35, description: "Camiseta infantil ligera y transpirable, diseñada para que los niños se muevan con total libertad durante el entrenamiento o la actividad física." },
    { name: "Short KID", price: 29 },
    { name: "Medias KID", price: 15 }
  ]
};

function productCard(p, colClass, detailsEnabled = false) {
  const cardContent = `<div class="ph ph-product" role="img" aria-label="Espacio reservado para la foto de ${p.name}"><span>Imagen de producto</span></div>
    <div class="product-card-info"><h3>${p.name}</h3><div class="price">S/ ${p.price.toFixed(2)}</div>${detailsEnabled ? '<span class="product-details-label">Ver características</span>' : ""}</div>`;
  return `<div class="${colClass}"><article class="card-ro">
    ${detailsEnabled ? `<a class="product-card-link" href="producto-camiseta.html?product=${encodeURIComponent(p.slug)}" aria-label="Ver detalles de ${p.name}">${cardContent}</a>` : cardContent}
    <div class="body"><button class="btn btn-brand" type="button" data-add-to-cart data-product-name="${p.name}" data-product-price="${p.price}">Agregar al carrito</button></div>
  </article></div>`;
}

const CART_STORAGE_KEY = "rora-cart";
const PRODUCT_SIZES = ["16", "S", "M", "L", "XL", "XXL", "XXXL"];

function getCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(savedCart)) return [];
    return savedCart.filter(item =>
      item && typeof item.name === "string" && Number.isFinite(item.price) &&
      Number.isInteger(item.quantity) && item.quantity > 0).map(item => ({
        ...item,
        attributes: item.attributes && typeof item.attributes === "object" ? item.attributes : {}
      }));
  } catch (error) {
    console.error("No se pudo leer el carrito guardado.", error);
    return [];
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function renderCart() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const countElement = document.getElementById("cartCount");
  const menu = document.getElementById("cartMenu");
  if (!countElement || !menu) return;

  countElement.textContent = count;
  countElement.setAttribute("aria-label", `${count} productos en el carrito`);
  if (cart.length === 0) {
    menu.innerHTML = `<p class="cart-empty mb-0">Tu carrito está vacío.</p>`;
    return;
  }

  const items = cart.map(item => `<li class="cart-item">
    <span>${escapeHtml(item.name)} <span class="text-secondary">× ${item.quantity}</span>
      ${Object.entries(item.attributes).map(([label, value]) => `<small class="cart-item-detail">${escapeHtml(label)}: ${escapeHtml(String(value))}</small>`).join("")}</span>
    <strong>S/ ${(item.price * item.quantity).toFixed(2)}</strong>
  </li>`).join("");
  const message = `Hola, quiero realizar este pedido:\n${cart.map(item =>
    `• ${item.name}${Object.entries(item.attributes).map(([label, value]) => `, ${label}: ${value}`).join("")} x${item.quantity} — S/ ${(item.price * item.quantity).toFixed(2)}`
  ).join("\n")}\nTotal: S/ ${total.toFixed(2)}`;
  menu.innerHTML = `<ul class="cart-items list-unstyled mb-2">${items}</ul>
    <div class="cart-total"><span>Total</span><strong>S/ ${total.toFixed(2)}</strong></div>
    <a class="btn btn-wa w-100 mt-3" href="${waLink(message)}" target="_blank" rel="noopener">Finalizar por WhatsApp</a>
    <button class="btn btn-link btn-sm cart-clear w-100 mt-1" type="button" data-clear-cart>Vaciar carrito</button>`;
}

function addToCart(name, price, attributes = {}, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item =>
    item.name === name && item.price === price &&
    JSON.stringify(item.attributes) === JSON.stringify(attributes));
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity, attributes });
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderCart();
}

function renderProducts() {
  const featured = document.getElementById("featuredProducts");
  if (featured) { // 2 productos por categoría = 8 destacados
    featured.innerHTML = Object.entries(PRODUCTS)
      .filter(([cat]) => cat !== "kids")
      .flatMap(([, list]) => list.slice(0, 2))
      .map(p => productCard(p, "col-6 col-md-6 col-lg-3")).join("");
  }
  const list = document.getElementById("categoryProducts");
  if (list) {
    const cat = list.dataset.category;
    list.innerHTML = PRODUCTS[cat].map(p => {
      const isKidsCamiseta = cat === "kids" && p.slug === "camiseta-kid";
      const enableLink = cat === "camisetas" || isKidsCamiseta;
      const detailPage = isKidsCamiseta ? `producto-camiseta-kid.html?product=${encodeURIComponent(p.slug)}` : `producto-camiseta.html?product=${encodeURIComponent(p.slug)}`;
      if (enableLink && p.slug) {
        const cardContent = `<div class="ph ph-product" role="img" aria-label="Espacio reservado para la foto de ${p.name}"><span>Imagen de producto</span></div>
    <div class="product-card-info"><h3>${p.name}</h3><div class="price">S/ ${p.price.toFixed(2)}</div><span class="product-details-label">Ver características</span></div>`;
        return `<div class="col-12 col-sm-6 col-lg-4"><article class="card-ro">
    <a class="product-card-link" href="${detailPage}" aria-label="Ver detalles de ${p.name}">${cardContent}</a>
    <div class="body"><button class="btn btn-brand" type="button" data-add-to-cart data-product-name="${p.name}" data-product-price="${p.price}">Agregar al carrito</button></div>
  </article></div>`;
      }
      return productCard(p, "col-12 col-sm-6 col-lg-4");
    }).join("");
  }
}

function renderProductDetail() {
  const container = document.getElementById("productDetail");
  if (!container) return;

  const product = PRODUCTS.camisetas.find(item =>
    item.slug === new URLSearchParams(window.location.search).get("product"));
  if (!product) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-warning" role="alert">
      No encontramos esa camiseta. <a href="camisetas.html">Volver al catálogo</a>.
    </div></div>`;
    return;
  }

  document.title = `${product.name} | RO&RA`;
  container.innerHTML = `<div class="col-lg-5">
    <form class="product-options" id="productOptionsForm">
      <h1 class="section-title">Personaliza tu camiseta</h1>
      <div class="mb-3"><label class="form-label fw-semibold" for="neckType">Tipo de cuello</label>
        <select class="form-select" id="neckType" name="neckType" required>
          <option value="" selected disabled>Selecciona el cuello</option><option>Cuello camisero</option><option>Cuello V</option>
        </select></div>
      <div class="mb-3"><label class="form-label fw-semibold" for="sleeveType">Tipo de manga</label>
        <select class="form-select" id="sleeveType" name="sleeveType" required>
          <option value="" selected disabled>Selecciona la manga</option><option>Manga cero</option><option>Manga normal</option><option>Manga larga</option>
        </select></div>
      <div class="mb-3"><label class="form-label fw-semibold" for="size">Talla</label>
        <select class="form-select" id="size" name="size" required>
          <option value="" selected disabled>Selecciona la talla</option>${PRODUCT_SIZES.map(size => `<option>${size}</option>`).join("")}
        </select></div>
      <div class="mb-4"><label class="form-label fw-semibold" for="quantity">Cantidad</label>
        <input class="form-control" id="quantity" name="quantity" type="number" min="1" step="1" value="1" required></div>
      <button class="btn btn-brand w-100" type="submit">Agregar al carrito</button>
      <div id="productStatus" class="mt-3" role="status" aria-live="polite"></div>
    </form>
  </div>
  <div class="col-lg-7"><article class="product-detail-card">
    <div class="ph ph-product product-detail-image" role="img" aria-label="Imagen ficticia de ${product.name}"><span>Imagen de producto</span></div>
    <div class="product-detail-copy"><p class="text-uppercase fw-semibold text-secondary mb-1">Colección de camisetas</p>
      <h2>${product.name}</h2><p>${product.description}</p><p class="price mb-3">S/ ${product.price.toFixed(2)}</p>
      <h3 class="h5">Características</h3>
      <ul class="mb-0"><li>Tela deportiva de secado rápido</li><li>Material ligero y transpirable</li><li>Costuras suaves para mayor comodidad</li><li>Diseño ficticio RO&RA para uso deportivo</li></ul>
    </div>
  </article></div>`;

  document.getElementById("productOptionsForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById("productStatus");
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const quantity = Number(formData.get("quantity"));
    const attributes = {
      "Tipo de cuello": formData.get("neckType"),
      "Tipo de manga": formData.get("sleeveType"),
      "Talla": formData.get("size")
    };
    addToCart(product.name, product.price, attributes, quantity);
    status.className = "alert alert-success mt-3";
    status.textContent = "La camiseta se agregó al carrito.";
  });
}

const KID_SIZES = ["4", "6", "8", "10", "12", "14"];

function renderKidProductDetail() {
  const container = document.getElementById("productDetailKid");
  if (!container) return;

  const product = PRODUCTS.kids.find(item =>
    item.slug === new URLSearchParams(window.location.search).get("product"));
  if (!product) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-warning" role="alert">
      No encontramos ese producto. <a href="kids.html">Volver a Kids</a>.
    </div></div>`;
    return;
  }

  document.title = `${product.name} | RO&RA Kids`;
  container.innerHTML = `<div class="col-lg-5">
    <form class="product-options" id="kidProductOptionsForm">
      <h1 class="section-title">Personaliza tu camiseta</h1>
      <div class="mb-3"><label class="form-label fw-semibold" for="kidNeckType">Tipo de cuello</label>
        <select class="form-select" id="kidNeckType" name="neckType" required>
          <option value="" selected disabled>Selecciona el cuello</option><option>Cuello tipo V</option>
        </select></div>
      <div class="mb-3"><label class="form-label fw-semibold" for="kidSize">Talla</label>
        <select class="form-select" id="kidSize" name="size" required>
          <option value="" selected disabled>Selecciona la talla</option>${KID_SIZES.map(s => `<option>${s}</option>`).join("")}
        </select></div>
      <div class="mb-4"><label class="form-label fw-semibold" for="kidQuantity">Cantidad</label>
        <input class="form-control" id="kidQuantity" name="quantity" type="number" min="1" step="1" value="1" required></div>
      <button class="btn btn-brand w-100" type="submit">Agregar al carrito</button>
      <div id="kidProductStatus" class="mt-3" role="status" aria-live="polite"></div>
    </form>
  </div>
  <div class="col-lg-7"><article class="product-detail-card">
    <div class="ph ph-product product-detail-image" role="img" aria-label="Imagen ficticia de ${product.name}"><span>Imagen de producto</span></div>
    <div class="product-detail-copy"><p class="text-uppercase fw-semibold text-secondary mb-1">Colección de camisetas</p>
      <h2>${product.name}</h2><p>${product.description}</p><p class="price mb-3">S/ ${product.price.toFixed(2)}</p>
      <h3 class="h5">Características</h3>
      <ul class="mb-0">
        <li>Tela suave y transpirable apta para niños activos</li>
        <li>Cuello tipo V cómodo y sin rozaduras</li>
        <li>Secado rápido para máximo rendimiento infantil</li>
        <li>Tallas disponibles: 4, 6, 8, 10, 12 y 14</li>
        <li>Diseño exclusivo RO&RA Kids</li>
      </ul>
    </div>
  </article></div>`;

  document.getElementById("kidProductOptionsForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById("kidProductStatus");
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const quantity = Number(formData.get("quantity"));
    const attributes = {
      "Tipo de cuello": formData.get("neckType"),
      "Talla": formData.get("size")
    };
    addToCart(product.name, product.price, attributes, quantity);
    status.className = "alert alert-success mt-3";
    status.textContent = "La Camiseta KID se agregó al carrito.";
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  form.addEventListener("submit", e => {
    e.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      status.className = "alert alert-danger mt-3";
      status.textContent = "Revisa los campos marcados: todos son obligatorios.";
      return;
    }
    status.className = "alert alert-info mt-3";
    status.textContent = "Los datos son válidos, pero este prototipo no tiene servidor y no envió nada. Para recibir mensajes se necesita integrar un servicio de envío. Mientras tanto, escríbenos por WhatsApp.";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderProductDetail();
  renderKidProductDetail();
  renderCart();
  document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      addToCart(addButton.dataset.productName, Number(addButton.dataset.productPrice));
      addButton.textContent = "Agregado al carrito";
      window.setTimeout(() => { addButton.textContent = "Agregar al carrito"; }, 1200);
    }
    if (event.target.closest("[data-clear-cart]")) {
      localStorage.removeItem(CART_STORAGE_KEY);
      renderCart();
    }
  });
  setupContactForm();
  document.querySelectorAll("[data-wa]").forEach(a => { a.href = waLink(a.dataset.wa); });
});
