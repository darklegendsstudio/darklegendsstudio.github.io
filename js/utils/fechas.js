const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MONTHS_SHORT = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

export function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateEs(value) {
  const date = parseLocalDate(value);
  if (!date || Number.isNaN(date.getTime())) return value || "";
  return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

export function formatAgendaDate(value) {
  const date = parseLocalDate(value);
  if (!date || Number.isNaN(date.getTime())) return { day: "", month: "" };
  return { day: String(date.getDate()).padStart(2, "0"), month: MONTHS_SHORT[date.getMonth()] };
}

export function isFutureOrToday(value, now = new Date()) {
  const date = parseLocalDate(value);
  if (!date) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date >= today;
}

export function sortByDateAsc(items) {
  return [...items].sort((a, b) => parseLocalDate(a.fecha) - parseLocalDate(b.fecha));
}

export function sortByDateDesc(items) {
  return [...items].sort((a, b) => parseLocalDate(b.fecha) - parseLocalDate(a.fecha));
}
