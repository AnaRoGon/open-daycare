import { Sidebar } from "@/components/shared/sidebar";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[248px] flex-none flex-col border-r border-linen bg-card lg:flex">
        <Sidebar />
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
