import { sortByDateDesc } from "../utils/fechas.js";
let recentCache;
let oldCache;
export async function getNoticiasRecientes() {
  if (!recentCache) recentCache = fetch("./data/noticias_recientes.json").then(assertOk).then((r) => r.json());
  return sortByDateDesc(await recentCache);
}
export async function getNoticiasAnteriores() {
  if (!oldCache) oldCache = fetch("./data/noticias_anteriores.json").then(assertOk).then((r) => r.json());
  return sortByDateDesc(await oldCache);
}
export async function getNoticia(id) {
  const all = [...await getNoticiasRecientes(), ...await getNoticiasAnteriores()];
  return all.find((item) => item.id === id) || null;
}
function assertOk(response) { if (!response.ok) throw new Error("No se pudieron cargar las noticias"); return response; }
