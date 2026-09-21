"use client";

import { usePostContext } from "@/contexts/post-context";
import { PostCard } from "@/components/home/post-card";

export function FeedContent() {
  const { posts } = usePostContext();

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
