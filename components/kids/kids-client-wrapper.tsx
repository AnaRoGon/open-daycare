"use client";

import { useState } from "react";
import { KidCard, type KidCardChild } from "@/components/kids/kid-card";
import { AddChildModal } from "@/components/kids/add-child-modal";
import { mapChildToUI } from "@/lib/ui/child-formatters";
import type { RoomGroupDB } from "@/lib/db/children";

interface KidsClientWrapperProps {
  roomGroups: RoomGroupDB[];
}

export function KidsClientWrapper({ roomGroups }: KidsClientWrapperProps) {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const allChildren = roomGroups.flatMap((group) =>
    group.children.map((child) => ({
      ...mapChildToUI(child),
      parentCount: 0,
    })),
  );

  const filteredRooms = roomGroups
    .map((group) => ({
      ...group,
      children: group.children.filter((child) => {
        const ui = mapChildToUI(child);
        return ui.name.toLowerCase().includes(query.toLowerCase());
      }),
    }))
    .filter((group) => group.children.length > 0);


  return (
    <>
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

        {allChildren.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-[48px]">👶</div>
            <h2 className="font-display text-[22px] font-semibold text-cocoa">
              No hay niños registrados
            </h2>
            <p className="mt-2 max-w-[400px] text-[15px] text-sand">
              Aún no se han agregado niños a este jardín. Usa el botón
              &quot;Agregar niño&quot; para registrar el primero.
            </p>
          </div>
        ) : filteredRooms.length === 0 && query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-[48px]">🔍</div>
            <h2 className="font-display text-[22px] font-semibold text-cocoa">
              Sin resultados
            </h2>
            <p className="mt-2 max-w-[400px] text-[15px] text-sand">
              No se encontraron niños que coincidan con &quot;{query}&quot;.
            </p>
          </div>
        ) : (
          filteredRooms.map((group) => (
            <div key={group.roomId} className="mb-6 last:mb-0">
              <div className="mb-3.5 flex items-center gap-3">
                <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-cocoa uppercase">
                  {group.roomName}
                </span>
                <span className="text-[13px] text-sand">
                  {group.children.length}{" "}
                  {group.children.length === 1 ? "niño" : "niños"}
                </span>
                <span className="h-px flex-1 bg-[#E7DAC8]" />
              </div>

              <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
                {group.children.map((child) => {
                  const ui = mapChildToUI(child);
                  return (
                    <KidCard
                      key={ui.id}
                      child={
                        {
                          ...ui,
                          parentCount: 0,
                        } as KidCardChild
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}

        <AddChildModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </>
  );
}
