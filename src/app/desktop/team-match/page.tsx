import MainBanner from './_components/banner/main-banner';
import MatchRegisterForm from './_components/form/register-form';

export default function DesktopMatchRegisterPage() {
  return (
    <div className="mx-auto max-w-[1024px]">
      <MainBanner />
      <MatchRegisterForm />
    </div>
  );
}
