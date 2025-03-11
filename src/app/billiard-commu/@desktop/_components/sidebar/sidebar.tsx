'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  BookOpen,
  HelpCircle,
  // TrendingUp,
  // Zap,
  // Award,
  // Users,
  // Hash,
  PlusCircle,
  Calendar,
  Eye,
  ThumbsUp,
  Map,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CommunitySidebar() {
  const pathname = usePathname();

  // 현재 활성화된 메뉴 항목 확인
  const isActive = (path: string) => {
    return pathname === path;
  };

  // 커뮤니티 카테고리 메뉴
  const categories = [
    {
      name: '전체 게시글',
      path: '/community',
      icon: <MessageSquare className="h-4 w-4" />,
      exact: true,
    },
    {
      name: '자유게시판',
      path: '/community/free',
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      name: '팁 & 노하우',
      path: '/community/tips',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      name: '당구장 정보',
      path: '/community/venues',
      icon: <Map className="h-4 w-4" />,
    },
    {
      name: '대회 소식',
      path: '/community/tournaments',
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      name: '질문 & 답변',
      path: '/community/questions',
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      name: '동영상 강의',
      path: '/community/videos',
      icon: <Eye className="h-4 w-4" />,
    },
  ];

  // 인기 태그 목록
  const popularTags = [
    { name: '초보자팁', count: 143 },
    { name: '3쿠션', count: 98 },
    { name: '4구대', count: 87 },
    { name: '당구대회', count: 76 },
    { name: '레슨모집', count: 56 },
    { name: '당구용품', count: 43 },
  ];

  // 활성 유저 목록
  const activeUsers = [
    { name: '당구마스터', avatar: '/avatars/user1.jpg', points: 1243 },
    { name: '큐스틱맨', avatar: '/avatars/user2.jpg', points: 986 },
    { name: '쓰리쿠션킹', avatar: '/avatars/user3.jpg', points: 874 },
    { name: '포켓여왕', avatar: '/avatars/user4.jpg', points: 731 },
    { name: '당구초보', avatar: '/avatars/user5.jpg', points: 592 },
  ];

  // 이벤트 목록
  const upcomingEvents = [
    {
      title: '전국 아마추어 당구대회',
      date: '2025.03.15',
      location: '서울 강남',
    },
    {
      title: '당구 초보자 모임',
      date: '2025.03.10',
      location: '부산 해운대',
    },
  ];

  return (
    <div className="w-full shrink-0 space-y-4 md:w-64 lg:w-72">
      {/* 글쓰기 버튼 */}
      <Button className="w-full" size="lg">
        <PlusCircle className="mr-2 h-4 w-4" />새 글 작성하기
      </Button>

      {/* 카테고리 메뉴 */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">카테고리</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <nav className="flex flex-col">
            {categories.map((category) => (
              <Link
                key={category.path}
                href={category.path}
                className={cn(
                  'flex items-center px-4 py-2 text-sm',
                  (category.exact && isActive(category.path)) ||
                    (!category.exact && pathname.startsWith(category.path))
                    ? 'bg-green-50 font-medium text-green-700'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* 인기 게시글 */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">인기 게시글</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-0">
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Link
                href="/community/post/123"
                className="line-clamp-2 text-sm font-medium hover:text-green-700"
              >
                1달 만에 평균 30점대에서 70점대로 올라간 연습법
              </Link>
              <div className="flex items-center text-xs text-slate-500">
                <ThumbsUp className="mr-1 h-3 w-3" />
                <span>198</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-1">
              <Link
                href="/community/post/456"
                className="line-clamp-2 text-sm font-medium hover:text-green-700"
              >
                당구 초보자가 가장 많이 하는 실수 TOP 5
              </Link>
              <div className="flex items-center text-xs text-slate-500">
                <ThumbsUp className="mr-1 h-3 w-3" />
                <span>142</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-1">
              <Link
                href="/community/post/789"
                className="line-clamp-2 text-sm font-medium hover:text-green-700"
              >
                모든 당구인이 알아야 할 기본 규칙과 에티켓
              </Link>
              <div className="flex items-center text-xs text-slate-500">
                <ThumbsUp className="mr-1 h-3 w-3" />
                <span>117</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 인기 태그 */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">인기 태그</CardTitle>
        </CardHeader>
        <CardContent className="py-3">
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag, index) => (
              <Link key={index} href={`/community/tag/${tag.name}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-slate-100"
                >
                  #{tag.name}
                  <span className="ml-1 text-xs text-slate-500">
                    ({tag.count})
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 활발한 유저 */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">
            이달의 활발한 유저
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {activeUsers.map((user, index) => (
            <Link
              key={index}
              href={`/community/user/${user.name}`}
              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50"
            >
              <div className="flex items-center">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user.points}P
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* 다가오는 이벤트 */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">다가오는 이벤트</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-0">
          <div className="space-y-3 py-2">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="space-y-1">
                <Link
                  href={`/events/${index}`}
                  className="text-sm font-medium hover:text-green-700"
                >
                  {event.title}
                </Link>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{event.date}</span>
                  </div>
                  <span>{event.location}</span>
                </div>
                {index < upcomingEvents.length - 1 && (
                  <Separator className="mt-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
