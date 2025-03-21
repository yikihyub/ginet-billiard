'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import FilterBar from '../filter/filter-bar';
import PostList from '../list/post-list';
import AdBanner from '../banner/ad-banner';
import WriteButton from '../button/post-button';

import { usePosts } from '@/hooks/community/usePost';

export default function CommunityContainer() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || 'all';
  const filter = searchParams.get('filter') || 'all';

  const { data, isLoading, isError, updateLikeStatus } = usePosts(
    page,
    category,
    filter
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <FilterBar activeFilter={filter} />
      <AdBanner />
      <PostList
        data={data}
        isLoading={isLoading}
        isError={isError}
        filter={filter}
        category={category}
        updateLikeStatus={updateLikeStatus || (() => {})}
      />
      <WriteButton />
    </div>
  );
}
