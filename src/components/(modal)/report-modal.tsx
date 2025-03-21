'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: string;
  username: string;
  contentId?: string;
  contentType?: string; // 'post', 'comment' 등
  contentPreview?: string; // 신고 대상 콘텐츠 미리보기
}

type ReportType =
  | 'HARASSMENT'
  | 'SPAM'
  | 'INAPPROPRIATE_CONTENT'
  | 'HATE_SPEECH'
  | 'THREAT'
  | 'PERSONAL_INFO'
  | 'OTHER';

const reportTypeLabels: Record<ReportType, string> = {
  HARASSMENT: '괴롭힘',
  SPAM: '스팸',
  INAPPROPRIATE_CONTENT: '부적절한 콘텐츠',
  HATE_SPEECH: '혐오 발언',
  THREAT: '위협',
  PERSONAL_INFO: '개인정보 노출',
  OTHER: '기타',
};

export default function ReportModal({
  isOpen,
  onClose,
  reportedUserId,
  contentId,
  contentType,
  contentPreview,
  username,
}: ReportModalProps) {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return;
    }

    if (!selectedType) {
      toast({ title: '신고 유형을 선택해주세요.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportedUserId,
          contentId,
          contentType,
          type: selectedType,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '신고 처리 중 오류가 발생했습니다.');
      }

      toast({ title: '신고가 접수되었습니다.' });
      onClose();

      // 폼 초기화
      setSelectedType(null);
      setDescription('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: '신고 접수 실패',
        description:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="text-lg font-bold">신고하기</div>
        </div>

        {contentPreview && (
          <div className="mb-4 rounded-md bg-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-700">작성자 : {username}</p>
            <p className="mt-1 line-clamp-3 text-gray-600">
              카테고리 : {contentPreview}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mb-2 block text-sm font-semibold">
              신고 유형 선택
            </div>
            <div className="grid">
              {(Object.keys(reportTypeLabels) as ReportType[]).map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center border p-3 transition-colors ${
                    selectedType === type
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type}
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type)}
                    className="mr-2 h-4 w-4 accent-green-500"
                  />
                  <span>{reportTypeLabels[type]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 block text-sm font-semibold">
              상세 내용 (선택사항)
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="신고 사유에 대해 자세히 적어주세요."
              className="w-full rounded-md border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
              rows={4}
              maxLength={500}
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:bg-red-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? '처리 중...' : '신고하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
