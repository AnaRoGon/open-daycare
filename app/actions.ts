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

export interface RoomOption {
  id: string;
  name: string;
}

export async function getRooms(): Promise<RoomOption[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("rooms")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }

  return data as RoomOption[];
}

export interface CreateChildInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  roomId: string;
  allergyTags: string[];
  medicalNotes: string;
}

export async function createChild(input: CreateChildInput) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("children").insert({
    full_name: input.fullName.trim(),
    birth_date: input.birthDate,
    room_id: input.roomId,
    enrolled_at: new Date().toISOString().split("T")[0],
    medical_notes: input.medicalNotes.trim() || null,
    allergy_tags: input.allergyTags.length > 0 ? input.allergyTags : null,
    photo_consent: true,
    status: "active",
  });

  if (error) {
    console.error("Error creating child:", error);
    return { success: false, error: "No se pudo registrar el niño. Inténtalo de nuevo." };
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/kids");

  return { success: true, error: undefined };
}
