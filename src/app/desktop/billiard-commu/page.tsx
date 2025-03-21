'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageCircle,
  ThumbsUp,
  Eye,
  Clock,
  Filter,
  ChevronDown,
  Search,
  PenTool,
  BookOpen,
  Map,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import CommunitySidebar from './_components/sidebar/sidebar';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count: string;
  color: string;
}

interface PostProps {
  post: any;
  id: number;
  title: string;
  content: string;
  tags?: string[];
  author: {
    name: string;
    url: string;
  };
  likes: number;
  comments: number;
  views: number;
  date: string;
  thumbnail?: string;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('all');
  console.log(activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 커뮤니티 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">당구 커뮤니티</h1>
        <p className="mt-2 text-slate-600">
          당구를 사랑하는 모든 분들을 위한 공간입니다
        </p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 사이드바 */}
        <div className="hidden lg:block">
          <CommunitySidebar />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          {/* 상단 카테고리 카드 섹션 */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <CategoryCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="자유게시판"
              description="당구에 관한 자유로운 이야기를 나눠보세요"
              count="1.2k"
              color="bg-blue-500"
            />
            <CategoryCard
              icon={<BookOpen className="h-6 w-6" />}
              title="당구 팁 & 노하우"
              description="당구 기술과 전략을 공유하는 공간입니다"
              count="856"
              color="bg-green-500"
            />
            <CategoryCard
              icon={<Map className="h-6 w-6" />}
              title="당구장 정보"
              description="전국 각지 당구장 정보와 리뷰를 확인하세요"
              count="634"
              color="bg-amber-500"
            />
            <CategoryCard
              icon={<Trophy className="h-6 w-6" />}
              title="대회 소식"
              description="각종 당구 대회 소식과 결과를 공유합니다"
              count="412"
              color="bg-purple-500"
            />
          </div>

          {/* 검색 및 필터링 영역 */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-slate-400"
                size={18}
              />
              <Input placeholder="커뮤니티 검색" className="pl-10" />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter size={16} />
                    <span>필터</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>최신순</DropdownMenuItem>
                  <DropdownMenuItem>인기순</DropdownMenuItem>
                  <DropdownMenuItem>조회순</DropdownMenuItem>
                  <DropdownMenuItem>댓글순</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="flex items-center gap-2 lg:hidden">
                <PenTool size={16} />
                <span>글쓰기</span>
              </Button>
            </div>
          </div>

          {/* 게시글 탭 섹션 */}
          <Tabs
            defaultValue="all"
            className="mb-8"
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-6 grid grid-cols-5">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="hot">인기</TabsTrigger>
              <TabsTrigger value="following">팔로잉</TabsTrigger>
              <TabsTrigger value="questions">질문</TabsTrigger>
              <TabsTrigger value="videos">동영상</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {posts.map((post, index) => (
                <PostCard
                  key={index}
                  post={post}
                  id={0}
                  title={''}
                  content={''}
                  author={{
                    name: '',
                    url: '',
                  }}
                  likes={0}
                  comments={0}
                  views={0}
                  date={''}
                />
              ))}
            </TabsContent>

            <TabsContent value="hot">
              <div className="p-8 text-center text-slate-500">
                인기 게시글을 준비 중입니다.
              </div>
            </TabsContent>

            {/* 기타 탭 콘텐츠는 필요에 따라 추가 */}
          </Tabs>
        </div>

        {/* 모바일용 고정 하단 버튼 */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
            <PenTool size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// 카테고리 카드 컴포넌트
function CategoryCard({
  icon,
  title,
  description,
  count,
  color,
}: CategoryCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
      <CardHeader className={`${color} p-4 text-white`}>
        <div className="flex items-center justify-between">
          {icon}
          <Badge variant="outline" className="bg-white/20 text-white">
            {count}개 글
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link
          href={`/community/${title}`}
          className="text-sm text-blue-600 hover:underline"
        >
          바로가기 →
        </Link>
      </CardFooter>
    </Card>
  );
}

// 게시글 카드 컴포넌트
function PostCard({ post }: PostProps) {
  return (
    <Card className="overflow-hidden transition-colors hover:bg-slate-50">
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock size={12} />
              <span>{post.date}</span>
            </div>
          </div>
        </div>

        <Link href={`/community/post/${post.id}`}>
          <h3 className="mb-2 text-xl font-semibold transition-colors hover:text-blue-600">
            {post.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-2 text-slate-600">{post.content}</p>

        {post.tags && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag: any, index: any) => (
              <Badge key={index} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {post.thumbnail && (
          <div className="mb-4 overflow-hidden rounded-md">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="h-48 w-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUp size={14} />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>{post.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{post.views}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            저장
          </Button>
        </div>
      </div>
    </Card>
  );
}

// 샘플 게시글 데이터
const posts = [
  {
    id: 1,
    title: '초보자가 쉽게 배울 수 있는 당구 기본 자세 추천',
    content:
      '당구를 막 시작한 초보자분들을 위해 제가 처음 배웠던 기본 자세와 스트로크 방법을 공유합니다. 자세가 가장 중요하다고 생각하는데요, 특히 큐대를 잡는 방법과 브릿지 자세가 기본입니다...',
    tags: ['초보자팁', '기본자세', '스트로크'],
    author: {
      name: '당구마스터',
      avatar: '/avatars/user1.jpg',
    },
    likes: 124,
    comments: 36,
    views: 1892,
    date: '3시간 전',
    thumbnail: '/images/billiards-stance.jpg',
  },
  {
    id: 2,
    title: '서울 홍대 지역에서 가성비 좋은 당구장 추천 부탁드립니다',
    content:
      '이번에 홍대 근처로 이사를 가게 되었는데, 근처에 시간당 요금이 적당하고 관리가 잘 되어있는 당구장이 어디 있을까요? 가능하면 4구대가 많은 곳이면 좋겠습니다...',
    tags: ['장소추천', '홍대', '4구대'],
    author: {
      name: '홍대당구러',
      avatar: '/avatars/user2.jpg',
    },
    likes: 48,
    comments: 27,
    views: 763,
    date: '7시간 전',
  },
  {
    id: 3,
    title: '3쿠션 더블 쿠션샷 연습하는 방법 공유합니다',
    content:
      '안녕하세요, 3쿠션 당구를 배운지 1년 정도 되었습니다. 최근에 더블 쿠션샷을 연습하고 있는데 제가 배운 효과적인 연습 방법을 공유해드립니다...',
    tags: ['3쿠션', '중급자', '연습방법'],
    author: {
      name: '쓰리쿠션맨',
      avatar: '/avatars/user3.jpg',
    },
    likes: 201,
    comments: 54,
    views: 2453,
    date: '1일 전',
    thumbnail: '/images/billiards-technique.jpg',
  },
];
