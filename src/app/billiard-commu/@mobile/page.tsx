// CommunityContent.jsx
'use client';

// import { useState } from 'react';
import { MessageCircle, Eye, Heart, Clock, MapPin } from 'lucide-react';

const CommunityContent = () => {
  // const [currentCategory, setCurrentCategory] = useState('전체');

  // // 카테고리 데이터
  // const categories = [
  //   { id: 'all', name: '전체', icon: '🌐' },
  //   { id: 'talk', name: '자유토크', icon: '💬' },
  //   { id: 'info', name: '정보공유', icon: '📋' },
  //   { id: 'meetup', name: '경기모임', icon: '🏆' },
  //   { id: 'review', name: '장비리뷰', icon: '🎱' },
  // ];

  // 필터 태그 데이터
  const filterTags = [
    { id: 'all', name: '전체글' },
    { id: 'recent', name: '최신글' },
    { id: 'popular', name: '인기글' },
    { id: 'many-comments', name: '댓글 많은 글' },
    { id: 'many-views', name: '조회 많은 글' },
  ];

  // 게시글 데이터
  const posts = [
    {
      id: 1,
      category: '자유토크',
      title: '오늘 처음으로 당구장 가봤어요',
      content: '처음인데 생각보다 재밌네요! 팁 있으면 알려주세요~',
      authorName: '당구초보',
      location: '음내동',
      timeAgo: '2시간 전',
      commentCount: 5,
      likeCount: 3,
      viewCount: 24,
      hasImage: true,
      imageSrc: '/logo/logo_banner_b.png',
      isHot: true,
    },
    {
      id: 2,
      category: '장비리뷰',
      title: '새로 구매한 큐대 후기입니다',
      content:
        '3개월 전에 구매했는데 확실히 이전보다 컨트롤이 잘 되는 것 같아요...',
      authorName: '당구마스터',
      location: '행당동',
      timeAgo: '5시간 전',
      commentCount: 8,
      likeCount: 12,
      viewCount: 56,
      hasImage: true,
      imageSrc: '/logo/logo_banner_r.png',
    },
    {
      id: 3,
      category: '경기모임',
      title: '이번 주말 음내동 당구모임 하실 분?',
      content:
        "토요일 오후 2시부터 '홀인원' 당구장에서 모임 있습니다. 실력 무관 누구나 환영!",
      authorName: '당구동호회장',
      location: '음내동',
      timeAgo: '8시간 전',
      commentCount: 15,
      likeCount: 7,
      viewCount: 89,
      hasImage: false,
    },
    {
      id: 4,
      category: '정보공유',
      title: '당구 초보자를 위한 3가지 팁',
      content:
        '1. 브릿지 자세 연습하기 2. 큐대 그립 일정하게 유지하기 3. 파워보다 정확도에 집중하기...',
      authorName: '당구코치',
      location: '논현동',
      timeAgo: '1일 전',
      commentCount: 22,
      likeCount: 45,
      viewCount: 173,
      hasImage: false,
      isHot: true,
    },
  ];

  return (
    <div className="flex flex-col bg-gray-50">
      {/* 필터 태그 */}
      <div className="scrollbar-hide no-scrollbar flex gap-2 overflow-x-auto border-b border-gray-200 bg-white p-3">
        {filterTags.map((tag) => (
          <button
            key={tag.id}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${
              tag.id === 'all'
                ? 'bg-green-500 text-white'
                : 'border bg-white text-gray-700'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {/* 카테고리 스크롤 영역 */}
      {/* <div className="scrollbar-hide sticky top-[56px] z-20 overflow-x-auto border-b border-t border-gray-200 bg-white">
        <div className="flex space-x-3 p-3">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex min-w-[60px] flex-col items-center justify-center rounded-lg p-2 ${
                currentCategory === category.name
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-50 text-gray-700'
              }`}
              onClick={() => setCurrentCategory(category.name)}
            >
              <span className="mb-1 text-xl">{category.icon}</span>
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div> */}

      {/* 게시글 목록 */}
      <div className="pb-16">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-200 bg-white p-4">
            {/* 게시글 헤더 */}
            <div className="mb-2 flex items-start justify-between">
              <div>
                <span className="rounded-sm bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {post.category}
                </span>
                {post.isHot && (
                  <span className="ml-1 rounded-sm bg-red-50 px-2 py-0.5 text-xs text-red-500">
                    인기
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={12} className="mr-0.5" />
                <span>{post.location}</span>
                <span className="mx-1">·</span>
                <Clock size={12} className="mr-0.5" />
                <span>{post.timeAgo}</span>
              </div>
            </div>

            {/* 게시글 제목 및 내용 */}
            <h3 className="mb-1 text-base font-bold">{post.title}</h3>
            <p className="mb-3 line-clamp-2 text-sm text-gray-700">
              {post.content}
            </p>

            {/* 게시글 이미지 (있는 경우) */}
            {post.hasImage && (
              <div className="mb-3 overflow-hidden rounded-lg">
                <div
                  className="h-48 bg-gray-200"
                  style={{
                    backgroundImage: `url(${post.imageSrc})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                  }}
                ></div>
              </div>
            )}

            {/* 게시글 푸터 - 리액션 */}
            <div className="flex items-center text-xs text-gray-500">
              <span className="font-medium">{post.authorName}</span>
              <div className="mx-auto"></div>
              <div className="ml-2 flex items-center">
                <MessageCircle size={14} className="mr-1" />
                <span className="mr-2">{post.commentCount}</span>
                <Heart size={14} className="mr-1" />
                <span className="mr-2">{post.likeCount}</span>
                <Eye size={14} className="mr-1" />
                <span>{post.viewCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 글쓰기 버튼 (고정) */}
      <button className="fixed bottom-8 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default CommunityContent;
