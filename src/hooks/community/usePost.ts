'use client';
import { useState, useEffect, useCallback } from 'react';
import { PostsResponse } from '@/types/(community)/community';

export function usePosts(page: number, category: string, filter: string) {
  const [data, setData] = useState<PostsResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/community/posts/getposts?page=${page}&category=${category}&filter=${filter}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, category, filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 전체 데이터 새로고침
  const refetch = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  // 좋아요 상태만 업데이트하는 함수
  const updateLikeStatus = useCallback((postId: number, liked: boolean, likeCount: number) => {
    if (!data || !data.posts) return;
    
    setData(prevData => {
      // 데이터가 없으면 변경하지 않음
      if (!prevData || !prevData.posts) return prevData;
      
      // posts 배열의 복사본 생성
      const updatedPosts = [...prevData.posts];
      
      // 해당 게시글 찾기
      const postIndex = updatedPosts.findIndex(post => post.id === postId);
      
      // 게시글이 존재하면 좋아요 상태 업데이트
      if (postIndex !== -1) {
        updatedPosts[postIndex] = {
          ...updatedPosts[postIndex],
          liked: liked,
          likeCount: likeCount
        };
      }
      
      // 업데이트된 데이터 반환
      return {
        ...prevData,
        posts: updatedPosts
      };
    });
  }, [data]);

  return { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch,
    updateLikeStatus // 새로 추가된 함수
  };
}