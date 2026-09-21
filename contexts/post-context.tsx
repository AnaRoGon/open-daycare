"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { posts as mockPosts, type Post } from "@/data/mock/feed";

interface PostContextValue {
  posts: Post[];
  addPost: (post: Omit<Post, "id" | "time" | "likes" | "comments">) => void;
}

const PostContext = createContext<PostContextValue | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const addPost = useCallback(
    (newPost: Omit<Post, "id" | "time" | "likes" | "comments">) => {
      const post: Post = {
        ...newPost,
        id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        likes: 0,
        comments: 0,
      };
      setPosts((prev) => [post, ...prev]);
    },
    [],
  );

  return (
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const ctx = useContext(PostContext);
  if (!ctx) {
    throw new Error("usePostContext must be used within PostProvider");
  }
  return ctx;
}
