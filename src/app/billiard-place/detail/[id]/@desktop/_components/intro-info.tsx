import React from 'react';
import { Store } from '@/types/(reserve)';

interface IntroInfoProps {
  store: Store;
}

const IntroInfo = ({ store }: IntroInfoProps) => {
  return (
    <div className="border-b p-4">
      <h2 className="mb-4 text-lg font-bold">📌 매장 소개</h2>
      <div>{store?.comment}</div>
    </div>
  );
};

export default IntroInfo;
