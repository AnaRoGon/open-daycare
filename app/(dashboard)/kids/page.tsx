"use client";

import { KidCard } from "@/components/kids/kid-card";
import { AddChildModal } from "@/components/kids/add-child-modal";
import { children } from "@/data/mock/kids";
import { useState } from "react";

export default function KidsPage() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = children.filter((child) =>
    child.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-[880px] px-5 pb-20 pt-[34px] lg:px-10">
      <div className="mb-[22px] flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C]">
            GESTIÓN
          </div>
          <h1 className="font-display m-0 text-[30px] font-semibold text-cocoa">
            Niños
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] px-[18px] py-[11px] font-extrabold text-[14.5px] text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)]"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar niño
        </button>
      </div>

      <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-linen bg-card px-4 py-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B0A290"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          placeholder="Buscar niño…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-none bg-none text-[15px] text-cocoa placeholder:text-sand focus:outline-none"
        />
      </div>

      <div className="mb-3.5 flex items-center gap-3">
        <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-cocoa">
          SALA SOLES
        </span>
        <span className="text-[13px] text-sand">
          {filtered.length} {filtered.length === 1 ? "niño" : "niños"}
        </span>
        <span className="h-px flex-1 bg-[#E7DAC8]" />
      </div>

      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
        {filtered.map((child) => (
          <KidCard key={child.id} child={child} />
        ))}
      </div>

      <AddChildModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
