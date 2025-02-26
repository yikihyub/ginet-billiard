import { Toaster } from '@/components/ui/toaster';

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      {children}
      <Toaster />
    </div>
  );
}
