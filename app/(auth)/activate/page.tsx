"use client";

import { useState } from "react";
import Link from "next/link";

export default function ActivatePage() {
  const [password, setPassword] = useState("contraseña");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF4EC] px-5 py-10">
      <div className="w-full max-w-[440px]">
        {/* Icon */}
        <div className="w-[58px] h-[58px] rounded-[18px] bg-gradient-to-br from-[#F8C3A8] to-[#F2937A] flex items-center justify-center mb-5.5 shadow-[0_12px_26px_-10px_rgba(238,129,100,0.65)]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </div>

        {/* Welcome heading */}
        <h1 className="font-display font-semibold text-[32px] leading-[1.15] mb-2 text-[#3F362E]">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mb-6.5 text-[#94887B] text-[15.5px] leading-relaxed">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta.
        </p>

        {/* Child info card */}
        <div className="flex items-center gap-3.5 bg-white border border-[#EADFD0] rounded-[16px] px-4 py-3.5 mb-5.5">
          <div className="w-11 h-11 rounded-full bg-[#A9D9E8] text-[#1F7A93] font-display font-semibold text-lg flex items-center justify-center">
            M
          </div>
          <div>
            <div className="text-[13px] text-[#94887B]">Te invitaron a seguir a</div>
            <div className="font-display font-semibold text-lg text-[#3F362E]">Mateo · Sala Soles</div>
          </div>
        </div>

        {/* Invitation code */}
        <div className="text-[11px] font-bold tracking-[0.7px] text-[#94887B] mb-2">
          CÓDIGO DE INVITACIÓN
        </div>
        <input
          value="7K4P9"
          readOnly
          className="w-full px-4 py-3.5 rounded-[14px] border border-[#EADFD0] bg-white text-[#3F362E] text-lg tracking-[3px] font-bold font-display mb-4.5"
        />

        {/* Email */}
        <div className="text-[11px] font-bold tracking-[0.7px] text-[#94887B] mb-2">
          EMAIL
        </div>
        <input
          type="email"
          value="lucia.fernandez@gmail.com"
          readOnly
          className="w-full px-4 py-3.5 rounded-[14px] border border-[#EADFD0] bg-white text-[#3F362E] text-sm mb-4.5"
        />

        {/* Create password */}
        <div className="text-[11px] font-bold tracking-[0.7px] text-[#94887B] mb-2">
          CREAR CONTRASEÑA
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3.5 rounded-[14px] border border-[#F2A78E] bg-white text-[#3F362E] text-sm mb-4.5"
        />

        {/* Photo authorization checkbox */}
        <label className="flex items-start gap-3 bg-[#FBF1D6] rounded-[14px] px-4 py-3.5 mb-6 cursor-pointer">
          <span className="flex-none w-6 h-6 rounded-[8px] bg-[#5FB97E] flex items-center justify-center mt-0.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="text-sm text-[#8A7234] leading-relaxed">
            Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.
          </span>
        </label>

        {/* Activate button */}
        <button
          type="button"
          className="w-full py-4 rounded-[15px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-extrabold text-base cursor-pointer shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
        >
          Activar mi cuenta
        </button>

        {/* Footer link */}
        <p className="text-center mt-5.5 text-[#94887B] text-[14.5px]">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-[#C5503A] font-extrabold">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
