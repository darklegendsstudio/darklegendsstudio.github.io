import { getColeccion } from "../../services/coleccionables.js";

export async function renderColeccion(id) {
  const c = await getColeccion(id);
  if (!c) return '<div class="container section"><div class="error-state">Colección no encontrada.</div></div>';

  const header = c.banner
    ? `<section class="collection-hero">
        <div class="collection-hero-media"><img src="${c.banner}" alt=""></div>
        <div class="container collection-hero-content">
          <span class="eyebrow">COLECCIONABLES</span>
          <h1>${c.nombre}</h1>
          <p>${c.descripcion || ""}</p>
        </div>
      </section>`
    : `<section class="page-hero"><div class="container"><span class="eyebrow">COLECCIONABLES</span><h1>${c.nombre}</h1><p>${c.descripcion || ""}</p></div></section>`;

  const characters = (c.personajes || []).map((p) => `
    <a class="visual-card roster-card" href="#coleccionables/${c.id}/${p.id}">
      <img src="${p.imagen}" alt="${p.nombre}">
      <div class="visual-card-content">
        <h3>${p.nombre}</h3>
        <p>${(p.productos || []).length} producto${(p.productos || []).length === 1 ? "" : "s"}</p>
      </div>
    </a>`).join("");

  return `${header}
    <section class="section">
      <div class="container">
        ${characters
          ? `<div class="roster-grid">${characters}</div>`
          : '<div class="empty-state">Esta colección todavía no tiene personajes o diseños publicados.</div>'}
      </div>
    </section>`;
}
