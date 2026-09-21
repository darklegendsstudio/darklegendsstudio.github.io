import { getHistoria, getUniverso } from "../../services/historias.js";
import { formatRichText } from "../../utils/texto.js";
export async function renderUniversoDetalle(id, entryId) {
  const [story, entries] = await Promise.all([getHistoria(id), getUniverso(id)]);
  const e = entries.find(x=>x.id===entryId);
  if (!story || !e) return '<div class="container section"><div class="error-state">Entrada no encontrada.</div></div>';
  return `<section class="page-hero"><div class="container"><span class="eyebrow">${story.titulo} · ${e.tipo}</span><h1>${e.nombre}</h1><p><a class="text-link" href="#historias/${id}/universo">← VOLVER A UNIVERSO</a></p></div></section><section class="section"><div class="container story-profile"><div class="story-cover"><img src="${e.imagen}" alt="${e.nombre}"></div><div>${formatRichText(e.descripcion)}${e.datos?`<div class="info-list">${Object.entries(e.datos).map(([k,v])=>`<div class="info-item"><div class="info-label">${k.replaceAll("_"," ")}</div><div class="info-value">${v}</div></div>`).join("")}</div>`:""}${e.apariciones?.length?`<h2 class="section-title" style="margin-top:32px">APARICIONES</h2><div class="stack" style="margin-top:20px">${e.apariciones.map(a=>`<a class="related-item" href="${a.enlace}">${a.texto} →</a>`).join("")}</div>`:""}${e.relacionados?.length?`<h2 class="section-title" style="margin-top:32px">RELACIONADO</h2><div class="related-grid" style="margin-top:20px">${e.relacionados.map(r=>`<a class="related-item" href="#historias/${id}/universo/${r.id}">${r.nombre}</a>`).join("")}</div>`:""}</div></div></section>`;
}
