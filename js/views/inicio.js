import { getInicio } from "../services/inicio.js";
import { getNoticiasRecientes } from "../services/noticias.js";
import { getProximosEventos } from "../services/eventos.js";
import { getHistorias } from "../services/historias.js";
import { getColeccionables } from "../services/coleccionables.js";
import { getSitio } from "../services/sitio.js";
import { formatDateEs, formatAgendaDate } from "../utils/fechas.js";
import { formatRichText, stripFormatting } from "../utils/texto.js";

function newsCard(item, compact = false) {
  return `<article class="card">
    <a href="#noticia/${item.id}" aria-label="Leer ${item.titulo}">
      <div class="card-media"><img src="${item.imagen}" alt=""></div>
      <div class="card-body">
        <span class="badge">${item.tipo || "Actualidad"}</span>
        <h3>${item.titulo}</h3>
        <div class="meta"><span>${formatDateEs(item.fecha)}</span></div>
        ${compact ? "" : `<p>${stripFormatting(item.contenido).slice(0, 150)}${stripFormatting(item.contenido).length > 150 ? "…" : ""}</p>`}
      </div>
    </a>
  </article>`;
}

export async function renderInicio() {
  const [inicio, noticias, eventos, historias, catalogo, sitio] = await Promise.all([
    getInicio(), getNoticiasRecientes(), getProximosEventos(5), getHistorias(), getColeccionables(), getSitio()
  ]);

  const hero = inicio.hero;
  const availableNews = noticias.filter((n) => n.id !== hero.referencia);
  const principalNews = availableNews.find((n) => n.principal === true) || null;
  const secondaryNews = availableNews
    .filter((n) => n.id !== principalNews?.id)
    .slice(0, principalNews ? 2 : 3);
  const storyCards = inicio.historias_destacadas.map((id) => historias.find((h) => h.id === id)).filter(Boolean);
  const collectionCards = catalogo.colecciones;

  const actualidad = principalNews || secondaryNews.length
    ? `${principalNews ? newsCard(principalNews) : ""}
       <div class="news-grid">${secondaryNews.map((n) => newsCard(n, true)).join("")}</div>`
    : '<div class="empty-state">Sin noticias recientes.</div>';

  return `
  <section class="hero">
    <div class="hero-media"><img src="${hero.imagen}" alt=""></div>
    <div class="container hero-content">
      <span class="eyebrow">${hero.etiqueta}</span>
      <h1>${hero.titulo}</h1>
      <div>${formatRichText(hero.texto)}</div>
      <div class="hero-actions"><a class="btn" href="${hero.enlace}">${hero.texto_boton}</a></div>
    </div>
  </section>

  <section class="section">
    <div class="container split">
      <div>
        <div class="section-heading"><h2 class="section-title">ACTUALIDAD</h2><a class="text-link" href="#noticias">VER TODAS →</a></div>
        ${actualidad}
      </div>
      <aside>
        <div class="section-heading"><h2 class="section-title">PRÓXIMAMENTE</h2></div>
        <div class="timeline">${eventos.map((event) => {
          const d = formatAgendaDate(event.fecha);
          return `<article class="timeline-item">
            <div class="timeline-date">${d.day} ${d.month}</div>
            <span class="badge violet">${event.tipo}</span>
            <h3>${event.titulo}</h3>
            ${event.descripcion ? `<p>${event.descripcion}</p>` : ""}
            ${event.enlace ? `<a class="text-link" href="${event.enlace}">VER →</a>` : ""}
          </article>`;
        }).join("") || '<div class="empty-state">No hay eventos próximos publicados.</div>'}</div>
      </aside>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="section-heading"><h2 class="section-title">HISTORIAS</h2><a class="text-link" href="#historias">VER TODAS →</a></div>
      <div class="story-grid">${storyCards.map((story) => `<a class="visual-card" href="#historias/${story.id}">
        <img src="${story.portada}" alt="Portada de ${story.titulo}">
        <div class="visual-card-content"><span class="badge">${story.estado}</span><h3>${story.titulo}</h3><p>${story.formatos.join(" · ")}</p></div>
      </a>`).join("")}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-heading"><h2 class="section-title">COLECCIONABLES</h2><a class="text-link" href="#coleccionables">VER COLECCIONABLES →</a></div>
      <div class="collection-grid">${collectionCards.map((collection) => `<a class="visual-card" href="#coleccionables/${collection.id}">
        <img src="${collection.imagen}" alt="${collection.nombre}">
        <div class="visual-card-content">
          ${collection.categoria ? `<span class="badge">${collection.categoria}</span>` : ""}
          <h3>${collection.nombre}</h3>
          <p>${collection.personajes.length} personaje${collection.personajes.length === 1 ? "" : "s"} visible${collection.personajes.length === 1 ? "" : "s"}</p>
        </div>
      </a>`).join("") || '<div class="empty-state">No hay colecciones publicadas por el momento.</div>'}</div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="section-heading"><div><span class="eyebrow">DARK LEGENDS STUDIO</span><h2 class="section-title">EN VIDEO</h2></div></div>
      <div class="video-shell">${sitio.youtube.playlist_general ? `<iframe src="${sitio.youtube.playlist_general}" title="Contenido de Dark Legends Studio en YouTube" loading="lazy" allowfullscreen></iframe>` : '<div class="video-placeholder">Configura una playlist de YouTube en sitio.json.</div>'}</div>
    </div>
  </section>`;
}
