import { getCapitulo, getCapitulos, getHistoria } from "../../services/historias.js";
import { formatRichText } from "../../utils/texto.js";

export async function renderLectorNovela(id, chapterId) {
  const [story, chapter, index] = await Promise.all([
    getHistoria(id),
    getCapitulo(id, "novela", chapterId),
    getCapitulos(id, "novela")
  ]);

  if (!story || !chapter) {
    return '<div class="container section"><div class="error-state">Capítulo no encontrado.</div></div>';
  }

  const ordered = [...index].sort((a, b) => a.numero - b.numero);
  const pos = ordered.findIndex((c) => c.id === chapterId);
  const prev = ordered[pos - 1];
  const next = ordered[pos + 1];

  return `<section class="reader">
    <div class="reader-head">
      <span class="eyebrow">${story.titulo} · NOVELA WEB</span>
      <h1>${chapter.titulo}</h1>
      <p>Capítulo ${chapter.numero}</p>
      <a class="text-link" href="#historias/${id}/capitulos/novela">← VOLVER A CAPÍTULOS</a>
    </div>

    <article class="novel-sheet">
      ${formatRichText(chapter.contenido)}
    </article>

    <div class="reader-nav">
      ${prev
        ? `<a class="btn secondary nav-prev" href="#historias/${id}/novela/${prev.id}">← ANTERIOR</a>`
        : '<span class="nav-prev"></span>'}
      <a class="btn secondary nav-center" href="#historias/${id}/capitulos/novela">CAPÍTULOS</a>
      ${next
        ? `<a class="btn secondary nav-next" href="#historias/${id}/novela/${next.id}">SIGUIENTE →</a>`
        : '<span class="nav-next"></span>'}
    </div>
  </section>`;
}
