"use client";

import { useEffect, useRef, useState } from "react";

interface LinkParentModalProps {
  open: boolean;
  childName: string;
  onClose: () => void;
}

export function LinkParentModal({
  open,
  childName,
  onClose,
}: LinkParentModalProps) {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [parentesco, setParentesco] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const parentNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && parentNameRef.current) {
      parentNameRef.current.focus();
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

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    if (!parentName.trim()) newErrors.parentName = true;
    if (!email.trim()) newErrors.email = true;
    if (!parentesco) newErrors.parentesco = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onClose();
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  if (!open) return null;

  const parentescoOptions = ["Mamá", "Papá", "Tutor/a"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 py-10"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
          <div>
            <div className="font-display text-[18px] font-semibold text-cocoa">
              Vincular padre
            </div>
            <div className="text-[13px] text-[#A89A8B]">a {childName}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] bg-[#F0E6D8] text-[#94887B] transition-colors hover:text-[#7A6F64] active:text-[#6B6158]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-[26px] py-[22px]">
          {/* Info banner */}
          <div className="mb-5 flex gap-[11px] rounded-[14px] bg-[#E3ECFB] p-[13px]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4E72C8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-[1px] flex-none"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span className="text-[13.5px] leading-[1.45] text-[#3F5694]">
              Le enviaremos un correo con un código para que active su cuenta.
              Solo verá el feed de {childName}.
            </span>
          </div>

          {/* Nombre del padre/madre */}
          <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            NOMBRE DEL PADRE/MADRE
          </label>
          <input
            ref={parentNameRef}
            type="text"
            value={parentName}
            onChange={(e) => {
              setParentName(e.target.value);
              clearError("parentName");
            }}
            placeholder="Ej. Diego Fernández"
            className={`mb-[18px] w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3 text-[15px] text-cocoa placeholder:text-[#B6A99B] ${
              errors.parentName
                ? "border-[#D9583C]"
                : "border-[#EADFD0] focus:border-[#D9583C]"
            }`}
          />

          {/* Email */}
          <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            placeholder="correo@ejemplo.com"
            className={`mb-[18px] w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3 text-[15px] text-cocoa placeholder:text-[#B6A99B] ${
              errors.email
                ? "border-[#D9583C]"
                : "border-[#EADFD0] focus:border-[#D9583C]"
            }`}
          />

          {/* Parentesco */}
          <label className="mb-[10px] block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            PARENTESCO
          </label>
          <div className="mb-5 flex gap-[9px]">
            {parentescoOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setParentesco(option);
                  clearError("parentesco");
                }}
                className={`flex-1 rounded-full border-[1.5px] px-[11px] py-[11px] text-[14px] font-extrabold transition-all ${
                  parentesco === option
                    ? "border-[#9FB8EC] bg-[#CCD8F4] text-[#4E72C8]"
                    : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {errors.parentesco && (
            <div className="-mt-4 mb-4 text-[12px] text-[#D9583C]">
              Selecciona un parentesco
            </div>
          )}

          {/* Invitation code */}
          <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-[#E6D08A] bg-[#FBF1D6] p-[18px] text-center">
            <div className="mb-2 text-[12px] font-extrabold tracking-[0.7px] text-[#A88526]">
              CÓDIGO DE INVITACIÓN
            </div>
            <div className="font-display text-[34px] font-semibold tracking-[7px] text-[#8A7234]">
              7K4P9
            </div>
            <div className="mt-[6px] text-[13px] text-[#A88526]">
              Vence en 7 días
            </div>
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] px-[14px] py-[14px] text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] transition-opacity hover:opacity-90 active:opacity-85"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="M22 2 11 13" />
            </svg>
            Enviar invitación
          </button>
        </div>
      </div>
    </div>
  );
}
