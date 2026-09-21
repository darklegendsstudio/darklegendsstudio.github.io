import { getPersonajeColeccion } from "../../services/coleccionables.js";
import { formatRichText } from "../../utils/texto.js";
function statusClass(value){ return value.toLowerCase().includes("dispon") ? "available" : "soldout"; }
function money(value, currency="MXN"){ return new Intl.NumberFormat("es-MX",{style:"currency",currency,maximumFractionDigits:0}).format(value); }
export async function renderPersonajeColeccion(collectionId, characterId) {
  const data = await getPersonajeColeccion(collectionId, characterId);
  if (!data) return '<div class="container section"><div class="error-state">Coleccionable no encontrado.</div></div>';
  const { collection, personaje } = data;
  return `<section class="page-hero"><div class="container"><span class="eyebrow">${collection.nombre}</span><h1>${personaje.nombre}</h1><p><a class="text-link" href="#coleccionables/${collection.id}">← VOLVER A LA COLECCIÓN</a></p></div></section>
  <section class="section"><div class="container character-profile"><div class="character-art"><img src="${personaje.imagen}" alt="${personaje.nombre}"></div><div><h2>${personaje.nombre}</h2>${personaje.descripcion?formatRichText(personaje.descripcion):""}</div></div></section>
  <section class="section alt"><div class="container"><div class="section-heading"><h2 class="section-title">PRODUCTOS</h2></div><div class="character-product-grid">${personaje.productos.map(p=>`<article class="product-panel"><img src="${p.imagen}" alt="${p.tipo} ${personaje.nombre}"><div class="product-panel-body"><span class="badge">${p.tipo}${p.estilo?` · ${p.estilo}`:""}</span>${p.descripcion?`<div>${formatRichText(p.descripcion)}</div>`:""}<div class="variant-list">${p.variantes.map(v=>`<div class="variant-row"><span>${v.color}</span><span class="status ${statusClass(v.estatus)}">${v.estatus}</span><span class="price">${money(v.precio, v.moneda || "MXN")}</span></div>`).join("")}</div></div></article>`).join("")}</div></div></section>
  ${personaje.historia?`<section class="section"><div class="container"><div class="section-heading"><h2 class="section-title">HISTORIAS</h2></div><div class="card"><div class="card-body"><span class="badge violet">${personaje.historia.tipo || "Historia"}</span><h3>${personaje.historia.titulo}</h3><p>${personaje.historia.descripcion || "Conoce más sobre este personaje."}</p><a class="btn secondary" href="${personaje.historia.enlace}">LEER HISTORIA</a></div></div></div></section>`:""}`;
}
