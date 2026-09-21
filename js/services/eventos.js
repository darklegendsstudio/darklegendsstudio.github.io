import { isFutureOrToday, sortByDateAsc } from "../utils/fechas.js";
let cache;
export async function getEventos() {
  if (!cache) cache = fetch("./data/eventos.json").then(assertOk).then((r) => r.json());
  return cache.eventos || [];
}
export async function getProximosEventos(limit = 5) {
  const events = await getEventos();
  return sortByDateAsc(events.filter((e) => isFutureOrToday(e.fecha))).slice(0, limit);
}
function assertOk(response) { if (!response.ok) throw new Error("No se pudo cargar eventos.json"); return response; }
