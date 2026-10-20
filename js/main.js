/* Catálogo ficticio, tarjetas de producto y formulario. Requiere components.js (waLink). */
const PRODUCTS = {
  camisetas: [
    { name: "Camiseta Dry Fit Pro", price: 59 },
    { name: "Camiseta Training Lite", price: 49 },
    { name: "Camiseta Run Aire", price: 55 }
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
  ]
};

function productCard(p, colClass) {
  const msg = `Hola, quiero consultar por el producto: ${p.name} (S/ ${p.price}).`;
  return `<div class="${colClass}"><article class="card-ro">
    <div class="ph ph-product" role="img" aria-label="Espacio reservado para la foto de ${p.name}"><span>Imagen de producto</span></div>
    <div class="body"><h3>${p.name}</h3><div class="price">S/ ${p.price.toFixed(2)}</div>
    <a class="btn btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp: ${p.name}">Consultar por WhatsApp</a></div>
  </article></div>`;
}

function renderProducts() {
  const featured = document.getElementById("featuredProducts");
  if (featured) { // 2 productos por categoría = 8 destacados
    featured.innerHTML = Object.values(PRODUCTS).flatMap(list => list.slice(0, 2))
      .map(p => productCard(p, "col-6 col-md-6 col-lg-3")).join("");
  }
  const list = document.getElementById("categoryProducts");
  if (list) {
    list.innerHTML = PRODUCTS[list.dataset.category].map(p => productCard(p, "col-12 col-sm-6 col-lg-4")).join("");
  }
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
  setupContactForm();
  document.querySelectorAll("[data-wa]").forEach(a => { a.href = waLink(a.dataset.wa); });
});
