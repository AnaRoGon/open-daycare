import { NavShell } from "@/components/shared/nav-shell";
import { getCurrentUser } from "@/utils/supabase/user";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return <NavShell user={user}>{children}</NavShell>;
}
