import Tab from './_components/tab/tab';

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Tab />
      {children}
    </>
  );
}
