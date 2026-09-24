import { getCapitulo, getCapitulos, getFormato, getHistoria } from "../../services/historias.js";
import { formatRichText } from "../../utils/texto.js";

export async function renderLectorTexto(id, formatId, chapterId) {
  const [story, format, chapter, index] = await Promise.all([
    getHistoria(id),
    getFormato(id, formatId),
    getCapitulo(id, formatId, chapterId),
    getCapitulos(id, formatId),
  ]);

  if (!story || !format || !chapter) {
    return '<div class="container section"><div class="error-state">Capítulo no encontrado.</div></div>';
  }

  const ordered = [...index].sort((a, b) => a.numero - b.numero);
  const pos = ordered.findIndex((item) => item.id === chapterId);
  const prev = ordered[pos - 1];
  const next = ordered[pos + 1];
  const base = `#historias/${id}/${formatId}`;
  const chaptersUrl = `#historias/${id}/capitulos/${formatId}`;

  return `<section class="reader">
    <div class="reader-head">
      <span class="eyebrow">${story.titulo} · ${format.nombre.toUpperCase()}</span>
      <h1>${chapter.titulo}</h1>
      <p>Capítulo ${chapter.numero}</p>
      <a class="text-link" href="${chaptersUrl}">← VOLVER A CAPÍTULOS</a>
    </div>

    <article class="novel-sheet">
      ${formatRichText(chapter.contenido)}
    </article>

    <div class="reader-nav">
      ${prev ? `<a class="btn secondary nav-prev" href="${base}/${prev.id}">← ANTERIOR</a>` : '<span class="nav-prev"></span>'}
      <a class="btn secondary nav-center" href="${chaptersUrl}">CAPÍTULOS</a>
      ${next ? `<a class="btn secondary nav-next" href="${base}/${next.id}">SIGUIENTE →</a>` : '<span class="nav-next"></span>'}
    </div>
  </section>`;
}
