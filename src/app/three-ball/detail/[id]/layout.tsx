export default function DetailLayout({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  return (
    <>
      {/* 모바일 레이아웃 */}
      <div className="md:hidden">{mobile}</div>

      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:block">{desktop}</div>
    </>
  );
}
