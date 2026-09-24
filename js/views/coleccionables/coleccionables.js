import { getColeccionables } from "../../services/coleccionables.js";
export async function renderColeccionables() {
  const data = await getColeccionables();
  return `<section class="page-hero"><div class="container"><span class="eyebrow">DARK LEGENDS STUDIO</span><h1>COLECCIONABLES</h1><p>Mercancía física organizada por colecciones: figuras, vasos, llaveros y futuros productos de DLS.</p></div></section><section class="section"><div class="container"><div class="collection-grid">${data.colecciones.map(c=>`<a class="visual-card" href="#coleccionables/${c.id}"><img src="${c.imagen}" alt="${c.nombre}"><div class="visual-card-content"><h3>${c.nombre}</h3><p>${c.descripcion}</p></div></a>`).join("")}</div></div></section>`;
}
