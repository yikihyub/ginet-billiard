import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    post?: 'mypost' | 'mycomment' | 'mylike';
  }>;
}

export default async function LatestPost({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.mb_id;
  const userNumId = Number(session?.user?.id);

  if (!userId) return notFound();

  const params = await searchParams;
  const postType = params.post ?? 'mypost';

  let myData: any[] = [];

  if (postType === 'mypost') {
    myData = await prisma.bi_post.findMany({
      where: {
        author_id: userId,
        is_deleted: false,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10,
      include: {
        bi_category: true,
        bi_comment: true,
      },
    });
  } else if (postType === 'mycomment') {
    myData = await prisma.bi_comment.findMany({
      where: { author_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10,
      include: { bi_post: true },
    });
  } else if (postType === 'mylike') {
    myData = await prisma.bi_post_like.findMany({
      where: { user_id: userNumId },
      orderBy: { created_at: 'desc' },
      take: 10,
      include: {
        bi_post: {
          include: {
            bi_comment: true, // 댓글들
            bi_post_like: true, // 좋아요들
            bi_category: true, // 카테고리
          },
        },
      },
    });
  }

  return (
    <div className="mt-2 min-h-screen bg-white px-4">
      {postType === 'mypost' && (
        <ul>
          {myData.map((post: any) => (
            <li key={post.id} className="border-b py-4">
              <Link
                href={`/mobile/billiard-commu/main/${post?.id}`}
                key={post.id}
              >
                {/* 카테고리명 */}
                <div className="text-sm font-semibold text-[#207A24]">
                  &#91;{post.bi_category?.name ?? '없음'}&#93;
                </div>

                {/* 제목 + 댓글 */}
                <div className="flex items-center justify-between">
                  {/* 게시물 제목 */}
                  <div className="items-center text-base font-medium">
                    {post.title}
                  </div>

                  {/* 댓글 수 (세로 정렬) */}
                  <div className="flex flex-col items-center text-sm text-gray-500">
                    <div className="text-center font-semibold">
                      {post.bi_comment.length}
                    </div>
                    <div>댓글</div>
                  </div>
                </div>

                {/* 작성일 */}
                <div className="text-sm text-gray-400">
                  {post.created_at?.toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {postType === 'mycomment' && (
        <ul>
          {myData.map((comment: any) => (
            <li key={comment.id} className="border-b py-4">
              <Link
                href={`/mobile/billiard-commu/main/${comment.bi_post?.id}`}
                key={comment.id}
              >
                {/* 댓글 내용 */}
                <div className="items-center text-base font-medium">
                  {comment.content}
                </div>

                {/* 원글 제목 */}
                <div className="mt-1 text-xs font-bold text-gray-500">
                  원글:
                  <span className="ml-1 text-[#207A24]">
                    {comment.bi_post?.title ?? '삭제된 게시물'}
                  </span>
                </div>

                {/* 댓글 작성일 (선택) */}
                <div className="text-sm text-gray-400">
                  {comment.created_at?.toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {postType === 'mylike' && (
        <ul>
          {myData.map((like: any) => {
            const post = like.bi_post;
            if (!post) return null; // 삭제된 게시물 예외 처리

            return (
              <li key={like.id} className="gap-4 border-b py-4">
                <Link
                  href={`/mobile/billiard-commu/main/${post?.id}`}
                  key={post?.id}
                  className="flex justify-between"
                >
                  {/* 왼쪽: 게시글 정보 */}
                  <div className="flex flex-col">
                    {/* 카테고리 */}
                    <div className="text-xs font-semibold text-[#207A24]">
                      &#91;{post.bi_category?.name ?? '없음'}&#93;
                    </div>

                    {/* 게시글 제목 */}
                    <div className="line-clamp-1 text-base font-medium text-black hover:underline">
                      {post.title}
                    </div>

                    {/* 작성일 */}
                    <div className="mt-1 text-xs text-gray-400">
                      {post.created_at?.toLocaleString()}
                    </div>
                  </div>

                  {/* 오른쪽: 댓글/좋아요 수 + 좋아요한 하트 */}
                  <div className="flex flex-col items-end justify-between">
                    {/* 오른쪽 상단 하트 표시 */}
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />

                    {/* 댓글 / 좋아요 수 */}
                    <div className="mt-auto flex gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />{' '}
                        {post.bi_comment.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                        {post.bi_post_like.length}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
