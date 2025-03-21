'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { IterationCcw, X, Tornado } from 'lucide-react';

interface FilterSectionProps {
  maxDistance: number;
  onMaxDistanceChange: (value: number) => void;
}

export default function FilterSection({
  maxDistance,
  onMaxDistanceChange,
}: FilterSectionProps) {
  // 필터 상태
  const [tempDistance, setTempDistance] = useState(maxDistance);
  const [gameType, setGameType] = useState('4구');

  // 필터 적용
  const handleApply = () => {
    onMaxDistanceChange(tempDistance);
    // 여기에 다른 필터 적용 로직 추가
  };

  // 필터 초기화
  const handleReset = () => {
    setTempDistance(20);
    setGameType('4구');
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 rounded-full border-none px-3 py-1 text-xs shadow-none"
        >
          <Tornado className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-6">
        <DrawerTitle className="mb-6 flex items-center justify-between">
          <span className="text-lg font-bold">상세 필터</span>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerTitle>

        <div className="no-scrollbar max-h-[70vh] space-y-6 overflow-y-auto pb-4">
          {/* 병원정보 */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">게임종목</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={gameType === '4구' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setGameType('4구')}
              >
                4구
              </Button>
              <Button
                variant={gameType === '3구' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setGameType('3구')}
              >
                3구
              </Button>
              <Button
                variant={gameType === '포켓볼' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setGameType('포켓볼')}
              >
                포켓볼
              </Button>
              <Button
                variant={gameType === '상관없음' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setGameType('상관없음')}
              >
                상관없음
              </Button>
            </div>
          </div>

          {/* 거리 설정 */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">거리 설정</h3>
            <div className="mb-4">
              <Slider
                value={[tempDistance]}
                onValueChange={(value) => setTempDistance(value[0])}
                min={0}
                max={50}
                step={1}
                className="my-6"
              />
              <div className="mt-1 flex justify-between text-sm text-gray-600">
                <span
                  className={`cursor-pointer ${tempDistance === 0 ? 'font-bold text-green-600' : ''}`}
                  onClick={() => setTempDistance(0)}
                >
                  현위치
                </span>
                <span
                  className={`cursor-pointer ${tempDistance === 10 ? 'font-bold text-green-600' : ''}`}
                  onClick={() => setTempDistance(10)}
                >
                  10km
                </span>
                <span
                  className={`cursor-pointer ${tempDistance === 20 ? 'font-bold text-green-600' : ''}`}
                  onClick={() => setTempDistance(20)}
                >
                  20km
                </span>
                <span
                  className={`cursor-pointer ${tempDistance === 30 ? 'font-bold text-green-600' : ''}`}
                  onClick={() => setTempDistance(30)}
                >
                  30km
                </span>
                <span
                  className={`cursor-pointer ${tempDistance === 40 ? 'font-bold text-green-600' : ''}`}
                  onClick={() => setTempDistance(40)}
                >
                  40km
                </span>
                <span
                  className={`cursor-pointer ${tempDistance === 50 ? 'font-bold text-green-600' : ''}`}
                  onClick={() => setTempDistance(50)}
                >
                  50km
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 적용/초기화 버튼 */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 py-3"
            onClick={handleReset}
          >
            <IterationCcw className="mr-2 h-4 w-4" />
            초기화
          </Button>
          <DrawerClose asChild>
            <Button className="flex-1 py-3" onClick={handleApply}>
              적용
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
