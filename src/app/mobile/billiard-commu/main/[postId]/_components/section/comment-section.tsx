'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import CommentList from '../list/comment-list';
import { Comment } from '@/types/(community)/community';
import FixedCommentForm from '../form/fixed-comment-form';

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  // 댓글 목록 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/community/${postId}/comments/getcomments`
        );

        if (!response.ok) {
          throw new Error('댓글을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setComments(data || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
        toast({ title: '댓글을 불러오는데 실패했습니다.' });
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, toast]);

  // 댓글 작성
  const handleAddComment = async (content: string) => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return false;
    }

    if (!content.trim()) {
      toast({ title: '댓글 내용을 입력해주세요.' });
      return false;
    }

    try {
      const response = await fetch(
        `/api/community/${postId}/comments/postcomments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.');
      }

      const newComment = await response.json();
      setComments((prev) => [newComment, ...prev]);
      toast({ title: '댓글이 등록되었습니다.' });
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast({ title: '댓글 작성에 실패했습니다.' });
      return false;
    }
  };

  // 답글 작성
  const handleAddReply = async (parentId: number, content: string) => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return false;
    }

    try {
      const response = await fetch(
        `/api/community/${postId}/comments/postcomments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            parentId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('답글 작성에 실패했습니다.');
      }

      const newReply = await response.json();

      // 댓글 목록 업데이트
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                other_bi_comment: [...comment.other_bi_comment, newReply],
              }
            : comment
        )
      );

      setReplyTo(null);
      toast({ title: '답글이 등록되었습니다.' });
      return true;
    } catch (err) {
      console.error('Error posting reply:', err);
      toast({ title: '답글 작성에 실패했습니다.' });
      return false;
    }
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId: number, content: string) => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return false;
    }

    try {
      const response = await fetch(
        `/api/community/${commentId}/comments/updatecomments`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error('댓글 수정에 실패했습니다.');
      }

      const updatedComment = await response.json();

      // 댓글 목록 업데이트 (부모 댓글과 답글 모두 고려)
      setComments((prevComments) =>
        prevComments.map((comment) => {
          // 부모 댓글인 경우
          if (comment.id === commentId) {
            return { ...comment, ...updatedComment };
          }
          // 답글 목록 내에 있는 경우
          if (
            comment.other_bi_comment?.some((reply) => reply.id === commentId)
          ) {
            return {
              ...comment,
              other_bi_comment: comment.other_bi_comment.map((reply) =>
                reply.id === commentId ? { ...reply, ...updatedComment } : reply
              ),
            };
          }
          return comment;
        })
      );

      setEditingComment(null);
      toast({ title: '댓글이 수정되었습니다.' });
      return true;
    } catch (err) {
      console.error('Error updating comment:', err);
      toast({ title: '댓글 수정에 실패했습니다.' });
      return false;
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return false;
    }

    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return false;
    }

    try {
      const response = await fetch(
        `/api/community/${commentId}/comments/deletecomments`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('댓글 삭제에 실패했습니다.');
      }

      // 댓글 목록에서 삭제된 댓글 처리 (실제로는 is_deleted가 true로 변경됨)
      setComments((prevComments) =>
        prevComments.map((comment) => {
          // 부모 댓글인 경우
          if (comment.id === commentId) {
            return {
              ...comment,
              is_deleted: true,
              content: '삭제된 댓글입니다.',
            };
          }
          // 답글 목록 내에 있는 경우
          if (
            comment.other_bi_comment?.some((reply) => reply.id === commentId)
          ) {
            return {
              ...comment,
              other_bi_comment: comment.other_bi_comment.map((reply) =>
                reply.id === commentId
                  ? {
                      ...reply,
                      is_deleted: true,
                      content: '삭제된 댓글입니다.',
                    }
                  : reply
              ),
            };
          }
          return comment;
        })
      );

      toast({ title: '댓글이 삭제되었습니다.' });
      return true;
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast({ title: '댓글 삭제에 실패했습니다.' });
      return false;
    }
  };

  // 댓글 좋아요
  const handleCommentLike = async (commentId: number) => {
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
      const reply = comment.other_bi_comment?.find((r) => r.id === commentId);
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
    const currentLikeCount = currentComment._count?.bi_comment_like || 0;

    // 낙관적 업데이트
    const newLikeCount = isCurrentlyLiked
      ? currentLikeCount - 1
      : currentLikeCount + 1;

    // 댓글 목록 업데이트
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (!isReply && comment.id === commentId) {
          // 부모 댓글인 경우
          return {
            ...comment,
            liked: !isCurrentlyLiked,
            _count: {
              ...comment._count,
              bi_comment_like: newLikeCount,
            },
          };
        } else if (isReply && comment.id === parentId) {
          // 답글인 경우
          return {
            ...comment,
            other_bi_comment: comment.other_bi_comment?.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    liked: !isCurrentlyLiked,
                    _count: {
                      ...reply._count,
                      bi_comment_like: newLikeCount,
                    },
                  }
                : reply
            ),
          };
        }
        return comment;
      })
    );

    try {
      // API 호출
      const response = await fetch(
        `/api/community/comments/${commentId}/like`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        // 실패 시 원래 상태로 되돌리기
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (!isReply && comment.id === commentId) {
              return {
                ...comment,
                liked: isCurrentlyLiked,
                _count: {
                  ...comment._count,
                  bi_comment_like: currentLikeCount,
                },
              };
            } else if (isReply && comment.id === parentId) {
              return {
                ...comment,
                other_bi_comment: comment.other_bi_comment?.map((reply) =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        liked: isCurrentlyLiked,
                        _count: {
                          ...reply._count,
                          bi_comment_like: currentLikeCount,
                        },
                      }
                    : reply
                ),
              };
            }
            return comment;
          })
        );
        throw new Error('좋아요 처리에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error liking comment:', err);
      toast({ title: '좋아요 처리에 실패했습니다.' });
    }
  };

  return (
    <div>
      {/* 댓글 작성 폼 */}
      {/* <CommentForm onSubmit={handleAddComment} /> */}

      {/* 댓글 목록 */}
      <CommentList
        comments={comments}
        loading={loading}
        replyTo={replyTo}
        editingComment={editingComment}
        setReplyTo={setReplyTo}
        setEditingComment={setEditingComment}
        onAddReply={handleAddReply}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onLikeComment={handleCommentLike}
      />

      <FixedCommentForm onSubmit={handleAddComment} />
    </div>
  );
}
