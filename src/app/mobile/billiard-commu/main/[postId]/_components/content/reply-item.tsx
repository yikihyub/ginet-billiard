'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Heart, MoreHorizontal, CornerDownRight } from 'lucide-react';
import { formatRelativeTime } from '@/utils/(community)/time';
import { Comment } from '@/types/(community)/community';

interface ReplyItemProps {
  reply: Comment;
  editingComment: Comment | null;
  setEditingComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  onUpdateComment: (commentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => Promise<boolean>;
  onLikeComment: (commentId: number) => void;
}

export default function ReplyItem({
  reply,
  editingComment,
  setEditingComment,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
}: ReplyItemProps) {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const isAuthor = session?.user?.mb_id === reply.author_id.toString();
  const isDeleted = reply.is_deleted;

  return (
    <div className="mt-2 pt-2">
      <div className="flex">
        <CornerDownRight className="mr-2 h-4 w-4" />
        <div className="mr-2 h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          {!isDeleted && reply.bi_user?.profile_image ? (
            <Image
              src={reply.bi_user.profile_image}
              alt={reply.bi_user.name}
              width={24}
              height={24}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
              <Image
                src="/logo/billiard-ball2.png"
                alt={reply.bi_user.name}
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex-1">
          {editingComment?.id === reply.id ? (
            // 답글 수정 폼
            <div className="mt-1">
              <textarea
                ref={editInputRef}
                defaultValue={reply.content}
                rows={2}
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                placeholder="답글을 수정하세요"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setEditingComment(null)}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                >
                  취소
                </button>
                <button
                  onClick={() =>
                    onUpdateComment(reply.id, editInputRef.current?.value || '')
                  }
                  className="rounded-md bg-green-500 px-2 py-1 text-xs text-white"
                >
                  수정
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-bold text-gray-900">
                    {isDeleted ? '(삭제됨)' : reply.bi_user?.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatRelativeTime(reply.created_at)}
                  </span>
                </div>
                {!isDeleted && isAuthor && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 top-6 z-10 w-24 rounded-md border border-gray-200 bg-white py-1 shadow-md">
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setEditingComment(reply);
                          }}
                          className="block w-full px-4 py-1 text-left text-sm hover:bg-gray-100"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            onDeleteComment(reply.id);
                          }}
                          className="block w-full px-4 py-1 text-left text-sm text-red-500 hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="my-1 text-sm text-gray-800">{reply.content}</p>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <button
                  onClick={() => onLikeComment(reply.id)}
                  className="flex items-center"
                >
                  <Heart
                    size={12}
                    className={`mr-1 ${
                      reply.liked ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span>{reply._count?.bi_comment_like || 0}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
