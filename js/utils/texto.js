export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatInline(value = "") {
  const escaped = escapeHtml(value);
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function formatRichText(value = "") {
  if (!value) return "";
  return String(value)
    .split(/\n\n+/)
    .map((paragraph) => `<p>${formatInline(paragraph.trim())}</p>`)
    .join("");
}

export function stripFormatting(value = "") {
  return String(value).replace(/\*\*(.+?)\*\*/g, "$1").replace(/\n\n+/g, " ").trim();
}
