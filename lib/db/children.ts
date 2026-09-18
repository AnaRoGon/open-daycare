import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export interface DBChildRow {
  id: string;
  room_id: string;
  full_name: string;
  birth_date: string;
  enrolled_at: string;
  medical_notes: string | null;
  allergy_tags: string[] | null;
  photo_consent: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  rooms: {
    name: string;
  };
}

export interface RoomGroupDB {
  roomId: string;
  roomName: string;
  children: DBChildRow[];
}

export async function getChildrenByRoom(): Promise<RoomGroupDB[]> {
  const supabase = createClient(await cookies());

  const { data: children, error } = await supabase
    .from("children")
    .select(
      `
      id,
      room_id,
      full_name,
      birth_date,
      enrolled_at,
      medical_notes,
      allergy_tags,
      photo_consent,
      status,
      created_at,
      updated_at,
      rooms!inner(name)
    `,
    )
    .eq("status", "active")
    .order("full_name");

  if (error) {
    console.error("Error fetching children:", error);
    return [];
  }

  const rows = children as unknown as DBChildRow[];

  const roomMap = new Map<string, RoomGroupDB>();

  for (const child of rows) {
    const roomId = child.room_id;
    if (!roomMap.has(roomId)) {
      roomMap.set(roomId, {
        roomId,
        roomName: child.rooms.name,
        children: [],
      });
    }
    roomMap.get(roomId)!.children.push(child);
  }

  return Array.from(roomMap.values()).sort((a, b) =>
    a.roomName.localeCompare(b.roomName),
  );
}
