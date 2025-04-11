'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PostsResponse } from '@/types/(community)/community';

import PostCard from '../card/post-card';
import PostSkeleton from '../skeleton/post-skeleton';
import PostError from '../error/post-error';
import EmptyPosts from '../card/empty-post';

interface PostListProps {
  data: PostsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  filter: string;
  category: string;
  updateLikeStatus: (postId: number, liked: boolean, likeCount: number) => void;
}

export default function PostList({
  data,
  isLoading,
  isError,
  filter,
  category,
  updateLikeStatus,
}: PostListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleLikeToggle = async (postId: number) => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return;
    }

    // 현재 게시글 찾기
    const post = data?.posts.find((p) => p.id === postId);
    if (!post) return;

    // 낙관적 업데이트 (UI 즉시 반영)
    const newLiked = !post.liked;
    const newLikeCount = newLiked ? post.likeCount + 1 : post.likeCount - 1;

    // 로컬 상태 업데이트
    updateLikeStatus(postId, newLiked, newLikeCount);

    try {
      // 서버에 좋아요 요청
      const response = await fetch(`/api/community/${postId}/like/postlike`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: data.liked ? '좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.',
        });

        // 서버 응답으로 정확한 좋아요 수 반영 (선택 사항)
        updateLikeStatus(postId, data.liked, data.likeCount);
      } else {
        // 실패 시 원래 상태로 되돌리기
        updateLikeStatus(postId, post.liked, post.likeCount);
        toast({ title: '작업 중 오류가 발생했습니다.' });
      }
    } catch (error) {
      // 에러 시 원래 상태로 되돌리기
      updateLikeStatus(postId, post.liked, post.likeCount);
      toast({ title: '작업 중 오류가 발생했습니다.' });
      console.error('Error toggling like:', error);
    }
  };

  const handlePostClick = async (postId: number) => {
    try {
      await fetch(`/api/community/${postId}/view/postview`, {
        method: 'POST',
      });
      router.push(`/mobile/billiard-commu/main/${postId}`);
    } catch (error) {
      console.error('Erorr recording view:', error);
      router.push(`/mobile/billiard-commu/main/${postId}`);
    }
  };

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (isError) {
    return <PostError />;
  }

  if (!data?.posts || data.posts.length === 0) {
    return (
      <div className="bg-white">
        <EmptyPosts
          message={
            filter !== 'all'
              ? '해당 필터에 맞는 게시글이 없습니다.'
              : category !== 'all'
                ? '해당 카테고리에 게시글이 없습니다.'
                : '등록된 게시글이 없습니다.'
          }
        />
      </div>
    );
  }

  return (
    <div className="pb-16">
      {data.posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onPostClick={handlePostClick}
          onLikeToggle={handleLikeToggle}
        />
      ))}
    </div>
  );
}
