import React from 'react';
import KakaoMap from './_components/map/kakaomap';
import ListButton from './_components/button/list-button';

export default function MobilePage() {
  return (
    <>
      <div className="w-full">
        <KakaoMap />
      </div>
      <div className="fixed top-4 z-50">
        <ListButton />
      </div>
    </>
  );
}
