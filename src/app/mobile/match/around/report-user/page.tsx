'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// 신고 유형 정의
const REPORT_TYPES = [
  { id: 'HARASSMENT', label: '괴롭힘' },
  { id: 'SPAM', label: '스팸' },
  { id: 'INAPPROPRIATE_CONTENT', label: '부적절한 콘텐츠' },
  { id: 'HATE_SPEECH', label: '혐오 발언' },
  { id: 'THREAT', label: '위협' },
  { id: 'PERSONAL_INFO', label: '개인정보 침해' },
  { id: 'OTHER', label: '기타' },
];

export default function ReportUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // URL 파라미터에서 신고할 사용자 정보 가져오기
  const reportedUserId = searchParams.get('userId');
  const userName = searchParams.get('userName') || '해당 사용자';

  // 콘텐츠 관련 정보 (해당되는 경우)
  const contentId = searchParams.get('contentId');
  const contentType = searchParams.get('contentType');

  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 필수 사용자 ID가 없는 경우 오류 메시지 표시
  if (!reportedUserId) {
    return (
      <div className="p-4">
        <div className="mt-10 text-center">
          <p className="text-red-500">신고할 사용자 정보가 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-lg bg-gray-200 px-4 py-2"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          contentId: contentId || undefined,
          contentType: contentType || undefined,
          type: selectedType,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '신고 접수 중 오류가 발생했습니다.');
      }

      toast({ title: '신고가 접수되었습니다.' });
      router.back();
    } catch (error: any) {
      console.log(error);
      toast({
        title: error.message || '신고 접수 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <div className="mx-auto max-w-md bg-white p-6">
          <div className="mb-6">
            <h2 className="mb-2 text-center text-xl font-semibold">
              {userName} 신고하기
            </h2>
            <p className="text-center text-sm text-gray-500">
              신고 내용은 관리자만 확인할 수 있으며, 관련 조치가 취해집니다.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 신고 유형 선택 */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                신고 유형 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {REPORT_TYPES.map((type) => (
                  <div key={type.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`type-${type.id}`}
                      name="reportType"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={() => setSelectedType(type.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`type-${type.id}`} className="text-sm">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                상세 설명
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="신고 이유를 자세히 적어주세요 (선택사항)"
                className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                rows={4}
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedType}
              className={`w-full rounded-lg py-3 font-medium text-white ${
                isSubmitting || !selectedType
                  ? 'bg-gray-400'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSubmitting ? '처리 중...' : '신고하기'}
            </button>

            {/* 안내 문구 */}
            <p className="mt-4 text-center text-xs text-gray-500">
              악의적인 신고나 허위 신고는 제재 대상이 될 수 있습니다.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
