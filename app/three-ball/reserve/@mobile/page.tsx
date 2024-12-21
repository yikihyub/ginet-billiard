// import React from "react";
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { ArrowUp } from "lucide-react";
// import { SearchBar } from "./_components/search/search-bar";
// import { BilliardRoomCard } from "./_components/card/billiard-roomcard";

// export default function MobilePage() {
//   return (
//     <>
//       <div className="fixed top-4 z-50">
//         <Sheet>
//           <SheetTrigger className="fixed bottom-0 w-full bg-white rounded-t-xl shadow-lg p-4">
//             <div className="flex flex-col items-center">
//               <ArrowUp className="text-gray-400 mb-2 h-5 w-5" />
//               <span className="text-sm text-gray-600">
//                 근처 당구장 목록보기
//               </span>
//             </div>
//           </SheetTrigger>
//           <SheetContent side="bottom" className="h-[100%] p-4">
//             <SheetHeader>
//               <SheetTitle></SheetTitle>
//             </SheetHeader>
//             <div>
//               <div className="flex w-full flex-col h-full">
//                 <SearchBar />
//               </div>
//               <div className="mt-2 mb-2 border border-[#eee]"></div>
//               <BilliardRoomCard />
//               <div className="mt-2 mb-2 border border-[#eee]"></div>
//               <BilliardRoomCard />
//               <div className="mt-2 mb-2 border border-[#eee]"></div>
//               <BilliardRoomCard />
//               <div className="mt-2 mb-2 border border-[#eee]"></div>
//               <BilliardRoomCard />
//               <div className="mt-2 mb-2 border border-[#eee]"></div>
//               <BilliardRoomCard />
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>
//     </>
//   );
// }

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchBar } from "./_components/search/search-bar";
import { BilliardRoomCard } from "./_components/card/billiard-roomcard";

export default function MobilePage() {
  return (
    <>
      <div className="fixed top-4 z-50">
        <Drawer>
          <DrawerTrigger className="fixed bottom-0 w-full bg-white rounded-t-xl shadow-lg p-4">
            <div className="flex flex-col items-center">
              <ArrowUp className="text-gray-400 mb-2 h-5 w-5" />
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
              <div className="mt-2 mb-2 border border-[#eee]"></div>
              <ScrollArea className="h-[calc(100%-5rem)]">
                <BilliardRoomCard />
                <div className="mt-2 mb-2 border border-[#eee]"></div>
                <BilliardRoomCard />
                <div className="mt-2 mb-2 border border-[#eee]"></div>
                <BilliardRoomCard />
                <div className="mt-2 mb-2 border border-[#eee]"></div>
                <BilliardRoomCard />
                <div className="mt-2 mb-2 border border-[#eee]"></div>
                <BilliardRoomCard />
                <div className="mt-2 mb-2 border border-[#eee]"></div>
                <BilliardRoomCard />
              </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
