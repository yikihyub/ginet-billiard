'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlockConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  userId: string; // 차단할 사용자 ID
  userName: string; // 차단할 사용자 이름
}

const BlockModal = ({
  open,
  onConfirm,
  onClose,
  userId,
  userName,
}: BlockConfirmModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBlockUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/member/postblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockedId: userId,
          blockReason: '사용자에 의한 차단',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '차단에 실패했습니다.');
      }

      toast({ title: `${userName} 님을 차단했습니다.` });

      onConfirm();
      onClose();
    } catch (error: any) {
      console.error('사용자 차단 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            사용자를 차단하시겠어요?
          </DialogTitle>
        </DialogHeader>
        <p className="mt-2 text-center text-sm">
          차단 시 더 이상 <strong>{userName}</strong>님과 경기를 진행 할 수
          없습니다. 차단하시겠습니까?
        </p>
        <small className="flex flex-col items-center justify-center text-gray-500">
          <div className="flex items-center text-xs">
            마이페이지 <ChevronRight className="h-3 w-3" /> 차단 친구관리에서
          </div>
          <div className="flex items-center text-xs">
            해제 하실 수 있습니다.
          </div>
        </small>
        <DialogFooter className="mt-6 flex flex-col gap-2">
          <Button
            onClick={handleBlockUser}
            className="h-12 w-full bg-red-600 text-white"
            disabled={isLoading}
          >
            차단
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="h-12 w-full border-none shadow-none"
            disabled={isLoading}
          >
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockModal;
