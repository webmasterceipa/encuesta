"use client";

import type { EncuestaFormData } from "@/lib/types";

type Props = {
  data: EncuestaFormData;
  onChange: (patch: Partial<EncuestaFormData>) => void;
  errors: Partial<Record<keyof EncuestaFormData, string>>;
};

export function ControlHeader({ data, onChange, errors }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ceipa-700">
        Datos de control
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Encuestador <span className="text-red-600">*</span>
          </span>
          <input
            type="text"
            value={data.encuestador}
            onChange={(e) => onChange({ encuestador: e.target.value })}
            className="field-input"
            placeholder="Nombre del encuestador"
            autoComplete="name"
          />
          {errors.encuestador && (
            <p className="mt-1 text-xs text-red-600">{errors.encuestador}</p>
          )}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Punto de aplicación <span className="text-red-600">*</span>
          </span>
          <input
            type="text"
            value={data.punto_aplicacion}
            onChange={(e) => onChange({ punto_aplicacion: e.target.value })}
            className="field-input"
            placeholder="Ej. Parque Berrio, CAM..."
          />
          {errors.punto_aplicacion && (
            <p className="mt-1 text-xs text-red-600">{errors.punto_aplicacion}</p>
          )}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Fecha <span className="text-red-600">*</span>
          </span>
          <input
            type="date"
            value={data.fecha_encuesta}
            onChange={(e) => onChange({ fecha_encuesta: e.target.value })}
            className="field-input"
          />
          {errors.fecha_encuesta && (
            <p className="mt-1 text-xs text-red-600">{errors.fecha_encuesta}</p>
          )}
        </label>
      </div>
    </section>
  );
}
