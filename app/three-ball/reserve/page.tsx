import React from "react";
import KakaoMap from "@/app/three-ball/reserve/_components/kakaomap/kakaomap";
import LeftSideBar from "./_components/left-sidebar/sidebar/left-sidebar";
import "../threeBall.css";

const GameSettingsComponent: React.FC = () => {
  return (
    <article className="flex w-full h-screen">
      <LeftSideBar />

      <div className="md:w-full md:ml-0">
        <KakaoMap />
      </div>
    </article>
  );
};

export default GameSettingsComponent;
