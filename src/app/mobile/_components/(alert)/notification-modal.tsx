'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationModalProps {
  type:
    | 'login'
    | 'match-request'
    | 'match-accepted'
    | 'match-rejected'
    | 'general';
  title: string;
  message: string;
  data?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: number;
  onDismiss: () => void;
}

export function NotificationModal({
  type,
  title,
  message,
  data,
  id,
  onDismiss,
}: NotificationModalProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    onDismiss();
  };

  const markAsRead = async () => {
    try {
      await fetch('/api/alert/read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId: id }),
      });
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleAction = () => {
    switch (type) {
      case 'match-request':
        if (data?.matchId) {
          router.push(`/match?${data.matchId}`);
        } else {
          router.push('/match');
        }
        break;
      case 'match-accepted':
        if (data?.matchId) {
          router.push(`/match/details/${data.matchId}`);
        } else {
          router.push('/match/details');
        }
        break;
      default:
        break;
    }
    markAsRead();
    handleClose();
  };

  // 알림 지속 시간 설정 (10초 후 자동 닫힘)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     handleClose();
  //   }, 10000);

  //   return () => clearTimeout(timer);
  // }, []);

  const getIcon = () => {
    switch (type) {
      case 'login':
        return <UserPlus className="h-6 w-6 text-blue-500" />;
      case 'match-request':
        return <Bell className="h-6 w-6 text-yellow-500" />;
      case 'match-accepted':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'match-rejected':
        return <X className="h-6 w-6 text-red-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPrimaryButtonText = () => {
    switch (type) {
      case 'login':
        return '확인';
      case 'match-request':
        return '요청 확인';
      case 'match-accepted':
        return '매치 보기';
      case 'match-rejected':
        return '확인';
      default:
        return '확인';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 text-center">
          <p>{message}</p>
          {data?.gameType && (
            <p className="mt-2 text-sm text-muted-foreground">
              게임 유형:{' '}
              {data.gameType === 'FOUR_BALL'
                ? '4구'
                : data.gameType === 'THREE_BALL'
                  ? '3구'
                  : data.gameType === 'POCKET_BALL'
                    ? '포켓볼'
                    : data.gameType}
            </p>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          {(type === 'match-request' || type === 'match-accepted') && (
            <Button onClick={handleAction}>{getPrimaryButtonText()}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
