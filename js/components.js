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
    { key: "quienes-somos", href: "quienes-somos.html", label: "Quiénes somos" },
    { key: "contacto", href: "contacto.html", label: "Contacto" }
  ]
};

function waLink(message) {
  return "https://wa.me/" + SITE.whatsappNumber + "?text=" + encodeURIComponent(message);
}

function renderHeader(current) {
  const items = SITE.pages.map(p =>
    `<li class="nav-item"><a class="nav-link${p.key === current ? " active" : ""}" href="${p.href}"${p.key === current ? ' aria-current="page"' : ""}>${p.label}</a></li>`).join("");
  return `<header class="site-header"><nav class="navbar navbar-expand-lg" aria-label="Navegación principal"><div class="container">
    <a class="navbar-brand" href="index.html">RO&RA</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu" aria-controls="mainMenu" aria-expanded="false" aria-label="Abrir menú"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="mainMenu"><ul class="navbar-nav ms-auto">${items}</ul></div>
  </div></nav></header>`;
}

function renderFooter() {
  const links = SITE.pages.map(p => `<li><a href="${p.href}">${p.label}</a></li>`).join("");
  return `<footer class="site-footer"><div class="container"><div class="row g-4">
    <div class="col-md-5"><div class="footer-brand">RO&RA</div>
      <p class="mt-2">Ropa deportiva pensada para moverte con comodidad, calidad y estilo.</p></div>
    <div class="col-6 col-md-3"><h2>Explora</h2><ul class="list-unstyled">${links}</ul></div>
    <div class="col-6 col-md-4"><h2>Escríbenos</h2>
      <a class="btn btn-wa" href="${waLink("Hola, quiero más información sobre RO&RA.")}" target="_blank" rel="noopener">WhatsApp</a></div>
  </div><div class="footer-bottom">&copy; <span id="footerYear"></span> RO&RA. Todos los derechos reservados.</div></div></footer>`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("site-header").innerHTML = renderHeader(document.body.dataset.page);
  document.getElementById("site-footer").innerHTML = renderFooter();
  document.getElementById("footerYear").textContent = new Date().getFullYear();
});
