// components/(main)/popular-posts.jsx
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Eye, ThumbsUp, MessageSquare } from 'lucide-react';

const PopularPosts = () => {
  // 이 데이터는 실제로는 API 호출 등으로 가져와야 합니다
  const popularPosts = [
    {
      id: 1,
      title: '이 배치에서는 어떤 초이스가 더 좋았을까요?',
      views: 20473,
      likes: 225,
      comments: 276,
    },
    {
      id: 2,
      title: '큐대, 장비 추천좀 해주세요.',
      views: 21596,
      likes: 259,
      comments: 187,
    },
    {
      id: 3,
      title: '근처 당구장 추천좀해주세요.',
      views: 11808,
      likes: 194,
      comments: 119,
    },
  ];

  return (
    <section className="m-auto max-w-[1024px] px-4 py-4 md:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-md font-bold">커뮤니티 인기글</div>
        <Link
          href="/mobile/billiard-commu/main"
          className="text-xs font-medium text-gray-400"
        >
          <div className="flex items-center">
            전체보기 <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      <div className="space-y-2">
        {popularPosts.map((post) => (
          <div
            key={post.id}
            className="w-full rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <h3 className="mb-2 text-sm font-medium">{post.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="flex items-center">
                <Eye className="mr-1 h-3 w-3" />
                {post.views.toLocaleString()}
              </div>
              <div className="flex items-center">
                <ThumbsUp className="mr-1 h-3 w-3" />
                {post.likes}
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-1 h-3 w-3" />
                {post.comments}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularPosts;
