import { getNoticiasRecientes, getNoticiasAnteriores } from "../services/noticias.js";
import { formatDateEs } from "../utils/fechas.js";
export async function renderNoticias() {
  const [recent, old] = await Promise.all([getNoticiasRecientes(), getNoticiasAnteriores()]);
  const cards = (items) => items.map((n) => `<a class="card" href="#noticia/${n.id}"><div class="card-media"><img src="${n.imagen}" alt=""></div><div class="card-body"><span class="badge">${n.tipo || "Actualidad"}</span><h3>${n.titulo}</h3><div class="meta"><span>${formatDateEs(n.fecha)}</span></div></div></a>`).join("");
  return `<section class="page-hero"><div class="container"><span class="eyebrow">DLS</span><h1>ACTUALIDAD</h1><p>Noticias, procesos, lanzamientos y novedades de Dark Legends Studio.</p></div></section>
  <section class="section"><div class="container"><h2 class="section-title">RECIENTES</h2><div class="story-grid" style="margin-top:28px">${cards(recent)}</div>${old.length ? `<h2 class="section-title" style="margin-top:64px">ANTERIORES</h2><div class="story-grid" style="margin-top:28px">${cards(old)}</div>` : ""}</div></section>`;
}
