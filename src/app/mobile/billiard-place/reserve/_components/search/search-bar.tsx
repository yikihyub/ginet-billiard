'use client';

import { RegionSelect } from './region-select';
import { GameTypeSelect } from './game-type-select';

export function SearchBar() {
  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <div className="flex w-full gap-2">
        <div className="w-full flex-1">
          <RegionSelect />
        </div>
        <div className="w-full flex-1">
          <GameTypeSelect />
        </div>
      </div>
    </div>
  );
}
