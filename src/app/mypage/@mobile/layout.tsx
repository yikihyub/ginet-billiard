export default function MobileMypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto flex min-h-screen max-w-[1280px] flex-col">
      {children}
    </div>
  );
}
