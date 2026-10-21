"use client";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";

// ── QUESTION TITLE ──
export function QuestionTitle({
  number,
  text,
  hint,
}: {
  number?: string;
  text: string;
  hint?: string;
}) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold leading-7" style={{ color: "#0A1F14" }}>
        {number && (
          <span className="mr-2" style={{ color: "#9A7A2E" }}>
            {number}.
          </span>
        )}
        {text}
      </h3>

      {hint && (
        <p className="mt-1 text-xs" style={{ color: "#9A7A2E" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ── TEXT FIELD ──
export function TextField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  type = "text",
}: {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium leading-6" style={{ color: "#0A1F14" }}>
        {label}
      </label>

      <input
        {...register(name)}
        type={type}
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none transition focus:ring-2 focus:ring-[#C9A84C]/30"
        style={{ borderColor: error ? "#ef4444" : "rgba(10,31,20,0.15)" }}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── TEXT AREA (for longer answers) ──
export function TextAreaField<T extends FieldValues>({
  number,
  question,
  hint,
  name,
  register,
  error,
  rows = 4,
}: {
  number?: string;
  question: string;
  hint?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  rows?: number;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5 md:p-6">
      <QuestionTitle number={number} text={question} hint={hint} />

      <textarea
        {...register(name)}
        rows={rows}
        className="mt-5 w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none transition focus:ring-2 focus:ring-[#C9A84C]/30"
        style={{ borderColor: error ? "#ef4444" : "rgba(10,31,20,0.15)" }}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── ONE ANSWER (radio) ──
export function RadioQuestion<T extends FieldValues>({
  number,
  question,
  hint,
  name,
  options,
  register,
  error,
  otherName,
}: {
  number: string;
  question: string;
  hint?: string;
  name: Path<T>;
  options: string[];
  register: UseFormRegister<T>;
  error?: string;
  otherName?: Path<T>;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5 md:p-6">
      <QuestionTitle number={number} text={question} hint={hint} />

      <div className="mt-5 space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition hover:bg-[#F0F7F2]"
          >
            <input
              {...register(name)}
              type="radio"
              value={option}
              className="mt-1 h-4 w-4 accent-[#9A7A2E]"
            />
            <span className="text-sm leading-6" style={{ color: "rgba(10,31,20,0.78)" }}>
              {option}
            </span>
          </label>
        ))}

        {otherName && (
          <div className="flex items-center gap-3 px-3 pt-2">
            <span className="text-sm">Other:</span>
            <input
              {...register(otherName)}
              type="text"
              className="flex-1 border-b border-black/20 bg-transparent px-2 py-2 text-sm outline-none focus:border-[#C9A84C]"
            />
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── SEVERAL ANSWERS (checkbox) ──
export function CheckboxQuestion<T extends FieldValues>({
  number,
  question,
  hint,
  name,
  options,
  register,
  error,
  otherName,
}: {
  number: string;
  question: string;
  hint?: string;
  name: Path<T>;
  options: string[];
  register: UseFormRegister<T>;
  error?: string;
  otherName?: Path<T>;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5 md:p-6">
      <QuestionTitle number={number} text={question} hint={hint} />

      <div className="mt-5 space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition hover:bg-[#F0F7F2]"
          >
            <input
              {...register(name)}
              type="checkbox"
              value={option}
              className="mt-1 h-4 w-4 rounded accent-[#9A7A2E]"
            />
            <span className="text-sm leading-6" style={{ color: "rgba(10,31,20,0.78)" }}>
              {option}
            </span>
          </label>
        ))}

        {otherName && (
          <div className="flex items-center gap-3 px-3 pt-2">
            <span className="text-sm">Other:</span>
            <input
              {...register(otherName)}
              type="text"
              className="flex-1 border-b border-black/20 bg-transparent px-2 py-2 text-sm outline-none focus:border-[#C9A84C]"
            />
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  );
}