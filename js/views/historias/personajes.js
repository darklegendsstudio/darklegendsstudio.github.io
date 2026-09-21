import { getHistoria, getPersonajes } from "../../services/historias.js";
import { nav } from "./historia.js";

export async function renderPersonajes(id) {
  const [story, characters] = await Promise.all([getHistoria(id), getPersonajes(id)]);
  if (!story) {
    return '<div class="container section"><div class="error-state">Historia no encontrada.</div></div>';
  }

  const content = characters.length
    ? `<div class="roster-grid">${characters.map((character) => `<a class="visual-card roster-card" href="#historias/${id}/personajes/${character.id}"><img src="${character.imagen}" alt="${character.nombre}"><div class="visual-card-content"><h3>${character.nombre}</h3>${character.rol ? `<p>${character.rol}</p>` : ""}</div></a>`).join("")}</div>`
    : '<div class="empty-state">Todavía no hay personajes publicados para esta historia.</div>';

  return `<section class="page-hero"><div class="container"><span class="eyebrow">${story.titulo}</span><h1>PERSONAJES</h1><p>Conoce a los personajes revelados hasta el punto actual de publicación.</p>${nav(story, "personajes")}</div></section><section class="section"><div class="container">${content}</div></section>`;
}
