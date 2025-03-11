import QuickMenu from '@/components/(main)/quick-menu';
import MainImageSlider from '@/components/(main)/main-image-slider';
import MainMatch from '@/components/(main)/main-match';
import MainNav from '@/components/(main)/main-nav';
import PopularPosts from '@/components/(main)/main-post';
import ClubsSection from '@/components/(main)/main-club';

export default function Home() {
  return (
    <>
      {/* main-navigation */}
      <MainNav />
      {/* image-slider */}
      <MainImageSlider />

      {/* quick-menu */}
      <QuickMenu />

      {/* popular-post */}
      <PopularPosts />

      {/* main-club */}
      <ClubsSection />

      {/* main-match-container */}
      <MainMatch />
    </>
  );
}
