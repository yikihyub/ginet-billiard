import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

const FilterSection = () => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* 상세 필터 Collapsible */}
      <Collapsible className="w-full bg-white rounded-lg border border-gray-200">
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
          <span className="text-sm font-medium">상세 필터</span>
          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 게임 종류 선택 */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">게임 종류</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="게임을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4구">4구</SelectItem>
                  <SelectItem value="3구">3구</SelectItem>
                  <SelectItem value="포켓볼">포켓볼</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 실력 수준 선택 */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">실력 수준</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="실력을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">초보자</SelectItem>
                  <SelectItem value="intermediate">중급자</SelectItem>
                  <SelectItem value="advanced">고급자</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 지역 선택 */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">지역</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="지역을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="서울">서울</SelectItem>
                  <SelectItem value="경기">경기</SelectItem>
                  <SelectItem value="인천">인천</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 인원 수 선택 */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">인원 수</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="인원을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-4">2-4명</SelectItem>
                  <SelectItem value="5-8">5-8명</SelectItem>
                  <SelectItem value="9+">9명 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterSection;
