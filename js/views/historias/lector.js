import { getFormato } from "../../services/historias.js";
import { renderLectorImagenes } from "./lectorImagenes.js";
import { renderLectorTexto } from "./lectorTexto.js";

export async function renderLector(id, formatId, chapterId) {
  const format = await getFormato(id, formatId);
  if (!format) {
    return '<div class="container section"><div class="error-state">Formato no encontrado.</div></div>';
  }
  return format.lector === "imagenes"
    ? renderLectorImagenes(id, formatId, chapterId)
    : renderLectorTexto(id, formatId, chapterId);
}
