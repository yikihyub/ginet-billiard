'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

// 댓글 타입 정의
export interface Comment {
  id: number;
  content: string;
  post_id: number;
  author_id: string;
  parent_id: number | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  bi_user: {
    id: number;
    name: string;
    profile_image: string | null;
  };
  other_bi_comment: Comment[];
  _count: {
    bi_comment_like: number;
  };
  liked?: boolean; // 현재 사용자가 좋아요를 눌렀는지
}

export function useComments(postId: number) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  // 댓글 목록 조회
  const fetchComments = useCallback(async () => {
    if (!postId) return;
    
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const result = await response.json();
      setComments(result);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // 댓글 작성
  const addComment = useCallback(async (content: string, parentId?: number) => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return false;
    }

    if (!content.trim()) {
      toast({ title: '댓글 내용을 입력해주세요.' });
      return false;
    }

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          parentId: parentId || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({ title: errorData.error || '댓글 작성에 실패했습니다.' });
        return false;
      }

      const newComment = await response.json();
      
      // 댓글 목록 업데이트
      if (parentId) {
        // 답글인 경우
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === parentId 
              ? {
                  ...comment,
                  other_bi_comment: [...comment.other_bi_comment, newComment]
                }
              : comment
          )
        );
      } else {
        // 최상위 댓글인 경우
        setComments(prev => [newComment, ...prev]);
      }
      
      // 답글 작성 후 답글 모드 해제
      setReplyTo(null);
      
      toast({ title: '댓글이 작성되었습니다.' });
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast({ title: '댓글 작성 중 오류가 발생했습니다.' });
      return false;
    }
  }, [postId, session, toast]);

  // 댓글 수정
  const updateComment = useCallback(async (commentId: number, content: string) => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return false;
    }

    if (!content.trim()) {
      toast({ title: '댓글 내용을 입력해주세요.' });
      return false;
    }

    try {
      const response = await fetch(`/api/community/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({ title: errorData.error || '댓글 수정에 실패했습니다.' });
        return false;
      }

      const updatedComment = await response.json();
      
      // 댓글 목록 업데이트 (부모 댓글과 답글 모두 고려)
      setComments(prevComments => 
        prevComments.map(comment => {
          // 부모 댓글인 경우
          if (comment.id === commentId) {
            return { ...comment, ...updatedComment };
          }
          // 답글 목록 내에 있는 경우
          if (comment.other_bi_comment.some(reply => reply.id === commentId)) {
            return {
              ...comment,
              other_bi_comment: comment.other_bi_comment.map(reply => 
                reply.id === commentId ? { ...reply, ...updatedComment } : reply
              )
            };
          }
          return comment;
        })
      );
      
      toast({ title: '댓글이 수정되었습니다.' });
      return true;
    } catch (err) {
      console.error('Error updating comment:', err);
      toast({ title: '댓글 수정 중 오류가 발생했습니다.' });
      return false;
    }
  }, [session, toast]);

  // 댓글 삭제
  const deleteComment = useCallback(async (commentId: number) => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return false;
    }

    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return false;
    }

    try {
      const response = await fetch(`/api/community/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({ title: errorData.error || '댓글 삭제에 실패했습니다.' });
        return false;
      }

      // 댓글 목록에서 삭제된 댓글 처리 (실제로는 is_deleted가 true로 변경됨)
      setComments(prevComments => 
        prevComments.map(comment => {
          // 부모 댓글인 경우
          if (comment.id === commentId) {
            return { ...comment, is_deleted: true, content: '삭제된 댓글입니다.' };
          }
          // 답글 목록 내에 있는 경우
          if (comment.other_bi_comment.some(reply => reply.id === commentId)) {
            return {
              ...comment,
              other_bi_comment: comment.other_bi_comment.map(reply => 
                reply.id === commentId 
                  ? { ...reply, is_deleted: true, content: '삭제된 댓글입니다.' } 
                  : reply
              )
            };
          }
          return comment;
        })
      );
      
      toast({ title: '댓글이 삭제되었습니다.' });
      return true;
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast({ title: '댓글 삭제 중 오류가 발생했습니다.' });
      return false;
    }
  }, [session, toast]);

  // 댓글 좋아요 토글
  const toggleCommentLike = useCallback(async (commentId: number) => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return;
    }

    // 현재 댓글 상태 찾기
    let currentComment: Comment | undefined;
    let isReply = false;
    let parentId: number | null = null;

    // 모든 댓글과 답글에서 해당 댓글 찾기
    for (const comment of comments) {
      if (comment.id === commentId) {
        currentComment = comment;
        break;
      }
      
      // 답글에서 찾기
      const reply = comment.other_bi_comment.find(r => r.id === commentId);
      if (reply) {
        currentComment = reply;
        isReply = true;
        parentId = comment.id;
        break;
      }
    }

    if (!currentComment) return;

    // 현재 좋아요 상태
    const isCurrentlyLiked = currentComment.liked || false;
    const currentLikeCount = currentComment._count.bi_comment_like;
    
    // 낙관적 업데이트
    const newLikeCount = isCurrentlyLiked ? currentLikeCount - 1 : currentLikeCount + 1;
    
    // 댓글 목록 업데이트
    setComments(prevComments => 
      prevComments.map(comment => {
        if (!isReply && comment.id === commentId) {
          // 부모 댓글인 경우
          return {
            ...comment,
            liked: !isCurrentlyLiked,
            _count: {
              ...comment._count,
              bi_comment_like: newLikeCount
            }
          };
        } else if (isReply && comment.id === parentId) {
          // 답글인 경우
          return {
            ...comment,
            other_bi_comment: comment.other_bi_comment.map(reply => 
              reply.id === commentId 
                ? {
                    ...reply,
                    liked: !isCurrentlyLiked,
                    _count: {
                      ...reply._count,
                      bi_comment_like: newLikeCount
                    }
                  } 
                : reply
            )
          };
        }
        return comment;
      })
    );

    try {
      // API 호출
      const response = await fetch(`/api/community/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        // 실패 시 원래 상태로 되돌리기
        setComments(prevComments => 
          prevComments.map(comment => {
            if (!isReply && comment.id === commentId) {
              return {
                ...comment,
                liked: isCurrentlyLiked,
                _count: {
                  ...comment._count,
                  bi_comment_like: currentLikeCount
                }
              };
            } else if (isReply && comment.id === parentId) {
              return {
                ...comment,
                other_bi_comment: comment.other_bi_comment.map(reply => 
                  reply.id === commentId 
                    ? {
                        ...reply,
                        liked: isCurrentlyLiked,
                        _count: {
                          ...reply._count,
                          bi_comment_like: currentLikeCount
                        }
                      } 
                    : reply
                )
              };
            }
            return comment;
          })
        );
        
        const errorData = await response.json();
        toast({ title: errorData.error || '작업에 실패했습니다.' });
      } else {
        const result = await response.json();
        // 좋아요 수를 서버 응답값으로 정확하게 업데이트 (선택 사항)
        if (result.likeCount !== newLikeCount) {
          setComments(prevComments => 
            prevComments.map(comment => {
              if (!isReply && comment.id === commentId) {
                return {
                  ...comment,
                  _count: {
                    ...comment._count,
                    bi_comment_like: result.likeCount
                  }
                };
              } else if (isReply && comment.id === parentId) {
                return {
                  ...comment,
                  other_bi_comment: comment.other_bi_comment.map(reply => 
                    reply.id === commentId 
                      ? {
                          ...reply,
                          _count: {
                            ...reply._count,
                            bi_comment_like: result.likeCount
                          }
                        } 
                      : reply
                  )
                };
              }
              return comment;
            })
          );
        }
      }
    } catch (err) {
      // 에러 발생 시 원래 상태로 되돌리기
      setComments(prevComments => 
        prevComments.map(comment => {
          if (!isReply && comment.id === commentId) {
            return {
              ...comment,
              liked: isCurrentlyLiked,
              _count: {
                ...comment._count,
                bi_comment_like: currentLikeCount
              }
            };
          } else if (isReply && comment.id === parentId) {
            return {
              ...comment,
              other_bi_comment: comment.other_bi_comment.map(reply => 
                reply.id === commentId 
                  ? {
                      ...reply,
                      liked: isCurrentlyLiked,
                      _count: {
                        ...reply._count,
                        bi_comment_like: currentLikeCount
                      }
                    } 
                  : reply
              )
            };
          }
          return comment;
        })
      );
      
      console.error('Error toggling comment like:', err);
      toast({ title: '작업 중 오류가 발생했습니다.' });
    }
  }, [comments, session, toast]);

  // 초기 데이터 로드
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [fetchComments, postId]);

  return {
    comments,
    isLoading,
    isError,
    error,
    replyTo,
    setReplyTo,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    toggleCommentLike
  };
}