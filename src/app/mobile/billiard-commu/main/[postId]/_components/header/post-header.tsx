'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReportModal from '@/components/(modal)/report-modal';

interface PostHeaderProps {
  user: {
    id: number;
    name: string;
    profile_image: string | null;
  };
  postUserId: string;
  createdAt: string;
  postId: number;
}

export default function PostHeader({
  user,
  createdAt,
  postUserId,
  postId,
}: PostHeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(userId);

  // 작성자 진위여부
  const isAuthor = session?.user?.id.toString() === user.id.toString();

  // 게시글 삭제 모달
  const [modalOpen, setModalOpen] = useState(false);

  // 신고 모달을 위한 상태 추가
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // 글 수정 함수
  const handleEdit = () => {
    router.push(`/mobile/billiard-commu/main/edit/${postId}`);
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/community/posts/${postId}/deleteposts`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('게시글 삭제에 실패했습니다');
      }

      toast({ title: '게시글이 삭제되었습니다.' });
      router.push('/mobile/billiard-commu/main');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ title: '게시글 삭제에 실패했습니다.' });
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  // 수정된 신고 함수
  const handleReport = () => {
    setReportModalOpen(true);
    setOpen(false); // Drawer 닫기
  };

  return (
    <div className="flex items-center p-4">
      <div className="relative mr-3 h-11 w-11 overflow-hidden rounded-full bg-gray-200">
        {user?.profile_image ? (
          <Image
            src={user.profile_image}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <Image
              src="/logo/billiard-ball.png"
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="font-bold">{user?.name || '사용자'}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {formatDate(createdAt)}
        <Button
          variant="ghost"
          className="text-gray-600"
          onClick={() => setOpen(true)}
        >
          <MoreHorizontal size={24} />
        </Button>
      </div>

      {/* Drawer 컴포넌트 */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
          </DrawerHeader>

          <div className="space-y-2 p-4">
            {/* 수정하기 버튼 */}
            <Button
              variant="ghost"
              className="w-full border-none text-left text-lg font-bold"
              onClick={handleEdit}
            >
              수정하기
            </Button>
            <Separator />
            {isAuthor ? (
              <>
                {/* 삭제하기 버튼 */}
                <Button
                  variant="ghost"
                  className="w-full border-none text-left text-lg font-bold text-red-500"
                  onClick={() => setModalOpen(true)}
                >
                  삭제하기
                </Button>
              </>
            ) : (
              <>
                {/* 신고하기 버튼 */}
                <Button
                  variant="ghost"
                  className="w-full border-none text-left text-lg font-bold text-red-500"
                  onClick={handleReport}
                >
                  신고하기
                </Button>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* 삭제 확인 모달 */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[90%] rounded-md">
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-md font-bold">
              정말로 이 게시글을 삭제하시겠습니까?
            </p>
            <p className="text-xs font-bold text-gray-500">
              * 한 번 삭제한 게시글은 복구하기 어렵습니다.
            </p>
          </div>
          <DialogFooter className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="border-none shadow-none"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedUserId={postUserId}
        contentId={postId.toString()}
        username={user.name}
        contentType="post"
        contentPreview={`커뮤니티 게시글`}
      />
    </div>
  );
}
