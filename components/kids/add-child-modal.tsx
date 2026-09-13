"use client";

import { useEffect, useRef, useState } from "react";

interface AddChildModalProps {
  open: boolean;
  onClose: () => void;
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function AddChildModal({ open, onClose }: AddChildModalProps) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [classroom, setClassroom] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && nameRef.current) {
      nameRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleBirthdayChange = (raw: string) => {
    setBirthday(formatDateInput(raw));
  };

  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    if (!name.trim()) newErrors.name = true;
    if (!birthday.trim()) newErrors.birthday = true;
    if (!classroom) newErrors.classroom = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 py-10"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[15px] font-bold text-[#94887B] transition-colors hover:text-[#7A6F64] active:text-[#6B6158]"
          >
            Cancelar
          </button>
          <span className="font-display text-[18px] font-semibold text-cocoa">
            Agregar niño
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="cursor-pointer text-[15px] font-extrabold text-[#D9583C] transition-colors hover:text-[#C44A2E] active:text-[#B03F25]"
          >
            Guardar
          </button>
        </div>

        {/* Form */}
        <div className="px-[26px] py-6">
          {/* Nombre completo */}
          <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            NOMBRE COMPLETO
          </label>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
            }}
            placeholder="Ej. Martina López"
            className={`mb-[18px] w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3 text-[15px] text-cocoa placeholder:text-[#B6A99B] ${
              errors.name
                ? "border-[#D9583C]"
                : "border-[#EADFD0] focus:border-[#D9583C]"
            }`}
          />

          {/* Fecha de nacimiento + Sala */}
          <div className="mb-[18px] flex flex-col gap-[14px] sm:flex-row">
            <div className="flex-1">
              <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
                FECHA DE NACIMIENTO
              </label>
              <input
                type="text"
                value={birthday}
                onChange={(e) => handleBirthdayChange(e.target.value)}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3 text-[15px] text-cocoa placeholder:text-[#B6A99B] ${
                  errors.birthday
                    ? "border-[#D9583C]"
                    : "border-[#EADFD0] focus:border-[#D9583C]"
                }`}
              />
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
                SALA
              </label>
              <div className="relative">
                <select
                  value={classroom}
                  onChange={(e) => {
                    setClassroom(e.target.value);
                    if (errors.classroom)
                      setErrors((prev) => ({ ...prev, classroom: false }));
                  }}
                  className={`w-full appearance-none rounded-[14px] border-[1.5px] bg-white px-4 py-3 pr-10 text-[15px] text-cocoa ${
                    !classroom ? "text-[#B6A99B]" : ""
                  } ${
                    errors.classroom
                      ? "border-[#D9583C]"
                      : "border-[#EADFD0] focus:border-[#D9583C]"
                  }`}
                >
                  <option value="" disabled>
                    Seleccionar sala
                  </option>
                  <option value="Soles">Soles</option>
                  <option value="Hojas Verdes">Hojas Verdes</option>
                  <option value="Arcoiris">Arcoiris</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B0A290"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Alergias */}
          <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            ALERGIAS (ETIQUETAS)
          </label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Ej. Maní, Lactosa"
            className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-3 text-[15px] text-cocoa placeholder:text-[#B6A99B]"
          />

          {/* Notas médicas */}
          <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            NOTAS MÉDICAS
          </label>
          <textarea
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            placeholder="Indicaciones, medicación, contactos…"
            rows={3}
            className="min-h-[90px] w-full resize-y rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-3 text-[15px] leading-relaxed text-cocoa placeholder:text-[#B6A99B]"
          />
        </div>
      </div>
    </div>
  );
}
