import CommuHeader from './_components/header/commu-header';

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CommuHeader />
      {/* <Tab /> */}
      {children}
    </>
  );
}
