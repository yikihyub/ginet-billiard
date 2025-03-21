'use client';

import { Star, Phone, MessageSquare, MapPin, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import Image from 'next/image';
import AdBanner from '../billiard-commu/_components/banner/ad-banner';

const LessonPage = () => {
  // const [activeTab, setActiveTab] = useState('전체');

  const instructors = [
    {
      id: 1,
      name: '김민수',
      rating: 4.8,
      reviewCount: 121,
      description:
        '당구 자세와 기본 쵸도 괜찮아요. 처음 하기에서 자신으로 함께 성장했습니다.',
      location: '서울 강남구',
      isPremium: true,
    },
    {
      id: 2,
      name: '박지영',
      rating: 4.9,
      reviewCount: 129,
      description:
        '국내외 고등 수아서 홀로 바디는 네감자와 함께하 면서 이론 이음을 처유합니다.',
      location: '서울 서초구',
      isPremium: false,
      badge: '우수',
    },
    {
      id: 3,
      name: '최경진',
      rating: 4.7,
      reviewCount: 93,
      description: '현대당 가능선과 심함의 과정을 함께하는 "픈드라 치" 입니다.',
      location: '서울 용산구',
      isPremium: true,
    },
    {
      id: 4,
      name: '윤수진',
      rating: 5.0,
      reviewCount: 209,
      description: '세상의 모든 강사와 마주해요.',
      location: '서울 마포구',
      isPremium: false,
      badge: '우수',
    },
  ];

  // 캐러셀 데이터
  // const carouselItems = [
  //   {
  //     id: 1,
  //     title: '인간관계가 고민인 당신을 위한 솔루션',
  //     subtitle: '하루 2500원으로 시작해요!',
  //     color: 'bg-blue-500',
  //     ratio: '1/4',
  //   },
  //   {
  //     id: 2,
  //     title: '전문 코칭과 함께 나만의 목표 달성하기',
  //     subtitle: '',
  //     color: 'bg-green-500',
  //     ratio: '1/2',
  //   },
  //   {
  //     id: 3,
  //     title: '함께 고민을 나누는 그룹 테라피',
  //     subtitle: '',
  //     color: 'bg-sky-500',
  //     ratio: '3/3',
  //   },
  // ];

  // 필터 옵션들
  const filterOptions = [
    {
      id: 'location',
      name: '주천순',
      options: ['전체', '서울', '경기', '인천'],
    },
    {
      id: 'available',
      name: '가능일시',
      options: ['전체', '평일', '주말', '야간'],
    },
    {
      id: 'category',
      name: '분야',
      options: ['전체', '당구 3구', '4구', '포켓볼'],
    },
    {
      id: 'experience',
      name: '경력',
      options: ['전체', '1년 이상', '3년 이상', '5년 이상'],
    },
  ];

  return (
    <div className="mx-auto max-w-md bg-white">
      {/* 검색창 */}
      {/* <div className="relative border-b p-4">
        <Input
          className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4"
          placeholder="전문가 검색"
        />
        <Search className="absolute right-8 top-6 h-5 w-5 text-gray-400" />
      </div> */}

      {/* 탭 네비게이션 */}
      <Tabs defaultValue="전체" className="w-full">
        <TabsList className="no-scrollbar h-12 w-full justify-start gap-6 overflow-x-auto bg-white px-4">
          <TabsTrigger
            value="전체"
            className="bg-white px-0 data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
          >
            전체
          </TabsTrigger>
          <TabsTrigger
            value="3구"
            className="bg-white px-0 data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
          >
            3구
          </TabsTrigger>
          <TabsTrigger
            value="4구"
            className="bg-white px-0 data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
          >
            4구
          </TabsTrigger>
          <TabsTrigger
            value="포켓볼"
            className="bg-white px-0 data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
          >
            포켓볼
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 캐러셀 */}
      {/* <div className="no-scrollbar overflow-x-auto p-4">
        <div className="flex space-x-3">
          {carouselItems.map((item) => (
            <div
              key={item.id}
              className={`${item.color} relative h-24 w-72 flex-shrink-0 rounded-lg p-4 text-white`}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  {item.subtitle && (
                    <p className="mt-1 text-xs">{item.subtitle}</p>
                  )}
                </div>
                <div className="absolute right-2 top-2 rounded bg-black bg-opacity-30 px-2 py-0.5 text-xs">
                  {item.ratio}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <div className="p-4">
        {' '}
        <AdBanner />
      </div>

      {/* 필터 */}
      <div className="no-scrollbar overflow-x-auto border-b p-2">
        <div className="flex space-x-2">
          {filterOptions.map((filter) => (
            <div key={filter.id} className="relative">
              <Button
                variant="outline"
                className="flex h-8 items-center gap-1 whitespace-nowrap rounded-full border-gray-300 bg-white text-sm"
              >
                {filter.name}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 전문가 목록 */}
      <div className="divide-y">
        {instructors.map((instructor) => (
          <div key={instructor.id} className="p-4">
            <div className="flex">
              {/* 프로필 이미지 */}
              <div className="mr-4 flex-shrink-0">
                <Avatar className="h-28 w-20 rounded-lg">
                  <Image src={'/people_ex.jpg'} alt={instructor.name} fill />
                </Avatar>
              </div>

              {/* 정보 */}
              <div className="flex-1">
                <div className="mb-1 flex items-center">
                  {instructor.badge && (
                    <Badge className="mr-2 bg-blue-100 px-1.5 py-0.5 text-xs font-normal text-blue-600">
                      {instructor.badge}
                    </Badge>
                  )}
                  <div className="font-medium">{instructor.name}</div>
                  <div className="ml-2 flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm">{instructor.rating}</span>
                    <span className="ml-1 text-xs text-gray-500">
                      ({instructor.reviewCount})
                    </span>
                  </div>
                </div>

                <p className="mb-2 text-sm text-gray-600">
                  {instructor.description}
                </p>

                {/* 액션 버튼 */}
                <div className="mt-3 flex items-center text-gray-500">
                  <div className="mr-3 flex items-center">
                    <Phone className="mr-1 h-4 w-4" />
                  </div>
                  <div className="mr-3 flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span className="text-xs">{instructor.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonPage;
