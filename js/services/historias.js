let storiesCache;
const storyCache = new Map();
const dataCache = new Map();

async function getJson(path, fallbackMarker) {
  if (!dataCache.has(path)) {
    dataCache.set(path, fetch(path).then(async (response) => {
      if (!response.ok) {
        if (fallbackMarker !== undefined && response.status === 404) return fallbackMarker;
        throw new Error(`No se pudo cargar ${path}`);
      }
      return response.json();
    }));
  }
  return dataCache.get(path);
}

function slugify(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function guessReader(id = "", name = "") {
  const value = `${id} ${name}`.toLowerCase();
  return /(comic|cómic|manga|imagenes|imágenes)/.test(value) ? "imagenes" : "texto";
}

export async function getHistorias() {
  if (!storiesCache) storiesCache = getJson("./data/historias.json");
  return storiesCache;
}

export async function getHistoria(id) {
  const stories = await getHistorias();
  const summary = stories.find((story) => story.id === id);
  if (!summary) return null;
  if (!summary.data_path) return summary;
  if (!storyCache.has(id)) {
    storyCache.set(
      id,
      getJson(summary.data_path).then((detail) => ({ ...summary, ...detail }))
    );
  }
  return storyCache.get(id);
}

export function getFormatosHistoria(story) {
  if (!story) return [];

  if (Array.isArray(story.formatos_config) && story.formatos_config.length) {
    return story.formatos_config
      .filter((format) => format?.id)
      .map((format) => ({
        id: format.id,
        nombre: format.nombre || format.id,
        lector: format.lector === "imagenes" ? "imagenes" : "texto",
        indice: format.indice || `./data/historias/${story.id}/${format.id}/capitulos.json`,
        base: format.base || `./data/historias/${story.id}/${format.id}/capitulos`,
      }));
  }

  const fuentes = story.fuentes || {};
  const legacy = Object.entries(fuentes)
    .filter(([key, value]) => !["personajes", "universo"].includes(key) && value?.indice && value?.base)
    .map(([id, value]) => {
      const names = { comic: "Cómic", novela: "Novela Web" };
      const nombre = names[id] || id.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return { id, nombre, lector: guessReader(id, nombre), indice: value.indice, base: value.base };
    });

  if (legacy.length) return legacy;

  return (story.formatos || []).map((label) => {
    const nombre = String(label);
    let id = slugify(nombre);
    if (nombre.toLowerCase() === "novela web") id = "novela";
    if (["cómic", "comic"].includes(nombre.toLowerCase())) id = "comic";
    return {
      id,
      nombre,
      lector: guessReader(id, nombre),
      indice: `./data/historias/${story.id}/${id}/capitulos.json`,
      base: `./data/historias/${story.id}/${id}/capitulos`,
    };
  });
}

export async function getFormato(id, formatId) {
  const story = await getHistoria(id);
  return getFormatosHistoria(story).find((format) => format.id === formatId) || null;
}

export async function getCapitulos(id, formatId) {
  const format = await getFormato(id, formatId);
  if (!format?.indice) return [];
  const data = await getJson(format.indice, []);
  return Array.isArray(data) ? data : [];
}

export async function getCapitulo(id, formatId, chapterId) {
  const format = await getFormato(id, formatId);
  if (!format?.base) return null;
  return getJson(`${format.base}/${chapterId}.json`, null);
}

export async function getPersonajes(id) {
  const story = await getHistoria(id);
  if (!story?.fuentes?.personajes) return [];
  return getJson(story.fuentes.personajes, []);
}

export async function getUniverso(id) {
  const story = await getHistoria(id);
  if (!story?.fuentes?.universo) return [];
  return getJson(story.fuentes.universo, []);
}
