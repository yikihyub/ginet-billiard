import ProfileHeader from "./_components/profile-header";
import { Sidebar } from "./_components/sidebar";

export default function DesktopMypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen max-w-[1280px] m-auto">
      <ProfileHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
