import { classroom, user } from "@/data/mock/feed";

export function Greeting() {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="mb-6">
      <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-coral-deep">
        GUARDERÍA · {classroom.name.toUpperCase()}
      </div>
      <h1 className="font-display text-[30px] font-semibold text-cocoa">
        Buenas, {firstName}
      </h1>
      <p className="mt-[5px] text-[14.5px] text-taupe">
        {classroom.childrenCount} niños · {classroom.date}
      </p>
    </div>
  );
}
