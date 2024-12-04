import QuickMenu from "@/components/(main)/quick-menu";
import MainImageSlider from "@/components/(main)/main-image-slider";
import MainMatch from "@/components/(main)/main-match";

export default function Home() {
  return (
    <>
      {/* image-slider */}
      <MainImageSlider />

      {/* quick-menu */}
      <QuickMenu />

      {/* main-match-container */}
      <MainMatch />
    </>
  );
}
