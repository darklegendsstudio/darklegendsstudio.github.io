let cache;

function isCharacterEnabled(character) {
  return character?.habilitado !== false;
}

function toPublicCatalog(data) {
  const collections = Array.isArray(data?.colecciones) ? data.colecciones : [];

  return {
    ...data,
    colecciones: collections
      .map((collection) => ({
        ...collection,
        personajes: (collection.personajes || []).filter(isCharacterEnabled),
      }))
      .filter((collection) => collection.personajes.length > 0),
  };
}

export async function getColeccionables() {
  if (!cache) {
    cache = fetch("./data/coleccionables.json")
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo cargar coleccionables.json");
        return response.json();
      })
      .then(toPublicCatalog);
  }

  return cache;
}

export async function getColeccion(id) {
  const data = await getColeccionables();
  return data.colecciones.find((collection) => collection.id === id) || null;
}

export async function getPersonajeColeccion(coleccionId, personajeId) {
  const collection = await getColeccion(coleccionId);
  if (!collection) return null;

  const personaje = collection.personajes.find((item) => item.id === personajeId) || null;
  return personaje ? { collection, personaje } : null;
}
