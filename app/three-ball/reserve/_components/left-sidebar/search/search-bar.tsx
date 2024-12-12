"use client";

import { SearchInput } from "./search-input";
import { RegionSelect } from "./region-select";
import { GameTypeSelect } from "./game-type-select";

export function SearchBar() {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <SearchInput />
      <div className="flex gap-2 w-full">
        <div className="flex-1 w-full">
          <RegionSelect />
        </div>
        <div className="flex-1 w-full">
          <GameTypeSelect />
        </div>
      </div>
    </div>
  );
}
