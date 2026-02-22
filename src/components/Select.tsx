"use client";

import { SHIKI_THEMES } from "@/shiki-loader/themes";

const DEFAULT_THEME_OPTIONS = SHIKI_THEMES.map((theme) => ({
  label: theme.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  value: theme,
}));

export default function Select({
  label,
  value,
  onChange,
  options = DEFAULT_THEME_OPTIONS,
  allowEmpty = false,
  optionalText,
}: {
  label: string;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: { label: string; value: string }[];
  allowEmpty?: boolean;
  optionalText?: string;
}) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <select className="select w-full" value={value ?? ""} onChange={onChange}>
        {allowEmpty ? (
          <option value="">None</option>
        ) : (
          <option disabled value="">
            Pick a theme
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {Boolean(optionalText) && <span className="label">{optionalText}</span>}
    </fieldset>
  );
}
