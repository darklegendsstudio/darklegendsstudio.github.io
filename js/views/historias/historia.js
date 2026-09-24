import { getHistoria, getFormatosHistoria, getCapitulos } from "../../services/historias.js";
import { formatRichText } from "../../utils/texto.js";
import { formatDateEs } from "../../utils/fechas.js";

export function nav(story, active = "portada") {
  const formats = getFormatosHistoria(story);
  const links = [
    `<a class="${active === "portada" ? "active" : ""}" href="#historias/${story.id}">PORTADA</a>`,
  ];
  if (formats.length) {
    links.push(`<a class="${active === "capitulos" ? "active" : ""}" href="#historias/${story.id}/capitulos/${formats[0].id}">CAPÍTULOS</a>`);
  }
  if (story?.fuentes?.personajes) {
    links.push(`<a class="${active === "personajes" ? "active" : ""}" href="#historias/${story.id}/personajes">PERSONAJES</a>`);
  }
  if (story?.fuentes?.universo) {
    links.push(`<a class="${active === "universo" ? "active" : ""}" href="#historias/${story.id}/universo">UNIVERSO</a>`);
  }
  return `<nav class="subnav" aria-label="Navegación interna de la historia">${links.join("")}</nav>`;
}

export async function renderHistoria(id) {
  const story = await getHistoria(id);
  if (!story) return '<div class="container section"><div class="error-state">Historia no encontrada.</div></div>';

  const formats = getFormatosHistoria(story);
  const updates = [];
  for (const format of formats) {
    const chapters = await getCapitulos(id, format.id);
    updates.push(...chapters.map((chapter) => ({ ...chapter, format })));
  }
  const latest = updates.sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")))[0];

  if (!story.data_path && !formats.length) {
    return `<section class="page-hero"><div class="container"><span class="eyebrow">HISTORIA</span><h1>${story.titulo}</h1><p>${story.descripcion}</p></div></section><section class="section"><div class="container"><div class="empty-state">Esta historia aún no tiene contenido publicable.</div></div></section>`;
  }

  return `<section class="page-hero"><div class="container"><span class="eyebrow">HISTORIA DLS</span><h1>${story.titulo}</h1>${nav(story)}</div></section>
  <section class="section"><div class="container story-profile">
    <div class="story-cover"><img src="${story.portada}" alt="Portada de ${story.titulo}"></div>
    <div><span class="badge">${story.estado}</span><h2 style="margin-top:12px">${story.titulo}</h2><div class="info-list"><div class="info-item"><div class="info-label">Géneros</div><div class="info-value">${(story.generos || []).join(" · ")}</div></div><div class="info-item"><div class="info-label">Formatos</div><div class="info-value">${formats.map((format) => format.nombre).join(" · ") || "Sin formatos publicados"}</div></div></div><h3>SINOPSIS</h3><div>${formatRichText(story.sinopsis || story.descripcion || "")}</div>${latest ? `<div style="margin-top:32px"><span class="eyebrow">ÚLTIMA ACTUALIZACIÓN</span><h3 style="margin-top:8px">${latest.titulo}</h3><p>${latest.format.nombre} · ${formatDateEs(latest.fecha)}</p><a class="btn" href="#historias/${id}/${latest.format.id}/${latest.id}">LEER AHORA</a></div>` : ""}</div>
  </div></section>`;
}
