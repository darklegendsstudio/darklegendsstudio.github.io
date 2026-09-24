import { getHistorias, getHistoria, getFormatosHistoria, getCapitulos } from "../../services/historias.js";
import { formatDateEs } from "../../utils/fechas.js";

export async function renderHistorias() {
  const stories = await getHistorias();
  const featured = stories.find((story) => story.destacada) || stories[0];
  const updates = [];

  for (const summary of stories) {
    const story = await getHistoria(summary.id);
    const formats = getFormatosHistoria(story);
    for (const format of formats) {
      const chapters = await getCapitulos(summary.id, format.id);
      if (chapters[0]) updates.push({ story, format, chapter: chapters[0] });
    }
  }

  updates.sort((a, b) => String(b.chapter.fecha || "").localeCompare(String(a.chapter.fecha || "")));

  return `<section class="page-hero"><div class="container"><span class="eyebrow">BIBLIOTECA DLS</span><h1>HISTORIAS</h1><p>Mundos, personajes, relatos y proyectos narrativos de Dark Legends Studio.</p></div></section>
  <section class="section"><div class="container">
    ${featured ? `<a class="visual-card" style="min-height:460px;display:block" href="#historias/${featured.id}"><img src="${featured.hero || featured.portada}" alt=""><div class="visual-card-content"><span class="badge gold">DESTACADA</span><h2>${featured.titulo}</h2><p>${featured.descripcion}</p><p>${(featured.formatos || []).join(" · ")}</p></div></a>` : ""}
    ${updates.length ? `<div class="section-heading" style="margin-top:64px"><h2 class="section-title">ÚLTIMAS ACTUALIZACIONES</h2></div><div class="chapter-list">${updates.slice(0, 5).map((update) => `<a class="chapter-row" href="#historias/${update.story.id}/${update.format.id}/${update.chapter.id}"><span class="chapter-number">${update.format.nombre.toUpperCase()}</span><span><span class="chapter-title">${update.story.titulo} — ${update.chapter.titulo}</span></span><span class="chapter-date">${formatDateEs(update.chapter.fecha)}</span></a>`).join("")}</div>` : ""}
    <div class="section-heading" style="margin-top:64px"><h2 class="section-title">TODAS LAS HISTORIAS</h2></div>
    <div class="story-grid">${stories.map((story) => `<a class="visual-card" href="#historias/${story.id}"><img src="${story.portada}" alt="Portada de ${story.titulo}"><div class="visual-card-content"><span class="badge">${story.estado}</span><h3>${story.titulo}</h3><p>${(story.generos || []).join(" · ")}</p><p>${(story.formatos || []).join(" · ")}</p></div></a>`).join("")}</div>
  </div></section>`;
}
