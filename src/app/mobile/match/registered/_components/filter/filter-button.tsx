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
import { IterationCcw, X, Settings2 } from 'lucide-react';

export default function FilterButton() {
  const [gameType, setGameType] = useState('4구');

  // 필터 적용
  const handleApply = () => {
    console.log(123);
  };

  // 필터 초기화
  const handleReset = () => {
    setGameType('4구');
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex items-center gap-1">
          <Settings2 className="h-4 w-4" />
          <div className="text-sm font-semibold">필터</div>
        </div>
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
          <div></div>
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
