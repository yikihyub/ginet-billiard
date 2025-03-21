import ProfileHeader from './_components/profile-header';
import { Sidebar } from './_components/sidebar';

export default function DesktopMypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto flex min-h-screen max-w-[1280px] flex-col">
      <ProfileHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
