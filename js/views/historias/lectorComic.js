import { getCapitulo, getCapitulos, getHistoria } from "../../services/historias.js";

export async function renderLectorComic(id, chapterId) {
  const [story, chapter, index] = await Promise.all([
    getHistoria(id),
    getCapitulo(id, "comic", chapterId),
    getCapitulos(id, "comic")
  ]);

  if (!story || !chapter) {
    return '<div class="container section"><div class="error-state">Capítulo no encontrado.</div></div>';
  }

  const ordered = [...index].sort((a, b) => a.numero - b.numero);
  const pos = ordered.findIndex((c) => c.id === chapterId);
  const prev = ordered[pos - 1];
  const next = ordered[pos + 1];

  return `<section class="reader">
    <div class="container">
      <div class="reader-head">
        <span class="eyebrow">${story.titulo} · CÓMIC</span>
        <h1>${chapter.titulo}</h1>
        <p>Episodio ${chapter.numero}</p>
        <a class="text-link" href="#historias/${id}/capitulos/comic">← VOLVER A CAPÍTULOS</a>
      </div>

      <div class="comic-pages">
        ${chapter.paginas.map((p, i) => `<img src="${p}" alt="${chapter.titulo}, página ${i + 1}" loading="lazy">`).join("")}
      </div>

      <div class="reader-nav">
        ${prev
          ? `<a class="btn secondary nav-prev" href="#historias/${id}/comic/${prev.id}">← ANTERIOR</a>`
          : '<span class="nav-prev"></span>'}
        <a class="btn secondary nav-center" href="#historias/${id}/capitulos/comic">CAPÍTULOS</a>
        ${next
          ? `<a class="btn secondary nav-next" href="#historias/${id}/comic/${next.id}">SIGUIENTE →</a>`
          : '<span class="nav-next"></span>'}
      </div>
    </div>
  </section>`;
}
