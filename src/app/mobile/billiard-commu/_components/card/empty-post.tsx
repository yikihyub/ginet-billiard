'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface EmptyPostsProps {
  message?: string;
  showWriteButton?: boolean;
}

const EmptyPosts: React.FC<EmptyPostsProps> = ({
  message = '등록된 게시글이 없습니다.',
  showWriteButton = true,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const handleWritePost = () => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return;
    }

    router.push('/billiard-commu/write');
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <FileText className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">{message}</h3>
      <p className="mb-6 text-sm text-gray-500">
        커뮤니티의 첫 번째 글을 작성해보세요.
      </p>

      {showWriteButton && (
        <Button
          onClick={handleWritePost}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
        >
          <Plus size={16} />
          <span>글 작성하기</span>
        </Button>
      )}
    </div>
  );
};

export default EmptyPosts;
