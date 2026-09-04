"use client";

const STEPS = ["Perfil", "Awareness", "Activaciones", "Cierre"];

type Props = {
  current: number;
  total: number;
  noAplica?: boolean;
};

export function ProgressBar({ current, total, noAplica }: Props) {
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>
          {noAplica
            ? "Encuesta no aplica"
            : `Paso ${current + 1} de ${total}: ${STEPS[current]}`}
        </span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-ceipa-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="hidden gap-1 sm:flex">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`flex-1 rounded-md px-2 py-1 text-center text-[11px] font-medium ${
              i === current
                ? "bg-ceipa-100 text-ceipa-800"
                : i < current
                  ? "bg-slate-100 text-slate-600"
                  : "text-slate-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
