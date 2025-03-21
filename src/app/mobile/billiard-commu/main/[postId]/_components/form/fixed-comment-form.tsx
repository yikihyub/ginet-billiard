'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface FixedCommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
}

export default function FixedCommentForm({ onSubmit }: FixedCommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="z-49 fixed bottom-0 left-0 right-0 flex items-center gap-3 border-t bg-white px-4 py-3">
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || '사용자'}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500">
            {session?.user?.name?.[0] || '?'}
          </div>
        )}
      </div>
      <div className="flex-1 rounded-full border bg-gray-50 px-4 py-2">
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 남겨보세요"
          className="w-full bg-transparent outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !content.trim()}
        className="rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white disabled:bg-green-300"
      >
        등록
      </button>
    </div>
  );
}
