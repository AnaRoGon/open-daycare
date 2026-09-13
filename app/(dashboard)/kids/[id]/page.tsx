import { children } from "@/data/mock/kids";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkedParentsSection } from "@/components/kids/linked-parents-section";

interface KidsProfileProps {
  params: Promise<{ id: string }>;
}

export default async function KidsProfile({ params }: KidsProfileProps) {
  const { id } = await params;
  const child = children.find((c) => c.id === id);

  if (!child) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[820px] px-5 pb-20 pt-[34px] lg:px-10">
      <Link
        href="/kids"
        className="mb-5 flex items-center gap-[7px] text-[14px] font-semibold text-taupe"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
        Volver a Niños
      </Link>

      <div className="flex flex-col gap-[26px] lg:flex-row lg:items-start">
        {/* Left column */}
        <div className="flex w-full flex-col gap-[18px] lg:min-w-[300px] lg:flex-1">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-[18px]">
            <div className="flex items-center gap-[18px]">
              <div
                className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-full font-display text-[34px] font-semibold"
                style={{
                  backgroundColor: child.avatarColor,
                  color: child.avatarTextColor,
                }}
              >
                {child.initials}
              </div>
              <div className="flex-1">
                <h1 className="font-display m-0 text-[28px] font-semibold text-cocoa">
                  {child.name}
                </h1>
                <p className="m-0 mt-[3px] text-[15px] text-taupe">
                  {child.age} &middot; Sala {child.classroom}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="self-start rounded-[12px] border-[1.5px] border-linen bg-card px-4 py-[9px] font-semibold text-[14px] text-mocha"
            >
              Editar
            </button>
          </div>

          {child.allergy && (
            <div className="flex gap-[14px] rounded-[16px] bg-[#FBDAD6] p-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[#F4A8A0]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
              </div>
              <div>
                <div className="mb-[2px] text-[15px] font-extrabold text-[#C5413A]">
                  Alergias y notas
                </div>
                <div className="text-[14.5px] leading-relaxed text-[#B25249]">
                  {child.allergyNotes}
                </div>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-[16px] border border-linen bg-card">
            <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
              <span className="text-[14.5px] text-taupe">
                Fecha de nacimiento
              </span>
              <span className="text-[14.5px] font-extrabold text-cocoa">
                {child.birthday}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
              <span className="text-[14.5px] text-taupe">Sala</span>
              <span className="text-[14.5px] font-extrabold text-cocoa">
                {child.classroom}
              </span>
            </div>
            <div className="flex justify-between px-[18px] py-[15px]">
              <span className="text-[14.5px] text-taupe">Ingreso</span>
              <span className="text-[14.5px] font-extrabold text-cocoa">
                {child.enrollmentDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex w-full flex-col gap-[14px] lg:w-[300px] lg:flex-none">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[#3F362E] px-[13px] py-[13px] font-extrabold text-[15px] text-white"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            Resumen del día
          </button>

          <LinkedParentsSection
            childName={child.name}
            parents={child.parents}
          />
        </div>
      </div>
    </div>
  );
}
