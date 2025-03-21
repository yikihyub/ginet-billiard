import MainNav from './_components/(main)/main-nav';
import MainImageSlider from './_components/(main)/main-image-slider';
import QuickMenu from './_components/(main)/quick-menu';
import PopularPosts from './_components/(main)/main-post';
import ClubsSection from './_components/(main)/main-club';
import SwiperComponent from './_components/(swiper)/ad-swiper';
import MainMatch from './_components/(main)/main-match';

export default function MobileHome() {
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

      {/* advertisement */}
      <SwiperComponent />

      {/* main-match-container */}
      <MainMatch />
    </>
  );
}
