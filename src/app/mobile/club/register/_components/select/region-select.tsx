'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import coordinates from '@/data/region_coordinates.json';
import { RegionData } from '@/types/(reserve)';

const regionData = coordinates as RegionData[];

interface RegionSelectProps {
  value: string;
  onChange: (e: any) => void;
}

export function RegionSelect({ value, onChange }: RegionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>(value || '');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // value가 변경되면 selectedRegion 업데이트
  useEffect(() => {
    setSelectedRegion(value || '');
  }, [value]);

  const cities = [...new Set(regionData.map((item: RegionData) => item.sd_nm))];
  const districts = selectedCity
    ? [
        ...new Set(
          regionData
            .filter((item: RegionData) => item.sd_nm === selectedCity)
            .map((item: RegionData) => item.sgg_nm)
            .filter(Boolean)
        ),
      ]
    : [];

  const handleRegionSelect = (district: string) => {
    const selectedLocation = regionData.find(
      (item: RegionData) =>
        item.sd_nm === selectedCity && item.sgg_nm === district && !item.emd_nm
    );

    if (selectedLocation) {
      const newValue = `${selectedLocation.sd_nm} ${selectedLocation.sgg_nm}`;
      setSelectedRegion(newValue);

      // onChange 이벤트 핸들러 호출
      const changeEvent = {
        target: {
          name: 'location',
          value: newValue,
        },
      };

      onChange(changeEvent);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="h-[52px] w-full justify-between"
        >
          {selectedRegion || '지역 선택'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] rounded-lg">
        <DialogHeader>
          <DialogTitle>지역 선택</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-1 gap-4">
          {/* 왼쪽 시/도 목록 */}
          <div className="max-h-[500px] w-1/3 overflow-y-auto border-r pr-4">
            <div className="space-y-2">
              {cities.map((city) => (
                <button
                  key={city}
                  className={cn(
                    'w-full rounded-md px-2 py-1 text-left transition-colors',
                    selectedCity === city
                      ? 'bg-green-100 text-green-700'
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
          <div className="max-h-[500px] flex-1 overflow-y-auto">
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
      </DialogContent>
    </Dialog>
  );
}
