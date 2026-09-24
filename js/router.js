import { normalizeHash } from "./utils/rutas.js";
import { renderInicio } from "./views/inicio.js";
import { renderNoticias } from "./views/noticias.js";
import { renderNoticia } from "./views/noticia.js";
import { renderHistorias } from "./views/historias/historias.js";
import { renderHistoria } from "./views/historias/historia.js";
import { renderCapitulos } from "./views/historias/capitulos.js";
import { renderLector } from "./views/historias/lector.js";
import { renderPersonajes } from "./views/historias/personajes.js";
import { renderPersonaje } from "./views/historias/personaje.js";
import { renderUniverso } from "./views/historias/universo.js";
import { renderUniversoDetalle } from "./views/historias/universoDetalle.js";
import { renderColeccionables } from "./views/coleccionables/coleccionables.js";
import { renderColeccion } from "./views/coleccionables/coleccion.js";
import { renderPersonajeColeccion } from "./views/coleccionables/personaje.js";

export function initRouter({ onRoute }) {
  async function render() {
    const target = document.querySelector("#app-content");
    const [pathOnly] = normalizeHash().split("?");
    const parts = pathOnly.split("/").filter(Boolean);
    try {
      let html;
      if (parts[0] === "inicio") html = await renderInicio();
      else if (parts[0] === "noticias") html = await renderNoticias();
      else if (parts[0] === "noticia" && parts[1]) html = await renderNoticia(parts[1]);
      else if (parts[0] === "historias" && parts.length === 1) html = await renderHistorias();
      else if (parts[0] === "historias" && parts[1] && parts.length === 2) html = await renderHistoria(parts[1]);
      else if (parts[0] === "historias" && parts[2] === "capitulos") html = await renderCapitulos(parts[1], parts[3] || "");
      else if (parts[0] === "historias" && parts[2] === "personajes" && parts[3]) html = await renderPersonaje(parts[1], parts[3]);
      else if (parts[0] === "historias" && parts[2] === "personajes") html = await renderPersonajes(parts[1]);
      else if (parts[0] === "historias" && parts[2] === "universo" && parts[3]) html = await renderUniversoDetalle(parts[1], parts[3]);
      else if (parts[0] === "historias" && parts[2] === "universo") {
        const params = new URLSearchParams(normalizeHash().split("?")[1] || "");
        html = await renderUniverso(parts[1], params.get("tipo") || "todos");
      }
      else if (parts[0] === "historias" && parts[1] && parts[2] && parts[3]) html = await renderLector(parts[1], parts[2], parts[3]);
      else if (parts[0] === "coleccionables" && parts.length === 1) html = await renderColeccionables();
      else if (parts[0] === "coleccionables" && parts[1] && parts[2]) html = await renderPersonajeColeccion(parts[1], parts[2]);
      else if (parts[0] === "coleccionables" && parts[1]) html = await renderColeccion(parts[1]);
      else html = '<div class="container section"><div class="error-state"><h2>Ruta no encontrada</h2><p><a class="text-link" href="#inicio">Volver a Inicio</a></p></div></div>';
      target.innerHTML = html;
      target.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
      onRoute?.(parts);
    } catch (error) {
      console.error(error);
      target.innerHTML = `<div class="container section"><div class="error-state"><h2>No se pudo cargar esta sección</h2><p>${error.message}</p></div></div>`;
    }
  }
  window.addEventListener("hashchange", render);
  if (!window.location.hash) window.location.hash = "#inicio";
  else render();
}
