import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export function EmptyMatchList() {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <FileText className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">
        등록된 경기가 없습니다.
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        첫 번째로 경기를 등록해보세요.
      </p>
      <Link href="/mobile/team-match">
        <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
          <Plus size={16} />
          <span>경기 등록하기</span>
        </Button>
      </Link>
    </div>
  );
}
