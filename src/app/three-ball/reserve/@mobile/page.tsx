'use client';

import React, { useState } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ArrowUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchBar } from './_components/search/search-bar';
import { StoreList } from './_components/list/store-list';

export default function MobilePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 z-50">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger className="fixed bottom-0 w-full rounded-t-xl bg-white p-4 shadow-lg">
            <div className="flex flex-col items-center">
              <ArrowUp className="mb-2 h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                근처 당구장 목록보기
              </span>
            </div>
          </DrawerTrigger>
          <DrawerContent className="h-[100%] p-4">
            <DrawerHeader>
              <DrawerTitle></DrawerTitle>
            </DrawerHeader>
            <div className="h-[calc(100vh-12rem)]">
              <SearchBar />
              <div className="mb-2 mt-2 border border-[#eee]"></div>
              <ScrollArea className="h-[calc(100%-5rem)]">
                <StoreList onCloseDrawer={() => setIsOpen(false)} />
              </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
