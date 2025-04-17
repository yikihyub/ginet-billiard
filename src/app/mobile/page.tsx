import Nav from './_components/(layout)/nav';
import Footer from './_components/(layout)/footer';

import MainNav from './_components/(main)/main-nav';
import MainImageSlider from './_components/(main)/main-image-slider';
import QuickMenu from './_components/(main)/quick-menu';
import PopularPosts from './_components/(main)/main-post';
import ClubsSection from './_components/(main)/main-club';
import MainMatch from './_components/(main)/main-match';
import SwiperComponent from './_components/(swiper)/ad-swiper';

export default function MobileHome() {
  return (
    <>
      {/* main nav */}
      <Nav />

      {/* quick nav */}
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

      {/* main-footer */}
      <Footer />
    </>
  );
}
