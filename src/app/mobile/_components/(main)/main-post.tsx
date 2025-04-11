import { prisma } from '@/lib/prisma';
import PopularPostsClient from './list/popular-post';

export default async function PopularPosts() {
  const posts = await prisma.bi_post.findMany({
    where: { is_deleted: false },
    orderBy: { view_count: 'desc' },
    take: 10,
    include: {
      bi_user: { select: { name: true } },
      bi_category: { select: { name: true, id: true } },
      bi_post_like: true,
      bi_comment: true,
    },
  });

  const serializedPosts = posts.map((post) => ({
    ...post,
    created_at: post.created_at?.toISOString() ?? '',
    view_count: post.view_count ?? 0,
  }));

  return <PopularPostsClient initialPosts={serializedPosts} />;
}
