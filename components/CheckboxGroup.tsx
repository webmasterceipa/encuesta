"use client";

type Props = {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
  required?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  showOtherField?: boolean;
};

export function CheckboxGroup({
  label,
  options,
  values,
  onChange,
  error,
  required,
  otherValue = "",
  onOtherChange,
  showOtherField = false,
}: Props) {
  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };

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
              values.includes(opt)
                ? "border-ceipa-500 bg-ceipa-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={values.includes(opt)}
              onChange={() => toggle(opt)}
              className="mt-0.5 h-4 w-4 accent-ceipa-600"
            />
            <span className="text-sm text-slate-700">{opt}</span>
          </label>
        ))}
      </div>
      {showOtherField && values.includes("Otro") && (
        <label className="mt-2 block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Especifique otro <span className="text-red-600">*</span>
          </span>
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange?.(e.target.value)}
            className="field-input"
            placeholder="Describa dónde escuchó..."
          />
        </label>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </fieldset>
  );
}
