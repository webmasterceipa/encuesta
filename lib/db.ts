import Dexie, { type Table } from "dexie";
import type { EncuestaLocal } from "./types";

export class EncuestaDatabase extends Dexie {
  encuestas_local!: Table<EncuestaLocal, string>;

  constructor() {
    super("encuesta_ceipa_db");
    this.version(1).stores({
      encuestas_local: "id, sincronizado, creado_en, fecha_encuesta, encuestador",
    });
  }
}

export const db = new EncuestaDatabase();

export async function guardarEncuestaLocal(
  encuesta: EncuestaLocal
): Promise<string> {
  await db.encuestas_local.put(encuesta);
  return encuesta.id;
}

export async function listarEncuestas(): Promise<EncuestaLocal[]> {
  return db.encuestas_local.orderBy("creado_en").reverse().toArray();
}

export async function listarPendientes(): Promise<EncuestaLocal[]> {
  return db.encuestas_local.filter((e) => !e.sincronizado).toArray();
}

export async function marcarSincronizadas(ids: string[]): Promise<void> {
  await db.transaction("rw", db.encuestas_local, async () => {
    for (const id of ids) {
      await db.encuestas_local.update(id, { sincronizado: true });
    }
  });
}

export async function contarEncuestas(): Promise<{
  total: number;
  pendientes: number;
}> {
  const total = await db.encuestas_local.count();
  const pendientes = await db.encuestas_local
    .filter((e) => !e.sincronizado)
    .count();
  return { total, pendientes };
}
