// 'use client';

// import { Search, Filter } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
//   DrawerFooter,
// } from '@/components/ui/drawer';
// import FilterContent from './match-content';

// interface MatchFiltersProps {
//   searchTerm: string;
//   setSearchTerm: (term: string) => void;
//   dateFilter: string;
//   setDateFilter: (date: string) => void;
//   gameTypeFilter: string;
//   setGameTypeFilter: (type: string) => void;
//   handleClearFilters: () => void;
// }

// export default function MatchFilters({
//   searchTerm,
//   setSearchTerm,
//   dateFilter,
//   setDateFilter,
//   gameTypeFilter,
//   setGameTypeFilter,
//   handleClearFilters,
// }: MatchFiltersProps) {
//   const hasActiveFilters = searchTerm || dateFilter || gameTypeFilter !== 'ALL';

//   return (

//     <div className="flex items-center gap-2 overflow-x-auto border-b bg-white px-4 py-3">
//       {tabs.map(({ key, label }) => (
//         <Badge
//           key={key}
//           variant="outline"
//           className={`cursor-pointer px-3 py-1.5 ${
//             activeTab === key
//               ? 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
//               : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
//           }`}
//           onClick={() => setActiveTab(key)}
//         >
//           {label}
//           {activeTab === key && (
//             <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-green-500"></span>
//           )}
//         </Badge>
//       ))}
//     </div>

//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className={`${
//             hasActiveFilters ? 'border-green-500 text-green-600' : ''
//           }`}
//         >
//           <Filter className="mr-1 h-4 w-4" />
//           필터
//           {hasActiveFilters && (
//             <span className="ml-1 rounded-full bg-green-500 px-1.5 py-0.5 text-xs text-white">
//               •
//             </span>
//           )}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent className="p-4">
//         <div className="mx-auto w-full max-w-sm">
//           <DrawerHeader>
//             <DrawerTitle>검색 및 필터</DrawerTitle>
//           </DrawerHeader>

//           <FilterContent
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             dateFilter={dateFilter}
//             setDateFilter={setDateFilter}
//             gameTypeFilter={gameTypeFilter}
//             setGameTypeFilter={setGameTypeFilter}
//           />

//           <DrawerFooter>
//             <Button
//               variant="default"
//               className="w-full"
//               onClick={() => {
//                 document.querySelector('[data-radix-collection-item]');
//               }}
//             >
//               적용하기
//             </Button>
//             <Button
//               variant="outline"
//               className="w-full"
//               onClick={handleClearFilters}
//             >
//               필터 초기화
//             </Button>
//           </DrawerFooter>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }
