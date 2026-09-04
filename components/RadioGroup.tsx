"use client";

type Props = {
  name: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
};

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
  required,
}: Props) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </legend>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition ${
              value === opt
                ? "border-ceipa-500 bg-ceipa-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="mt-0.5 h-4 w-4 accent-ceipa-600"
            />
            <span className="text-sm text-slate-700">{opt}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </fieldset>
  );
}
