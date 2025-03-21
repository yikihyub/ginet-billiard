'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageSquare, Share2, Bookmark } from 'lucide-react';

interface PostActionsProps {
  postId: number;
  likesCount: number;
  commentsCount: number;
}

export default function PostActions({
  postId,
  likesCount,
  commentsCount,
}: PostActionsProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [likeCount, setLikeCount] = useState(likesCount);
  const [liked, setLiked] = useState(false);

  const handleLikeToggle = async () => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return;
    }

    // 낙관적 UI 업데이트
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        // 실패 시 원래 상태로 되돌리기
        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
        throw new Error('좋아요 처리 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error('Error toggling like:', err);
      toast({ title: '작업 중 오류가 발생했습니다.' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '게시글 공유',
          url: window.location.href,
        })
        .catch((err) => {
          console.error('Error sharing:', err);
          toast({ title: '공유하기에 실패했습니다.' });
        });
    } else {
      // 공유 API가 지원되지 않는 경우 URL 복사
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast({ title: 'URL이 클립보드에 복사되었습니다.' });
        })
        .catch((err) => {
          console.error('Error copying URL:', err);
          toast({ title: 'URL 복사에 실패했습니다.' });
        });
    }
  };

  const handleBookmark = () => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return;
    }
    toast({ title: '북마크 기능은 아직 준비 중입니다.' });
  };

  return (
    <div className="flex items-center justify-between border-b border-t px-4 py-3">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1" onClick={handleLikeToggle}>
          <Heart
            size={24}
            className={`${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
          <span className="text-sm">{likeCount}</span>
        </button>
        <button className="flex items-center gap-1">
          <MessageSquare size={24} className="text-gray-600" />
          <span className="text-sm">{commentsCount}</span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-gray-600" onClick={handleShare}>
          <Share2 size={22} />
        </button>
        <button className="text-gray-600" onClick={handleBookmark}>
          <Bookmark size={22} />
        </button>
      </div>
    </div>
  );
}
