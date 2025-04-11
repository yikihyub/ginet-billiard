import MypageHeader from './_components/header/mypage-header';

export default function MobileMypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MypageHeader />
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">{children}</div>
    </>
  );
}
