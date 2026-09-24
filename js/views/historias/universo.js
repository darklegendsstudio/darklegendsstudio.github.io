import { getHistoria, getUniverso } from "../../services/historias.js";
import { nav } from "./historia.js";

export async function renderUniverso(id, type = "todos") {
  const [story, entries] = await Promise.all([getHistoria(id), getUniverso(id)]);
  if (!story) {
    return '<div class="container section"><div class="error-state">Historia no encontrada.</div></div>';
  }

  const types = [...new Set(entries.map((entry) => entry.tipo).filter(Boolean))];
  const filtered = type === "todos" ? entries : entries.filter((entry) => entry.tipo === type);

  const tabs = entries.length
    ? `<div class="tabs"><a class="tab ${type === "todos" ? "active" : ""}" href="#historias/${id}/universo">TODO</a>${types.map((entryType) => `<a class="tab ${type === entryType ? "active" : ""}" href="#historias/${id}/universo?tipo=${encodeURIComponent(entryType)}">${entryType.toUpperCase()}</a>`).join("")}</div>`
    : "";

  const content = filtered.length
    ? `<div class="universe-grid">${filtered.map((entry) => `<a class="visual-card" href="#historias/${id}/universo/${entry.id}"><img src="${entry.imagen}" alt=""><div class="visual-card-content"><span class="badge violet">${entry.tipo}</span><h3>${entry.nombre}</h3></div></a>`).join("")}</div>`
    : `<div class="empty-state">${entries.length ? "No hay entradas de este tipo." : "Todavía no hay contenido de universo publicado para esta historia."}</div>`;

  return `<section class="page-hero"><div class="container"><span class="eyebrow">${story.titulo}</span><h1>UNIVERSO</h1><p>Explora únicamente los lugares, criaturas y conceptos ya revelados por la historia.</p>${nav(story, "universo")}</div></section><section class="section"><div class="container">${tabs}${content}</div></section>`;
}
