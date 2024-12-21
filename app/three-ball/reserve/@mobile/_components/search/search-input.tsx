"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchInput() {
  return (
    <div className="relative w-full">
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <Input
        placeholder="당구장을 검색해보세요"
        className="pl-10 h-12 text-md hover:bg-gray-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md shadow-none bg-gray-100 border-none"
      />
    </div>
  );
}
