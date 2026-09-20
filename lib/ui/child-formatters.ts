import type { DBChildRow } from "@/lib/db/children";
import type { LinkedParentDB, PendingInvitationDB } from "@/lib/db/children";

export interface ChildUI {
  id: string;
  name: string;
  initials: string;
  age: string;
  classroom: string;
  birthday: string;
  enrollmentDate: string;
  allergy: string;
  allergyNotes: string;
  avatarColor: string;
  avatarTextColor: string;
}

const AVATAR_COLORS = [
  { bg: "#A9D9E8", text: "#1F7A93" },
  { bg: "#F4B8CC", text: "#C44A7A" },
  { bg: "#B9DEC4", text: "#3E8B62" },
  { bg: "#F4DC8E", text: "#9A7B1E" },
  { bg: "#C9B6E8", text: "#7B5FC0" },
];

export function calculateAge(birthDate: Date): string {
  const now = new Date();
  const years = now.getFullYear() - birthDate.getFullYear();
  return `${years} ${years === 1 ? "año" : "años"}`;
}

export function formatBirthday(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatEnrollmentDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
}

export function getInitials(fullName: string): string {
  return fullName.charAt(0).toUpperCase();
}

export function getAvatarColors(name: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export interface ParentUI {
  id: string;
  name: string;
  initials: string;
  role: string;
  status: string;
  avatarColor: string;
  avatarTextColor: string;
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  father: "Papá",
  mother: "Mamá",
  guardian: "Tutor",
};

export function mapParentToUI(parent: LinkedParentDB): ParentUI {
  const colors = getAvatarColors(parent.full_name);
  const role = RELATIONSHIP_LABELS[parent.relationship] ?? parent.relationship;
  const status = parent.status === "active" ? "activa" : "invitación enviada";

  return {
    id: parent.parent_id,
    name: parent.full_name,
    initials: getInitials(parent.full_name),
    role,
    status,
    avatarColor: colors.bg,
    avatarTextColor: colors.text,
  };
}

export function mapInvitationToUI(invitation: PendingInvitationDB): ParentUI {
  const colors = getAvatarColors(invitation.full_name);
  const role =
    RELATIONSHIP_LABELS[invitation.relationship] ?? invitation.relationship;

  return {
    id: invitation.id,
    name: invitation.full_name,
    initials: getInitials(invitation.full_name),
    role,
    status: "invitación enviada",
    avatarColor: colors.bg,
    avatarTextColor: colors.text,
  };
}

export function mapChildToUI(child: DBChildRow): ChildUI {
  const birthDate = new Date(child.birth_date);
  const enrolledDate = new Date(child.enrolled_at);
  const colors = getAvatarColors(child.full_name);

  return {
    id: child.id,
    name: child.full_name,
    initials: getInitials(child.full_name),
    age: calculateAge(birthDate),
    classroom: child.rooms.name,
    birthday: formatBirthday(birthDate),
    enrollmentDate: formatEnrollmentDate(enrolledDate),
    allergy: child.allergy_tags && child.allergy_tags.length > 0 ? "ALERGIA" : "",
    allergyNotes: child.allergy_tags && child.allergy_tags.length > 0
      ? child.allergy_tags.join(", ")
      : child.medical_notes ?? "",
    avatarColor: colors.bg,
    avatarTextColor: colors.text,
  };
}
