'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Post } from '@/types/(community)/community';
import { useToast } from '@/hooks/use-toast';

import PostHeader from './_components/header/post-header';
import PostContent from './_components/content/post-content';
import PostImages from './_components/images/post-images';
import PostActions from './_components/button/post-actions';
import CommentSection from './_components/section/comment-section';

export default function ClubDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/community/${postId}`);

        if (!response.ok) {
          throw new Error('게시글을 불러오는데 실패했습니다.');
        }

        const data = await response.json();

        setPost(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || '오류가 발생했습니다.');
        toast({ title: '게시글을 불러오는데 실패했습니다.' });
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchClubData();
    }
  }, [postId, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
        <p className="mb-4 text-red-500">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="rounded-md bg-green-500 px-4 py-2 text-white"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-white pb-20">
      <main className="mx-auto max-w-lg">
        <PostHeader
          user={post.bi_user}
          postUserId={post.author_id}
          createdAt={post.created_at}
          postId={Number(postId)}
        />
        <PostContent
          title={post.title}
          content={post.content}
          tags={post.bi_post_tag}
        />
        {post.bi_post_image && post.bi_post_image.length > 0 && (
          <PostImages images={post.bi_post_image} />
        )}
        <PostActions
          postId={post.id}
          likesCount={post._count?.bi_post_like || 0}
          commentsCount={post._count?.bi_comment || 0}
        />
        <CommentSection postId={parseInt(postId as string, 10)} />
      </main>
    </div>
  );
}
