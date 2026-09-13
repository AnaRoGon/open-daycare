"use client";

import { useState } from "react";
import { LinkParentModal } from "@/components/kids/link-parent-modal";

interface LinkedParentsSectionProps {
  childName: string;
  parents: {
    id: string;
    name: string;
    initials: string;
    role: string;
    status: string;
  }[];
}

export function LinkedParentsSection({
  childName,
  parents,
}: LinkedParentsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="rounded-[16px] border border-linen bg-card p-[18px]">
        <div className="mb-[14px] text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
          PADRES VINCULADOS
        </div>
        <div className="flex flex-col gap-[14px]">
          {parents.map((parent) => (
            <div key={parent.id} className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full font-display text-[16px] font-semibold text-white"
                style={{ backgroundColor: "#C9B6E8" }}
              >
                {parent.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-extrabold text-cocoa">
                  {parent.name}
                </div>
                <div className="text-[12.5px] text-sand">
                  {parent.role} &middot; {parent.status}
                </div>
              </div>
              <span
                className={`flex-none text-[10.5px] font-extrabold rounded-full px-[9px] py-[4px] ${
                  parent.status === "activa"
                    ? "bg-[#CFEBD8] text-[#3E9B6C]"
                    : "bg-[#F7E7A6] text-[#9A7B1E]"
                }`}
              >
                {parent.status === "activa" ? "ACTIVA" : "PENDIENTE"}
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-3 pt-2"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
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
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="text-[14.5px] font-extrabold text-[#C5503A]">
              Vincular otro padre
            </span>
          </button>
        </div>
      </div>

      <LinkParentModal
        open={modalOpen}
        childName={childName}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
