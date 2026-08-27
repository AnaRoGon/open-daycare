import { ComposeTrigger } from "@/components/home/compose-trigger";
import { Greeting } from "@/components/home/greeting";
import { PostCard } from "@/components/home/post-card";
import { posts } from "@/data/mock/feed";

export default function Home() {
  return (
    <div className="px-5 py-8">
      <Greeting />
      <ComposeTrigger />
      <PostCard post={posts[0]} />
    </div>
  );
}
