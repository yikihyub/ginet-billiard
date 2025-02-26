import Navigation from '@/components/(main)/main-nav';

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <Navigation />
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
