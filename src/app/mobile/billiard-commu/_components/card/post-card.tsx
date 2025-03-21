'use client';

import { MessageCircle, Eye, Heart, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/utils/(community)/time';

interface PostCardProps {
  post: any; // 타입을 실제 Post 타입으로 수정
  onPostClick: (postId: number) => void;
  onLikeToggle: (postId: number) => void;
}

export default function PostCard({
  post,
  onPostClick,
  onLikeToggle,
}: PostCardProps) {
  return (
    <div
      className="border-b border-gray-200 bg-white p-4"
      onClick={() => onPostClick(post.id)}
    >
      {/* 게시글 헤더 */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="rounded-sm bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {post.bi_category?.name}
          </span>
          {post.is_hot && (
            <span className="ml-1 rounded-sm bg-red-50 px-2 py-0.5 text-xs text-red-500">
              인기
            </span>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-0.5" />
          <span>{formatRelativeTime(post.created_at)}</span>
        </div>
      </div>

      {/* 게시글 제목 및 내용 */}
      <h3 className="mb-1 text-base font-bold">{post.title}</h3>
      <p className="mb-3 line-clamp-2 text-sm text-gray-700">{post.content}</p>

      {/* 게시글 이미지 (있는 경우) */}
      {post.hasImage && (
        <div className="mb-3 overflow-hidden rounded-lg">
          <div
            className="h-48 bg-gray-200"
            style={{
              backgroundImage: `url(${post.imageSrc})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
        </div>
      )}

      {/* 게시글 푸터 - 리액션 */}
      <div className="flex items-center text-xs text-gray-500">
        <span className="font-medium">{post.bi_user?.name}</span>
        <div className="mx-auto"></div>
        <div className="ml-2 flex items-center">
          <button
            className="mr-3 flex items-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLikeToggle(post.id);
            }}
          >
            <Heart
              size={14}
              className={`mr-1 ${post.liked ? 'fill-red-500 text-red-500' : ''}`}
            />
            <span>{post.likeCount}</span>
          </button>

          <div className="mr-3 flex items-center">
            <MessageCircle size={14} className="mr-1" />
            <span>{post.commentCount}</span>
          </div>

          <div className="flex items-center">
            <Eye size={14} className="mr-1" />
            <span>{post.view_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
