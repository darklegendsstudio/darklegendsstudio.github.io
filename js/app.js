import { getSitio } from "./services/sitio.js";
import { initRouter } from "./router.js";

function navTemplate(sitio) {
  return `<nav class="navbar" aria-label="Navegación principal">
    <a class="brand" href="#inicio"><img src="${sitio.marca.logo}" alt="${sitio.marca.nombre}"><span class="brand-name">${sitio.marca.nombre}</span></a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="nav-links">MENÚ</button>
    <div id="nav-links" class="nav-links">
      <a class="nav-link" data-section="inicio" href="#inicio">INICIO</a>
      <a class="nav-link" data-section="historias" href="#historias">HISTORIAS</a>
      <a class="nav-link" data-section="coleccionables" href="#coleccionables">COLECCIONABLES</a>
    </div>
  </nav>`;
}

function footerTemplate(sitio) {
  const socials = sitio.redes.filter((r) => r.url);
  return `<div class="footer-inner"><div class="footer-grid"><div class="footer-brand"><img src="${sitio.marca.logo}" alt=""><h3>${sitio.marca.nombre}</h3><p>${sitio.marca.lema_corto}</p></div><div><h3>NAVEGACIÓN</h3><div class="footer-links"><a href="#inicio">Inicio</a><a href="#historias">Historias</a><a href="#coleccionables">Coleccionables</a></div></div><div><h3>REDES</h3><div class="social-links">${socials.map(r=>`<a class="social-link" href="${r.url}" target="_blank" rel="noopener noreferrer" title="${r.nombre}" aria-label="${r.nombre}"><img src="${r.icono}" alt=""></a>`).join("") || '<span class="muted">Configura tus redes en sitio.json.</span>'}</div></div></div><div class="footer-bottom">© ${new Date().getFullYear()} ${sitio.marca.nombre}</div></div>`;
}

function setActiveSection(parts) {
  const section = parts[0] || "inicio";
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.section === section));
  document.querySelector(".nav-links")?.classList.remove("open");
  document.querySelector(".menu-button")?.setAttribute("aria-expanded", "false");
}

function setFavicon(imagePath) {
  if (!imagePath) return;

  let favicon = document.querySelector('link[rel~="icon"]');

  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }

  favicon.href = imagePath;

  if (imagePath.toLowerCase().split("?")[0].endsWith(".webp")) {
    favicon.type = "image/webp";
  } else {
    favicon.removeAttribute("type");
  }
}

async function main() {
  const sitio = await getSitio();
  document.title = sitio.marca.nombre;
  setFavicon(sitio.marca.logo);
  document.querySelector("#site-header").innerHTML = navTemplate(sitio);
  document.querySelector("#site-footer").innerHTML = footerTemplate(sitio);
  const menu = document.querySelector(".menu-button");
  menu?.addEventListener("click", () => {
    const links = document.querySelector(".nav-links");
    const open = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  initRouter({ onRoute: setActiveSection });
}

main().catch((error) => {
  console.error(error);
  document.querySelector("#app-content").innerHTML = `<div class="container section"><div class="error-state"><h2>No se pudo iniciar la web</h2><p>${error.message}</p></div></div>`;
});
