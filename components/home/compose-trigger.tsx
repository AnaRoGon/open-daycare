import { user } from "@/data/mock/feed";

export function ComposeTrigger() {
  return (
    <div className="mb-6 flex cursor-pointer items-center gap-3.5 rounded-[18px] border border-linen bg-card px-[18px] py-3.5 shadow-[0_4px_14px_-10px_rgba(120,90,60,0.4)]">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#F2937A] font-display text-[16px] font-semibold text-white">
        {user.initials}
      </div>
      <span className="flex-1 text-[15px] text-sand">Compartí un momento…</span>
      <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[12px] bg-blush text-coral">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </span>
    </div>
  );
}
