"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function login(email: string, password: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "Email o contraseña incorrectos" };
  }

  return { success: true, error: undefined };
}

export async function logout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  const { redirect } = await import("next/navigation");
  redirect("/login");
}
