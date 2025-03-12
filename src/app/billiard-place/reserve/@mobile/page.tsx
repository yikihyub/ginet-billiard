'use client';

import React, { useState } from 'react';
import { Star, Search, Clock } from 'lucide-react';

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
import { SearchProvider } from '../_components/provider/search-provider';

// import { FavoriteList } from './_components/list/favorite-list';

export default function MobilePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites');

  // const renderTabContent = () => {
  //   switch (activeTab) {
  //     case 'favorites':
  //       return (
  //         <FavoriteList
  //           onCloseDrawer={() => setIsOpen(false)}
  //           filterType="favorites"
  //         />
  //       );
  //     case 'recent':
  //       return (
  //         <FavoriteList
  //           onCloseDrawer={() => setIsOpen(false)}
  //           filterType="recent"
  //         />
  //       );
  //     case 'searches':
  //       return (
  //         <FavoriteList
  //           onCloseDrawer={() => setIsOpen(false)}
  //           filterType="searches"
  //         />
  //       );
  //     default:
  //       return <FavoriteList onCloseDrawer={() => setIsOpen(false)} />;
  //   }
  // };

  return (
    <>
      {/* Tab Buttons */}
      <div className="top-27 no-scrollbar fixed z-40 max-w-[250px] overflow-x-auto px-4">
        <div className="mt-[3px] flex gap-1">
          <button
            className={`flex h-9 items-center justify-center rounded-full border px-4 py-2 ${activeTab === 'favorites' ? 'bg-yellow-50 text-yellow-500' : 'bg-white text-gray-500'}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Star className="mr-1 h-4 w-4" />
            <span className="whitespace-nowrap text-sm">즐겨찾기</span>
          </button>
          <button
            className={`flex h-9 items-center justify-center rounded-full border px-4 py-2 ${activeTab === 'recent' ? 'bg-blue-50 text-blue-500' : 'bg-white text-gray-500'}`}
            onClick={() => setActiveTab('recent')}
          >
            <Clock className="mr-1 h-4 w-4" />
            <span className="whitespace-nowrap text-sm">최근이용</span>
          </button>
          <button
            className={`flex h-9 items-center justify-center rounded-full border bg-white px-4 py-2 ${activeTab === 'searches' ? 'bg-blue-50 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('searches')}
          >
            <Search className="mr-1 h-4 w-4" />
            <span className="whitespace-nowrap text-sm">최근검색</span>
          </button>
        </div>
      </div>

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
              <SearchProvider>
                <SearchBar />
                <div className="mb-2 mt-2 border border-[#eee]"></div>
                <ScrollArea className="h-[calc(100%-5rem)]">
                  <StoreList onCloseDrawer={() => setIsOpen(false)} />
                </ScrollArea>
              </SearchProvider>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
