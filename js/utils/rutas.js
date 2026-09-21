export function normalizeHash(hash = window.location.hash) {
  const clean = hash.replace(/^#\/?/, "").replace(/\/$/, "");
  return clean || "inicio";
}

export function routeParts(hash = window.location.hash) {
  return normalizeHash(hash).split("/").filter(Boolean);
}

export function toHash(...parts) {
  return `#${parts.filter(Boolean).join("/")}`;
}
