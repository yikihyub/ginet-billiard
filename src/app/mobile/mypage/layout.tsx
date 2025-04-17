export default function MobileMypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">{children}</div>
    </>
  );
}
