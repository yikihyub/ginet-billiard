'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Send } from 'lucide-react';

interface CommentFormProps {
  initialValue?: string;
  onSubmit: (content: string) => Promise<boolean>;
  onCancel?: () => void;
  placeholder?: string;
  isReply?: boolean;
  autoFocus?: boolean;
}

export default function CommentForm({
  initialValue = '',
  onSubmit,
  onCancel,
  placeholder = '댓글을 남겨보세요',
  isReply = false,
  autoFocus = false,
}: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 초기값이 변경되면 content 업데이트
  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  // 자동 포커스 설정
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // 텍스트 영역 높이 자동 조절
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async () => {
    if (!session) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(content);
      if (success) {
        setContent('');
        if (inputRef.current) {
          inputRef.current.style.height = 'auto';
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex gap-2 ${isReply ? 'pl-8 pt-2' : 'px-4 py-3'}`}>
      <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || '사용자'}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500">
            {session?.user?.name?.[0] || '?'}
          </div>
        )}
      </div>
      <div className="relative flex flex-1 items-center">
        <textarea
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm outline-none focus:border-green-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="absolute right-3 rounded-full p-1 text-green-500 disabled:text-gray-300"
        >
          <Send size={16} />
        </button>
      </div>
      {isReply && onCancel && (
        <button
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
}
