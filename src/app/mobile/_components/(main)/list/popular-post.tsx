'use client';

import { useState } from 'react';
import { Clock, Eye, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Post {
  id: number;
  title: string;
  created_at: string;
  view_count: number;
  bi_post_like: any[];
  bi_comment: any[];
  bi_user: { name: string } | null;
  bi_category: { name: string; id: number } | null;
}

interface PopularPostsProps {
  initialPosts: Post[];
}

export default function PopularPostsClient({
  initialPosts,
}: PopularPostsProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredPosts =
    selectedCategory === null
      ? initialPosts
      : initialPosts.filter(
          (post) => post.bi_category?.id === selectedCategory
        );

  const categoryList = [
    { id: null, name: '🔥 전체' },
    { id: 1, name: '자유토크' },
    { id: 2, name: '정보공유' },
    { id: 3, name: '경기모임' },
    { id: 4, name: '장비' },
  ];

  return (
    <section className="max-w-[1024px] rounded-xl bg-white px-4 pt-4 md:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-md font-bold">커뮤니티 인기글</div>
        <div className="text-xs font-medium text-gray-400">전체보기</div>
      </div>

      <div className="mb-4 flex h-8 space-x-2">
        {categoryList.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-full p-2 text-xs ${
              selectedCategory === category.id
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-lg bg-white pt-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="flex">
                <div className="mr-3 text-red-500">{index + 1}</div>
                <div>
                  <div className="mb-1">
                    <span className="mr-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-600">
                      {post.bi_category?.name || '카테고리'}
                    </span>
                    <span className="text-sm font-medium">{post.title}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">{post.bi_user?.name || '익명'}</span>
                    <Clock className="mr-1 h-3 w-3" />
                    <span className="mr-2">
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                    <Eye className="mr-1 h-3 w-3" />
                    <span className="mr-2">{post.view_count}</span>
                    <Heart
                      className="mr-1 h-3 w-3"
                      fill={
                        post.bi_post_like.length > 0 ? 'currentColor' : 'none'
                      }
                    />
                    <span>{post.bi_post_like.length}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-2 rounded-md bg-gray-100 p-2 text-right">
                  <div className="text-center text-lg font-medium">
                    {post.bi_comment.length}
                  </div>
                  <div className="text-center text-xs text-gray-500">댓글</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex min-h-[220px] items-center justify-center py-10 text-center text-sm text-gray-500">
            아직 작성된 게시글이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
