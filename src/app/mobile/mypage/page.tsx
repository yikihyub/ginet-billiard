import React from 'react';

import MenuItem from './_components/item/menu-item';
import ProfileHeader from './_components/header/profile-header';
import LogOutButton from './_components/button/logout-button';

export default function MobileMypage() {
  const menuGroups = [
    {
      title: '당구장',
      items: [
        {
          name: '최근 이용한 당구장',
          path: '/mypage/latest-billiard',
        },
        {
          name: '즐겨찾는 당구장',
          path: '/mypage/favorite-billiard',
        },
      ],
    },
    {
      title: '기록',
      items: [
        { name: '4구 기록', path: '/mypage/four-ball' },
        { name: '3구 기록', path: '/mypage/billiard-place' },
        { name: '포켓볼 기록', path: '/mypage/pocketball' },
      ],
    },
    {
      title: '고객센터 및 설정',
      items: [
        { name: '1:1 문의', path: '/mobile/mypage/qna/my-inquiries' },
        { name: '공지사항', path: '/mobile/notice' },
        { name: '자주묻는 질문', path: '/mypage/faq' },
        { name: '알림설정', path: '/mypage/notice-set' },
        { name: '차단 친구 관리', path: '/mypage/block-set' },
      ],
    },
    // {
    //   title: '결제',
    //   items: [{ name: '결제수단', path: '/mypage/payment' }],
    // },
    // {
    //   title: '이벤트',
    //   items: [
    //     { name: '친구 초대하기', path: '/mypage/invite' },
    //     { name: '매장 정보 제보하기', path: '/mypage/shop-info' },
    //     { name: '이벤트 모아보기', path: '/mypage/event' },
    //   ],
    // },
    // {
    //   title: '레슨',
    //   items: [
    //     { name: '레슨 상담', path: '/mypage/lesson' },
    //     { name: '최근 레슨 내역', path: '/mypage/latest-lesson' },
    //     {
    //       name: '즐겨 찾는 레슨',
    //       path: '/mypage/favorite-lesson',
    //     },
    //     { name: '레슨 프로 목록', path: '/mypage/inventory' },
    //   ],
    // },
  ];

  return (
    <div className="flex w-full flex-col">
      {/* 프로필 섹션 */}
      <ProfileHeader />

      <div className="">
        {/* 당구장 */}
        <div className="mt-2 border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 text-sm font-semibold">
            {menuGroups[0].title}
          </div>
          <div className="text-sm">
            {menuGroups[0].items.map((item) => (
              <MenuItem key={item.path} label={item.name} href={item.path} />
            ))}
          </div>
        </div>

        {/* 기록 */}
        <div className="bg-white pb-4 pl-4 pr-4 shadow-sm">
          <div className="mb-2 border-t pt-4 text-sm font-semibold">
            {menuGroups[1].title}
          </div>
          <div className="text-sm">
            {menuGroups[1].items.map((item) => (
              <MenuItem key={item.path} label={item.name} href={item.path} />
            ))}
          </div>
        </div>

        {/* 고객센터 및 설정 */}
        <div className="bg-white pb-4 pl-4 pr-4 shadow-sm">
          <div className="mb-2 border-t pt-4 text-sm font-semibold">
            {menuGroups[2].title}
          </div>
          <div className="text-sm">
            {menuGroups[2].items.map((item) => (
              <MenuItem key={item.path} label={item.name} href={item.path} />
            ))}
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="bg-white pb-4">
          <LogOutButton />
        </div>
      </div>
    </div>
  );
}

{
  /* 결제 */
}
{
  /* <div className="bg-white p-4 shadow-sm">
  <div className="mb-2 text-sm font-semibold">{menuGroups[2].title}</div>
  <div className="text-sm">
    {menuGroups[2].items.map((item) => (
      <MenuItem key={item.path} label={item.name} href={item.path} />
    ))}
  </div>
</div> */
}

{
  /* 이벤트 */
}
{
  /* <div className="bg-white p-4 shadow-sm">
  <div className="mb-2 text-sm font-semibold">{menuGroups[3].title}</div>
  <div className="text-sm">
    {menuGroups[3].items.map((item) => (
      <MenuItem key={item.path} label={item.name} href={item.path} />
    ))}
  </div>
</div> */
}

{
  /* 레슨 */
}
{
  /* <div className="mt-2 bg-white p-4 shadow-sm">
  <h2 className="mb-2 text-sm font-semibold">{menuGroups[1].title}</h2>
  <div className="space-y-2 text-sm">
    {menuGroups[1].items.map((item) => (
      <MenuItem key={item.path} label={item.name} href={item.path} />
    ))}
  </div>
</div> */
}
