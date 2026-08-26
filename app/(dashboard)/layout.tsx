import { NavShell } from "@/components/shared/nav-shell";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return <NavShell>{children}</NavShell>;
}
