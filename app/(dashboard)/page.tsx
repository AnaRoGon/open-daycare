import { ComposeTrigger } from "@/components/home/compose-trigger";
import { Greeting } from "@/components/home/greeting";
import { PostCard } from "@/components/home/post-card";
import { posts } from "@/data/mock/feed";
import { getCurrentUser } from "@/utils/supabase/user";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-[34px] lg:px-10">
      <Greeting user={user} />
      <ComposeTrigger />

      <div className="mb-3.5 flex items-center gap-3.5">
        <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
          PUBLICADO HOY
        </span>
        <span className="h-px flex-1 bg-[#E7DAC8]" />
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
