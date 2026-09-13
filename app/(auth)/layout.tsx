export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen w-full bg-[#FBF4EC]">{children}</div>
  );
}
