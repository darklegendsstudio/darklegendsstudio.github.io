let cache;
export async function getInicio() {
  if (!cache) cache = fetch("./data/inicio.json").then(assertOk).then((r) => r.json());
  return cache;
}
function assertOk(response) { if (!response.ok) throw new Error("No se pudo cargar inicio.json"); return response; }
