// components/(main)/popular-posts.jsx
import React from 'react';
import Link from 'next/link';

const PopularPosts = () => {
  // 이 데이터는 실제로는 API 호출 등으로 가져와야 합니다
  const popularPosts = [
    {
      id: 1,
      title: '여름 캠핑 장비 추천해주세요',
      author: '캠핑러버',
      views: 1245,
      likes: 87,
      category: '캠핑',
    },
    {
      id: 2,
      title: '서울 근교 당일치기 등산 코스',
      author: '산림이',
      views: 982,
      likes: 65,
      category: '등산',
    },
    {
      id: 3,
      title: '초보자를 위한 자전거 구매 가이드',
      author: '바이크맨',
      views: 876,
      likes: 52,
      category: '자전거',
    },
    {
      id: 4,
      title: '여름철 낚시 포인트 공유합니다',
      author: '낚시왕',
      views: 756,
      likes: 43,
      category: '낚시',
    },
    {
      id: 5,
      title: '사진 초보가 찍은 일몰 사진',
      author: '사진사진',
      views: 689,
      likes: 39,
      category: '사진',
    },
    {
      id: 6,
      title: '제주도 게스트하우스 추천',
      author: '여행자',
      views: 654,
      likes: 37,
      category: '여행',
    },
  ];

  return (
    <section className="m-auto max-w-[1024px] bg-gray-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">커뮤니티 인기글</h2>
        <Link
          href="/billiard-commu"
          className="text-sm text-blue-600 hover:underline"
        >
          더보기
        </Link>
      </div>

      <div className="no-scrollbar overflow-x-auto pb-4">
        <div className="flex min-w-max space-x-4">
          {popularPosts.map((post) => (
            <div
              key={post.id}
              className="w-72 flex-none rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="p-4">
                <div className="mb-1 text-xs text-gray-500">
                  {post.category}
                </div>
                <h3 className="mb-2 line-clamp-2 text-base font-medium">
                  {post.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>조회 {post.views}</span>
                  <span className="mx-2">•</span>
                  <span>좋아요 {post.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPosts;
