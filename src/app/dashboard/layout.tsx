import Logo from '@/components/app/logo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 z-10">
        <Logo />
        <div className="ml-auto">
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
