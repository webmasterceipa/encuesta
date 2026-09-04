import {
  listarPendientes,
  marcarSincronizadas,
  contarEncuestas,
} from "./db";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { EncuestaLocal } from "./types";

export type SyncResult = {
  ok: boolean;
  synced: number;
  pending: number;
  total: number;
  message: string;
};

function toSupabasePayload(encuesta: EncuestaLocal) {
  return {
    id: encuesta.id,
    creado_en: encuesta.creado_en,
    encuestador: encuesta.encuestador,
    punto_aplicacion: encuesta.punto_aplicacion,
    fecha_encuesta: encuesta.fecha_encuesta,
    edad_rango: encuesta.edad_rango,
    genero: encuesta.genero,
    residencia: encuesta.residencia,
    residencia_otro: encuesta.residencia_otro,
    menciones_espontaneas: encuesta.menciones_espontaneas,
    conoce_ceipa: encuesta.conoce_ceipa,
    donde_escucho: encuesta.donde_escucho,
    donde_escucho_otro: encuesta.donde_escucho_otro,
    definicion_una_palabra: encuesta.definicion_una_palabra,
    participo_activacion: encuesta.participo_activacion,
    genero_interes: encuesta.genero_interes,
    comentario_final: encuesta.comentario_final,
    no_aplica: encuesta.no_aplica,
    sincronizado: true,
  };
}

export async function sincronizarPendientes(): Promise<SyncResult> {
  const counts = await contarEncuestas();

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      ok: false,
      synced: 0,
      pending: counts.pendientes,
      total: counts.total,
      message: "Sin conexión. Las encuestas quedan guardadas localmente.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      synced: 0,
      pending: counts.pendientes,
      total: counts.total,
      message:
        "Faltan las variables NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      ok: false,
      synced: 0,
      pending: counts.pendientes,
      total: counts.total,
      message: "No se pudo inicializar el cliente de Supabase.",
    };
  }

  const pendientes = await listarPendientes();
  if (pendientes.length === 0) {
    return {
      ok: true,
      synced: 0,
      pending: 0,
      total: counts.total,
      message: "No hay encuestas pendientes por sincronizar.",
    };
  }

  const payload = pendientes.map(toSupabasePayload);

  try {
    const { error } = await supabase.from("encuestas_ceipa").upsert(payload, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (error) {
      return {
        ok: false,
        synced: 0,
        pending: pendientes.length,
        total: counts.total,
        message: `Error al sincronizar: ${error.message}`,
      };
    }

    await marcarSincronizadas(pendientes.map((e) => e.id));
    const after = await contarEncuestas();

    return {
      ok: true,
      synced: pendientes.length,
      pending: after.pendientes,
      total: after.total,
      message: `Se sincronizaron ${pendientes.length} encuesta(s) con Supabase.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error de red desconocido";
    return {
      ok: false,
      synced: 0,
      pending: pendientes.length,
      total: counts.total,
      message: `Falló la sincronización (datos locales intactos): ${msg}`,
    };
  }
}
