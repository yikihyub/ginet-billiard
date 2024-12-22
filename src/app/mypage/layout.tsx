export default function RootLayout({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  return (
    <div>
      {/* 모바일 */}
      <div className="md:hidden">{mobile}</div>
      {/* 데스크톱 */}
      <div className="hidden md:block">{desktop}</div>
    </div>
  );
}
