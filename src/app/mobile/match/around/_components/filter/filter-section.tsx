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
import { IterationCcw, X, Settings2 } from 'lucide-react';
import { useUserContext } from '../context/match-context';

export default function FilterSection() {
  // 컨텍스트에서 상태와 함수 가져오기
  const { maxDistance, setMaxDistance, gameType, setGameType } =
    useUserContext();

  // 임시 상태 (Drawer 내에서만 사용)
  const [tempDistance, setTempDistance] = useState(maxDistance);
  const [tempGameType, setTempGameType] = useState(gameType);

  const distances = [0, 10, 20, 30, 40, 50];
  const gameTypes = ['전체', '4구', '3구', '포켓볼'];

  // 필터 적용
  const handleApply = () => {
    setMaxDistance(tempDistance);
    setGameType(tempGameType);
  };

  // 필터 초기화
  const handleReset = () => {
    setTempDistance(20);
    setTempGameType('전체');
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 rounded-full border-none px-3 py-1 text-xs shadow-none"
        >
          <Settings2 className="h-4 w-4" />
          필터
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
          {/* 게임종목 */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">게임종목</h3>
            <div className="flex flex-wrap gap-2">
              {gameTypes.map((type) => (
                <Button
                  key={type}
                  variant={tempGameType === type ? 'default' : 'outline'}
                  className="rounded-full"
                  onClick={() => setTempGameType(type)}
                >
                  {type}
                </Button>
              ))}
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
                {distances.map((distance) => (
                  <span
                    key={distance}
                    className={`cursor-pointer ${tempDistance === distance ? 'font-bold text-green-600' : ''}`}
                    onClick={() => setTempDistance(distance)}
                  >
                    {distance === 0 ? '현위치' : `${distance}km`}
                  </span>
                ))}
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
