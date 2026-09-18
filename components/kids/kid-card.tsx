import Link from "next/link";

export interface KidCardChild {
  id: string;
  name: string;
  initials: string;
  age: string;
  avatarColor: string;
  avatarTextColor: string;
  allergy: string;
  parentCount?: number;
  parents?: { length: number };
}

interface KidCardProps {
  child: KidCardChild;
}

export function KidCard({ child }: KidCardProps) {
  const parentCount = child.parentCount ?? child.parents?.length ?? 0;
  const parentLabel =
    parentCount === 0
      ? "sin padres vinculados"
      : parentCount === 1
        ? "1 padre vinculado"
        : `${parentCount} padres vinculados`;

  return (
    <Link
      href={`/kids/${child.id}`}
      className="flex items-center gap-[14px] min-w-0 bg-card border border-linen rounded-[18px] p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)] transition-[transform,border-color] duration-150 hover:-translate-y-[2px] hover:border-[#F2A78E]"
    >
      <div
        className="w-12 h-12 rounded-full flex-none flex items-center justify-center font-display font-semibold text-[19px]"
        style={{
          backgroundColor: child.avatarColor,
          color: child.avatarTextColor,
        }}
      >
        {child.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-[16px] text-cocoa truncate">
          {child.name}
        </div>
        <div className="text-[13px] text-sand">
          {child.age} &middot; {parentLabel}
        </div>
      </div>
      {child.allergy ? (
        <span className="flex-none text-[11px] font-extrabold px-[9px] py-[5px] rounded-full bg-[#FBD8CC] text-[#D9684A]">
          {child.allergy}
        </span>
      ) : (
        <svg
          className="flex-none"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CBB89F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </Link>
  );
}
