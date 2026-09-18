import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export type UserRole = "staff" | "parent" | "admin";

export interface CurrentUser {
  id: string;
  fullName: string;
  role: UserRole;
  daycareId: string | null;
  initials: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, role, daycare_id")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  const nameParts = profile.full_name?.split(" ") ?? [];
  const initials =
    nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0]?.[0]?.toUpperCase() ?? "?";

  return {
    id: profile.id,
    fullName: profile.full_name ?? "Usuario",
    role: profile.role as UserRole,
    daycareId: profile.daycare_id,
    initials,
  };
}
