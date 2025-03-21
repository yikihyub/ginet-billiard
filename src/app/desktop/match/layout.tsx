import { Toaster } from '@/components/ui/toaster';

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto flex max-w-[1024px] flex-col gap-4">
      {children}
      <Toaster />
    </div>
  );
}
