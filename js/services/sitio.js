let cache;
export async function getSitio() {
  if (!cache) cache = fetch("./data/sitio.json").then(assertOk).then((r) => r.json());
  return cache;
}
function assertOk(response) { if (!response.ok) throw new Error("No se pudo cargar sitio.json"); return response; }
