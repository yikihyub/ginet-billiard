'use client';

import ReplyItem from '../content/reply-item';
import { Comment } from '@/types/(community)/community';

interface ReplyListProps {
  replies: Comment[];
  editingComment: Comment | null;
  setEditingComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  onUpdateComment: (commentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => Promise<boolean>;
  onLikeComment: (commentId: number) => void;
}

export default function ReplyList({
  replies,
  editingComment,
  setEditingComment,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
}: ReplyListProps) {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 pl-10">
      {replies.map((reply) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          onLikeComment={onLikeComment}
        />
      ))}
    </div>
  );
}
