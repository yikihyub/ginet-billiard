'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import coordinates from '@/data/region_coordinates.json';

type RegionData = {
  bjd_cd: number;
  center_long: number;
  center_lati: number;
  bjd_nm: string;
  sd_nm: string;
  sgg_nm: string;
  emd_nm: string;
};

const regionData = coordinates as RegionData[];

export function RegionSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // 시/도 목록 추출
  const cities = [...new Set(regionData.map((item) => item.sd_nm))];

  // 선택된 시/도의 구/군 목록 추출
  const districts = selectedCity
    ? [
        ...new Set(
          regionData
            .filter((item) => item.sd_nm === selectedCity)
            .map((item) => item.sgg_nm)
            .filter(Boolean)
        ),
      ]
    : [];

  const handleRegionSelect = (district: string) => {
    const selectedLocation = regionData.find(
      (item) =>
        item.sd_nm === selectedCity && item.sgg_nm === district && !item.emd_nm
    );

    if (selectedLocation) {
      setSelectedRegion(`${selectedLocation.sd_nm} ${selectedLocation.sgg_nm}`);
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="mt-1 h-14 w-full border-0 bg-gray-100"
        >
          {selectedRegion || '지역'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-full">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            지역 선택
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-[calc(100%-1rem)] gap-4 py-4">
          {/* 왼쪽 시/도 목록 */}
          <div className="w-1/3 overflow-y-auto border-r pr-4">
            <div className="space-y-2">
              {cities.map((city) => (
                <button
                  key={city}
                  className={cn(
                    'w-full rounded-md px-2 py-1 text-left transition-colors',
                    selectedCity === city
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  )}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* 오른쪽 구/군 목록 */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {districts.map((district) => (
                <button
                  key={district}
                  className="rounded-md px-2 py-1 text-left transition-colors hover:bg-gray-100"
                  onClick={() => handleRegionSelect(district)}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
