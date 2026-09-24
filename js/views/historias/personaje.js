import { getHistoria, getPersonajes } from "../../services/historias.js";
import { formatRichText } from "../../utils/texto.js";

export async function renderPersonaje(id, characterId) {
  const [story, characters] = await Promise.all([getHistoria(id), getPersonajes(id)]);
  const c = characters.find((x) => x.id === characterId);
  if (!story || !c) {
    return '<div class="container section"><div class="error-state">Personaje no encontrado.</div></div>';
  }

  const firstAppearance = c.primera_aparicion
    ? c.primera_aparicion_enlace
      ? `<a class="text-link" href="${c.primera_aparicion_enlace}">${c.primera_aparicion}</a>`
      : c.primera_aparicion
    : "";

  const info = [
    ["Rol", c.rol],
    ["Afiliación", c.afiliacion],
    ["Primera aparición", firstAppearance],
    ["Estado", c.estado],
  ].filter(([, value]) => value);

  return `<section class="page-hero"><div class="container"><span class="eyebrow">${story.titulo} · PERSONAJES</span><h1>${c.nombre}</h1><p><a class="text-link" href="#historias/${id}/personajes">← VOLVER AL ROSTER</a></p></div></section><section class="section"><div class="container character-profile"><div class="character-art"><img src="${c.imagen}" alt="${c.nombre}"></div><div>${c.rol ? `<span class="badge">${c.rol}</span>` : ""}<div style="margin-top:20px">${formatRichText(c.descripcion)}</div>${info.length ? `<div class="info-list">${info.map(([key, value]) => `<div class="info-item"><div class="info-label">${key}</div><div class="info-value">${value}</div></div>`).join("")}</div>` : ""}${c.habilidades?.length ? `<h2 class="section-title" style="margin-top:32px">HABILIDADES</h2><div class="stack" style="margin-top:22px">${c.habilidades.map((ability) => `<div><h3>${ability.nombre}</h3><div>${formatRichText(ability.descripcion)}</div></div>`).join("")}</div>` : ""}${c.coleccionable ? `<div style="margin-top:36px"><h2 class="section-title">COLECCIONABLE</h2><p>Este personaje cuenta con mercancía relacionada.</p><a class="btn secondary" href="${c.coleccionable}">VER COLECCIONABLE</a></div>` : ""}</div></div></section>`;
}
