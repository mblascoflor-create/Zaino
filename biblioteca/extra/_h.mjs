// Ayudas para escribir las fichas extra: planes nuevos (N) y paradas concretas dentro de un plan (lista de [nombre, lat, lon, nota]).
// Son sitios conocidos que existen; el enlace es siempre una búsqueda en Google Maps por nombre. No llevan precio ni horario: no están verificados.
export function N(id, nombre, donde, base, tipo, duracion, momento, coste, descripcion, geo, paradas, x) {
  x = x || {};
  return Object.assign({ id, nombre, donde, base, tipo, tipos_extra: x.tipos || [], duracion, momento, coste,
    requiere_coche: !!x.coche, requiere_reserva: !!x.reserva, esfuerzo: x.esfuerzo || 'bajo', ambiente: x.ambiente || 'tranquilo',
    descripcion, consejo: x.consejo || '', geo, paradas: paradas || [], q: x.q || null }, x.meses ? { meses: x.meses } : {});
}
export const VER = [5, 6, 7, 8, 9], VERANO = [6, 7, 8, 9], TEMP = [4, 5, 6, 7, 8, 9, 10];
