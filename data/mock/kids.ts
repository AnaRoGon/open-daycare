export enum AllergyType {
  Mani = "MANÍ",
  Lactosa = "LACTOSA",
  None = "",
}

export enum AvatarColor {
  Sky = "#A9D9E8",
  SkyText = "#1F7A93",
  Pink = "#F4B8CC",
  PinkText = "#C44A7A",
  Green = "#B9DEC4",
  GreenText = "#3E8B62",
  Yellow = "#F4DC8E",
  YellowText = "#9A7B1E",
  Purple = "#C9B6E8",
  PurpleText = "#7B5FC0",
}

export enum ParentStatus {
  Active = "activa",
  InvitationSent = "invitacion-enviada",
}

export interface LinkedParent {
  id: string;
  name: string;
  initials: string;
  role: string;
  status: ParentStatus;
}

export interface Child {
  id: string;
  name: string;
  initials: string;
  age: string;
  classroom: string;
  birthday: string;
  enrollmentDate: string;
  allergy: AllergyType;
  allergyNotes?: string;
  parents: LinkedParent[];
  avatarColor: AvatarColor;
  avatarTextColor: AvatarColor;
}

export const children: Child[] = [
  {
    id: "mateo-fernandez",
    name: "Mateo Fernández",
    initials: "M",
    age: "3 años",
    classroom: "Soles",
    birthday: "12 mar 2022",
    enrollmentDate: "feb 2025",
    allergy: AllergyType.Mani,
    allergyNotes:
      "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    parents: [
      {
        id: "lucia-fernandez",
        name: "Lucía Fernández",
        initials: "L",
        role: "Mamá",
        status: ParentStatus.Active,
      },
      {
        id: "diego-fernandez",
        name: "Diego Fernández",
        initials: "D",
        role: "Papá",
        status: ParentStatus.InvitationSent,
      },
    ],
    avatarColor: AvatarColor.Sky,
    avatarTextColor: AvatarColor.SkyText,
  },
  {
    id: "sofia-mendez",
    name: "Sofía Méndez",
    initials: "S",
    age: "2 años",
    classroom: "Soles",
    birthday: "5 ago 2023",
    enrollmentDate: "mar 2025",
    allergy: AllergyType.None,
    parents: [
      {
        id: "carolina-mendez",
        name: "Carolina Méndez",
        initials: "C",
        role: "Mamá",
        status: ParentStatus.Active,
      },
    ],
    avatarColor: AvatarColor.Pink,
    avatarTextColor: AvatarColor.PinkText,
  },
  {
    id: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    initials: "B",
    age: "3 años",
    classroom: "Soles",
    birthday: "22 ene 2022",
    enrollmentDate: "feb 2025",
    allergy: AllergyType.None,
    parents: [
      {
        id: "valeria-ruiz",
        name: "Valeria Ruiz",
        initials: "V",
        role: "Mamá",
        status: ParentStatus.Active,
      },
      {
        id: "martin-ruiz",
        name: "Martín Ruiz",
        initials: "M",
        role: "Papá",
        status: ParentStatus.Active,
      },
    ],
    avatarColor: AvatarColor.Green,
    avatarTextColor: AvatarColor.GreenText,
  },
  {
    id: "valentina-soto",
    name: "Valentina Soto",
    initials: "V",
    age: "2 años",
    classroom: "Soles",
    birthday: "14 nov 2023",
    enrollmentDate: "abr 2025",
    allergy: AllergyType.None,
    parents: [],
    avatarColor: AvatarColor.Yellow,
    avatarTextColor: AvatarColor.YellowText,
  },
  {
    id: "tomas-diaz",
    name: "Tomás Díaz",
    initials: "T",
    age: "3 años",
    classroom: "Soles",
    birthday: "30 jul 2022",
    enrollmentDate: "feb 2025",
    allergy: AllergyType.Lactosa,
    allergyNotes:
      "Intolerancia a la lactosa. Llevar leche de avena para la merienda.",
    parents: [
      {
        id: "paula-diaz",
        name: "Paula Díaz",
        initials: "P",
        role: "Mamá",
        status: ParentStatus.Active,
      },
    ],
    avatarColor: AvatarColor.Purple,
    avatarTextColor: AvatarColor.PurpleText,
  },
  {
    id: "emma-castro",
    name: "Emma Castro",
    initials: "E",
    age: "2 años",
    classroom: "Soles",
    birthday: "18 sep 2023",
    enrollmentDate: "mar 2025",
    allergy: AllergyType.None,
    parents: [
      {
        id: "andrea-castro",
        name: "Andrea Castro",
        initials: "A",
        role: "Mamá",
        status: ParentStatus.Active,
      },
    ],
    avatarColor: AvatarColor.Pink,
    avatarTextColor: AvatarColor.PinkText,
  },
  {
    id: "lucas-romero",
    name: "Lucas Romero",
    initials: "L",
    age: "3 años",
    classroom: "Soles",
    birthday: "7 abr 2022",
    enrollmentDate: "feb 2025",
    allergy: AllergyType.None,
    parents: [
      {
        id: "javier-romero",
        name: "Javier Romero",
        initials: "J",
        role: "Papá",
        status: ParentStatus.Active,
      },
    ],
    avatarColor: AvatarColor.Sky,
    avatarTextColor: AvatarColor.SkyText,
  },
  {
    id: "olivia-vega",
    name: "Olivia Vega",
    initials: "O",
    age: "2 años",
    classroom: "Soles",
    birthday: "25 dic 2023",
    enrollmentDate: "abr 2025",
    allergy: AllergyType.None,
    parents: [
      {
        id: "marta-vega",
        name: "Marta Vega",
        initials: "M",
        role: "Mamá",
        status: ParentStatus.Active,
      },
    ],
    avatarColor: AvatarColor.Green,
    avatarTextColor: AvatarColor.GreenText,
  },
];
