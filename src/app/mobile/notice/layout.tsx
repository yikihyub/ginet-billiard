import NoticeHeader from './_components/header/notice-header';

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {' '}
      <NoticeHeader />
      {children}
    </>
  );
}
