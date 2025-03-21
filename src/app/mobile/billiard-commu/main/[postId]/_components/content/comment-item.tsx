'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import ReplyList from '../list/reply-list';
import CommentForm from '../form/comment-form';
import { formatRelativeTime } from '@/utils/(community)/time';
import { Comment } from '@/types/(community)/community';

import { Heart, MessageSquare, MoreHorizontal } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  replyTo: Comment | null;
  editingComment: Comment | null;
  setReplyTo: React.Dispatch<React.SetStateAction<Comment | null>>;
  setEditingComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  onAddReply: (parentId: number, content: string) => Promise<boolean>;
  onUpdateComment: (commentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => Promise<boolean>;
  onLikeComment: (commentId: number) => void;
}

export default function CommentItem({
  comment,
  replyTo,
  editingComment,
  setReplyTo,
  setEditingComment,
  onAddReply,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
}: CommentItemProps) {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const isAuthor = session?.user?.mb_id === comment.author_id.toString();
  const isDeleted = comment.is_deleted;

  return (
    <div className="border-t border-gray-100 px-4 py-3">
      <div className="flex">
        {/* 프로필 이미지 */}
        <div className="mr-2 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          {!isDeleted && comment.bi_user?.profile_image ? (
            <Image
              src={comment.bi_user.profile_image}
              alt={comment.bi_user.name}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-500">
              <Image
                src="/logo/billiard-ball2.png"
                alt={comment.bi_user.name}
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1">
          {editingComment?.id === comment.id ? (
            // 댓글 수정 폼
            <div className="mt-1">
              <textarea
                ref={editInputRef}
                defaultValue={comment.content}
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                placeholder="댓글을 수정하세요"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setEditingComment(null)}
                  className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-700"
                >
                  취소
                </button>
                <button
                  onClick={() =>
                    onUpdateComment(
                      comment.id,
                      editInputRef.current?.value || ''
                    )
                  }
                  className="rounded-md bg-green-500 px-3 py-1 text-xs text-white"
                >
                  수정
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-gray-900">
                    {isDeleted ? '(삭제됨)' : comment.bi_user?.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>
                {!isDeleted && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 top-8 z-10 w-24 rounded-md border border-gray-200 bg-white py-1 shadow-md">
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setReplyTo(comment);
                          }}
                          className="block w-full px-4 py-1 text-left text-sm hover:bg-gray-100"
                        >
                          답글
                        </button>
                        {isAuthor && (
                          <>
                            <button
                              onClick={() => {
                                setShowMenu(false);
                                setEditingComment(comment);
                              }}
                              className="block w-full px-4 py-1 text-left text-sm hover:bg-gray-100"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => {
                                setShowMenu(false);
                                onDeleteComment(comment.id);
                              }}
                              className="block w-full px-4 py-1 text-left text-sm text-red-500 hover:bg-red-50"
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="my-1 text-gray-800">{comment.content}</p>

              {/* 좋아요 및 답글 버튼 */}
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <button
                  onClick={() => onLikeComment(comment.id)}
                  className="mr-3 flex items-center"
                >
                  <Heart
                    size={14}
                    className={`mr-1 ${
                      comment.liked ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span>{comment._count?.bi_comment_like || 0}</span>
                </button>
                {!isDeleted && (
                  <button
                    onClick={() => setReplyTo(comment)}
                    className="flex items-center"
                  >
                    <MessageSquare size={14} className="mr-1" />
                    <span>답글</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 답글 입력 폼 */}
      {replyTo?.id === comment.id && (
        <div className="ml-10 mt-2">
          <CommentForm
            onSubmit={(content) => onAddReply(comment.id, content)}
            onCancel={() => setReplyTo(null)}
            placeholder={`${comment.bi_user?.name}님에게 답글 작성...`}
            isReply={true}
            autoFocus={true}
          />
        </div>
      )}

      {/* 답글 목록 */}
      {comment.other_bi_comment?.length > 0 && (
        <ReplyList
          replies={comment.other_bi_comment}
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          onLikeComment={onLikeComment}
        />
      )}
    </div>
  );
}
