"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [role] = useState<"staff" | "parent">("staff");
  const [email, setEmail] = useState("caro@opendaycare.com");
  const [password, setPassword] = useState("");

  // Role state tracked for future use — no UI toggle shown
  void role;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FBF4EC]">
      {/* Branding panel — hidden on mobile */}
      <div className="hidden lg:flex relative flex-col justify-between p-14 xl:p-[56px_60px] text-white overflow-hidden bg-gradient-to-br from-[#F6A98E] via-[#F2937A] to-[#EC7E62]">
        {/* Decorative circles */}
        <div className="absolute w-[420px] h-[420px] rounded-full bg-white/12 -top-[140px] -right-[120px]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 -bottom-[110px] -left-[80px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-white/22 flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </div>
          <span className="font-display font-semibold text-xl tracking-wide">OpenDayCare</span>
        </div>

        {/* Headline */}
        <div className="relative">
          <h1 className="font-display font-semibold text-[42px] leading-[1.12] mb-4">
            El día de cada niño,<br />compartido con su familia.
          </h1>
          <p className="text-base leading-relaxed max-w-[430px] text-white/92">
            Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.
          </p>
        </div>

        {/* Classroom */}
        <div className="relative text-sm text-white/90">🌿 Guardería Sala Soles</div>
      </div>

      {/* Login form */}
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-[392px]">
          <h2 className="font-display font-semibold text-3xl mb-1.5 text-[#3F362E]">
            Iniciar sesión
          </h2>
          <p className="mb-7 text-[#94887B] text-sm">
            Ingresá para ver el día de hoy.
          </p>

          {/* Email */}
          <div className="text-[11px] font-bold tracking-[0.7px] text-[#94887B] mb-2">
            EMAIL
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-[14px] border border-[#EADFD0] bg-white text-[#3F362E] text-sm mb-4"
            suppressHydrationWarning
          />

          {/* Password */}
          <div className="text-[11px] font-bold tracking-[0.7px] text-[#94887B] mb-2">
            CONTRASEÑA
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3.5 rounded-[14px] border border-[#EADFD0] bg-white text-[#3F362E] text-sm mb-2.5"
          />

          {/* Forgot password */}
          <div className="text-right mb-5">
            <span className="text-[#C5503A] text-sm font-bold cursor-pointer">
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          {/* Login button */}
          <button
            type="button"
            className="w-full py-4 rounded-[15px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-extrabold text-base cursor-pointer shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
          >
            Iniciar sesión
          </button>

          {/* Footer link */}
          <p className="text-center mt-6 text-[#94887B] text-[14.5px]">
            ¿Te invitó la guardería?{" "}
            <Link href="/activate" className="text-[#C5503A] font-extrabold">
              Activá tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
