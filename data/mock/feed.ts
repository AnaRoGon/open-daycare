export type PostType = "logro" | "actividad" | "anuncio";

export interface Post {
  id: string;
  type: PostType;
  author: string;
  initials?: string;
  time: string;
  audience: string;
  body: string;
  photo?: string;
  likes: number;
  comments: number;
}

export const user = {
  name: "Caro Giménez",
  role: "Maestra · Soles",
  initials: "C",
};

export const classroom = {
  name: "Sala Soles",
  childrenCount: 12,
  date: "martes 17 jun",
};

export const posts: Post[] = [
  {
    id: "post-1",
    type: "logro",
    author: "Mateo",
    initials: "M",
    time: "14:20",
    audience: "familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "post-2",
    type: "actividad",
    author: "Mateo",
    initials: "M",
    time: "09:40",
    audience: "familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photo: "Foto · pintando con témperas",
    likes: 5,
    comments: 2,
  },
  {
    id: "post-3",
    type: "anuncio",
    author: "Anuncio general",
    time: "07:50",
    audience: "toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];
