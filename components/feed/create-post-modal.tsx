"use client";

import { useEffect, useState } from "react";
import { children, AvatarColor } from "@/data/mock/kids";
import { postTypeLabels, postTypeColors, PostType } from "@/data/mock/feed";

const avatarBgMap: Record<AvatarColor, string> = {
  [AvatarColor.Sky]: "#A9D9E8",
  [AvatarColor.SkyText]: "#1F7A93",
  [AvatarColor.Pink]: "#F4B8CC",
  [AvatarColor.PinkText]: "#C44A7A",
  [AvatarColor.Green]: "#B9DEC4",
  [AvatarColor.GreenText]: "#3E8B62",
  [AvatarColor.Yellow]: "#F4DC8E",
  [AvatarColor.YellowText]: "#9A7B1E",
  [AvatarColor.Purple]: "#C9B6E8",
  [AvatarColor.PurpleText]: "#7B5FC0",
};

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [allRoom, setAllRoom] = useState(false);
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [description, setDescription] = useState("");

  const resetState = () => {
    setSelectedChildren([]);
    setAllRoom(false);
    setSelectedType(null);
    setDescription("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetState();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleChildToggle = (id: string) => {
    setAllRoom(false);
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleAllRoomToggle = () => {
    setAllRoom(true);
    setSelectedChildren([]);
  };

  const handleTypeToggle = (type: PostType) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 px-6 py-10"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[580px] overflow-hidden rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
          <button
            type="button"
            onClick={handleClose}
            className="text-[15px] font-bold text-[#94887B]"
          >
            Cancelar
          </button>
          <span className="font-display text-[18px] font-semibold text-cocoa">
            Nueva publicación
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="text-[15px] font-extrabold text-[#D9583C]"
          >
            Publicar
          </button>
        </div>

        {/* Content */}
        <div className="px-[26px] py-6">
          {/* PARA */}
          <div className="mb-2.5 text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            PARA
          </div>
          <div className="mb-[22px] flex flex-wrap gap-[9px]">
            {children.map((child) => {
              const isActive = selectedChildren.includes(child.id);
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => handleChildToggle(child.id)}
                  className={`flex items-center gap-2 rounded-full px-[14px] py-1.5 pl-[6px] text-[14px] font-bold ${
                    isActive
                      ? "border-[1.5px] border-[#3F362E] bg-[#3F362E] text-white"
                      : "border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                  }`}
                >
                  <span
                    className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full font-display text-[13px] font-semibold"
                    style={{
                      backgroundColor: avatarBgMap[child.avatarColor],
                      color: avatarBgMap[child.avatarTextColor],
                    }}
                  >
                    {child.initials}
                  </span>
                  {child.name.split(" ")[0]}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleAllRoomToggle}
              className={`rounded-full px-4 py-1.5 text-[14px] font-bold ${
                allRoom
                  ? "border-[1.5px] border-[#3F362E] bg-[#3F362E] text-white"
                  : "border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
              }`}
            >
              Toda la sala
            </button>
          </div>

          {/* TIPO */}
          <div className="mb-2.5 text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            TIPO
          </div>
          <div className="mb-[22px] flex flex-wrap gap-[9px]">
            {(Object.keys(postTypeLabels) as PostType[]).map((type) => {
              const isActive = selectedType === type;
              const colors = postTypeColors[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeToggle(type)}
                  className="rounded-full px-4 py-2 text-[13.5px] font-extrabold"
                  style={{
                    border: isActive ? "none" : "none",
                    backgroundColor: isActive ? colors.bg : "#FFFDF9",
                    color: isActive ? colors.text : "#6E6359",
                  }}
                >
                  {postTypeLabels[type]}
                </button>
              );
            })}
          </div>

          {/* DESCRIPCIÓN */}
          <div className="mb-2.5 text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            DESCRIPCIÓN
          </div>
          <textarea
            placeholder="Contá cómo le fue hoy…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-[22px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-3.5 text-[15px] leading-[1.5] text-cocoa placeholder:text-[#B6A99B]"
            style={{ minHeight: 120, resize: "vertical" }}
          />

          {/* FOTOS */}
          <div className="mb-2.5 text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            FOTOS
          </div>
          <div className="flex gap-3">
            <div className="flex h-[96px] w-[96px] flex-none items-center justify-center rounded-[14px] border border-[#ECE0D0] bg-[#F4ECE1] text-[#CBB89F]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
              </svg>
            </div>
            <div className="flex h-[96px] w-[96px] flex-none cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C5503A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[12px]">Agregar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
