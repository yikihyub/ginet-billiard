import QuickMenu from "@/components/(main)/quick-menu";
import MainImageSlider from "@/components/(main)/main-image-slider";
import MainMatch from "@/components/(main)/main-match";
import MainNav from "@/components/(main)/main-nav";

export default function Home() {
  return (
    <>
      {/* main-navigation */}
      <MainNav />
      {/* image-slider */}
      <MainImageSlider />

      {/* quick-menu */}
      <QuickMenu />

      {/* main-match-container */}
      <MainMatch />
    </>
  );
}
