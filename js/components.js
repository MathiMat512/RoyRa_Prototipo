/* Componentes reutilizables: header y footer.
   Viven en un archivo independiente; no se usa fetch() porque falla al abrir el sitio con file://. */
const SITE = {
  whatsappNumber: "51999999999", // NÚMERO DE EJEMPLO: reemplazar por el real (código de país + número, sin + ni espacios)
  pages: [
    { key: "inicio", href: "index.html", label: "Inicio" },
    { key: "camisetas", href: "camisetas.html", label: "Camisetas" },
    { key: "shorts", href: "shorts.html", label: "Shorts" },
    { key: "medias", href: "medias.html", label: "Medias" },
    { key: "chalecos", href: "chalecos.html", label: "Chalecos" },
    { key: "kids", href: "kids.html", label: "Kids", isKids: true },
    { key: "quienes-somos", href: "quienes-somos.html", label: "Quiénes somos" },
    { key: "contacto", href: "contacto.html", label: "Contacto" }
  ]
};

function waLink(message) {
  return "https://wa.me/" + SITE.whatsappNumber + "?text=" + encodeURIComponent(message);
}

function renderHeader(current) {
  const items = SITE.pages.map(p => {
    const isActive = p.key === current;
    const kidsClass = p.isKids ? " nav-link-kids" : "";
    return `<li class="nav-item"><a class="nav-link${isActive ? " active" : ""}${kidsClass}" href="${p.href}"${isActive ? ' aria-current="page"' : ""}>${p.isKids ? `<span class="kids-nav-label">${p.label}</span>` : p.label}</a></li>`;
  }).join("");
  return `<header class="site-header"><nav class="navbar navbar-expand-lg" aria-label="Navegación principal"><div class="container">
    <a class="navbar-brand" href="index.html" aria-label="RO&RA, inicio"><img src="assets/images/icono-royra.png" alt="RO&RA"></a>
    <div class="collapse navbar-collapse" id="mainMenu"><ul class="navbar-nav ms-auto">${items}</ul></div>
    <div class="header-actions">
      <div class="dropdown">
        <button class="btn cart-button" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Abrir carrito">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>
          <span class="cart-count" id="cartCount" aria-live="polite">0</span>
        </button>
        <div class="dropdown-menu dropdown-menu-end cart-menu" id="cartMenu" aria-label="Contenido del carrito"></div>
      </div>
      <button class="btn btn-login" type="button" data-bs-toggle="modal" data-bs-target="#loginModal">Ingresar</button>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu" aria-controls="mainMenu" aria-expanded="false" aria-label="Abrir menú"><span class="navbar-toggler-icon"></span></button>
    </div>
  </div></nav></header>`;
}

function renderLoginModal() {
  return `<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered"><div class="modal-content">
      <div class="modal-header"><h2 class="modal-title fs-5" id="loginModalLabel">Ingresar</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button></div>
      <div class="modal-body"><p class="mb-0">El acceso de clientes estará disponible próximamente.</p></div>
    </div></div>
  </div>`;
}

function renderFooter() {
  const links = SITE.pages.map(p => `<li><a href="${p.href}">${p.label}</a></li>`).join("");
  return `<footer class="site-footer"><div class="container"><div class="row g-4">
    <div class="col-md-5"><div class="footer-brand">RO&RA</div>
      <p class="mt-2">Ropa deportiva pensada para moverte con comodidad, calidad y estilo.</p></div>
    <div class="col-6 col-md-3"><h2>Explora</h2><ul class="list-unstyled">${links}</ul></div>
    <div class="col-6 col-md-4"><h2>Escríbenos</h2>
      <a class="btn btn-wa" href="${waLink("Hola, quiero más información sobre RO&RA.")}" target="_blank" rel="noopener">WhatsApp</a>
      <div class="payment-methods mt-3"><h3>Métodos de pagos aceptados:</h3><p class="mb-0">Yape, Plin</p></div></div>
  </div><div class="footer-bottom">&copy; <span id="footerYear"></span> RO&RA. Todos los derechos reservados.</div></div></footer>`;
}

function renderFloatingWhatsApp() {
  return `<a class="whatsapp-float" href="${waLink("Hola, quiero más información sobre RO&RA.")}" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
    <img src="assets/images/icono-whatsapp.png" alt="">
  </a>`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("site-header").innerHTML = renderHeader(document.body.dataset.page);
  document.getElementById("site-footer").innerHTML = renderFooter();
  document.getElementById("footerYear").textContent = new Date().getFullYear();
  document.body.insertAdjacentHTML("beforeend", renderLoginModal() + renderFloatingWhatsApp());
});
