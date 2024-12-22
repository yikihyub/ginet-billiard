export default function MobileMypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen max-w-[1280px] m-auto">
      <>{children}</>
    </div>
  );
}
