import { NavShell } from "@/components/shared/nav-shell";
import { getCurrentUser } from "@/utils/supabase/user";
import { PostProvider } from "@/contexts/post-context";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <PostProvider>
      <NavShell user={user}>{children}</NavShell>
    </PostProvider>
  );
}
