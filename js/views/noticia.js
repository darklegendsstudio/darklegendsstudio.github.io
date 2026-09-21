import { getNoticia } from "../services/noticias.js";
import { formatDateEs } from "../utils/fechas.js";
import { formatRichText } from "../utils/texto.js";
export async function renderNoticia(id) {
  const item = await getNoticia(id);
  if (!item) return '<div class="container section"><div class="error-state">Noticia no encontrada.</div></div>';
  return `<article class="article">
    <span class="badge">${item.tipo || "Actualidad"}</span>
    <h1>${item.titulo}</h1>
    <p>${formatDateEs(item.fecha)}</p>
    <div class="article-cover"><img src="${item.imagen}" alt=""></div>
    <div class="article-content">${formatRichText(item.contenido)}</div>
    <p><a class="text-link" href="#inicio">← VOLVER A INICIO</a></p>
  </article>`;
}
