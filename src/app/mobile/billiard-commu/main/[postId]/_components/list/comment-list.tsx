'use client';

import { Dispatch, SetStateAction } from 'react';
import CommentItem from '../content/comment-item';
import { Comment } from '@/types/(community)/community';

interface CommentListProps {
  comments: Comment[];
  loading: boolean;
  replyTo: Comment | null;
  editingComment: Comment | null;
  setReplyTo: Dispatch<SetStateAction<Comment | null>>;
  setEditingComment: Dispatch<SetStateAction<Comment | null>>;
  onAddReply: (parentId: number, content: string) => Promise<boolean>;
  onUpdateComment: (commentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => Promise<boolean>;
  onLikeComment: (commentId: number) => void;
}

export default function CommentList({
  comments,
  loading,
  replyTo,
  editingComment,
  setReplyTo,
  setEditingComment,
  onAddReply,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
}: CommentListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-gray-500">
        첫 댓글을 남겨보세요!
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          replyTo={replyTo}
          editingComment={editingComment}
          setReplyTo={setReplyTo}
          setEditingComment={setEditingComment}
          onAddReply={onAddReply}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          onLikeComment={onLikeComment}
        />
      ))}
    </div>
  );
}
