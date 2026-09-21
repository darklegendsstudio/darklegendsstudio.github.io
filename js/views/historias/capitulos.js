import { getHistoria, getFormatosHistoria, getCapitulos } from "../../services/historias.js";
import { formatDateEs } from "../../utils/fechas.js";
import { nav } from "./historia.js";

export async function renderCapitulos(id, requestedFormat = "") {
  const story = await getHistoria(id);
  if (!story) return '<div class="container section"><div class="error-state">Historia no encontrada.</div></div>';
  const formats = getFormatosHistoria(story);
  if (!formats.length) {
    return `<section class="page-hero"><div class="container"><span class="eyebrow">${story.titulo}</span><h1>CAPÍTULOS</h1>${nav(story, "capitulos")}</div></section><section class="section"><div class="container"><div class="empty-state">Esta historia todavía no tiene formatos publicados.</div></div></section>`;
  }
  const selected = formats.find((format) => format.id === requestedFormat) || formats[0];
  const chapters = await getCapitulos(id, selected.id);

  return `<section class="page-hero"><div class="container"><span class="eyebrow">${story.titulo}</span><h1>CAPÍTULOS</h1>${nav(story, "capitulos")}</div></section>
  <section class="section"><div class="container"><div class="tabs">${formats.map((format) => `<a class="tab ${selected.id === format.id ? "active" : ""}" href="#historias/${id}/capitulos/${format.id}">${format.nombre.toUpperCase()}</a>`).join("")}</div>
  <div class="chapter-list">${chapters.map((chapter) => `<a class="chapter-row" href="#historias/${id}/${selected.id}/${chapter.id}"><span class="chapter-number">${String(chapter.numero).padStart(2, "0")}</span><span class="chapter-title">${chapter.titulo}</span><span class="chapter-date">${formatDateEs(chapter.fecha)}</span></a>`).join("") || '<div class="empty-state">No hay capítulos publicados en este formato.</div>'}</div></div></section>`;
}
