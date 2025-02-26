import MatchRegisterForm from './_components/form/register-form';
import MainBanner from './_components/banner/main-banner';

export default function MatchRegisterPage() {
  return (
    <div className="mx-auto max-w-[1024px]">
      <MainBanner />
      <MatchRegisterForm />
    </div>
  );
}
