import React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useTerms } from '@/hooks/login/useTerms';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TERMS_CONTENT } from '@/constants/(login)/terms/terms-content';

interface TermsFormProps {
  onNext: () => void;
}

export function TermsForm({ onNext }: TermsFormProps) {
  const {
    agreements,
    showError,
    modalOpen,
    selectedTerm,
    handleAllCheck,
    handleSingleCheck,
    handleSubmit,
    handleOpenModal,
    setModalOpen,
  } = useTerms(onNext);

  return (
    <>
      <h1 className="mb-8 text-center text-2xl font-bold">
        회원가입을 위해
        <br />
        약관에 동의해주세요
      </h1>

      {showError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>필수 약관에 모두 동의해주세요.</AlertDescription>
        </Alert>
      )}

      {/* 전체 동의 */}
      <div className="py-4">
        <label className="flex items-center gap-2">
          <Checkbox checked={agreements.all} onCheckedChange={handleAllCheck} />
          <span className="font-bold">모두 동의합니다</span>
        </label>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
      </div>

      {/* 개별 약관 */}
      <div className="mb-8 mt-4 space-y-8 p-4 text-[#333]">
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={agreements.age}
              onCheckedChange={() => handleSingleCheck('age')}
            />
            <span>만 14세 이상입니다 (필수)</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={agreements.terms}
              onCheckedChange={() => handleSingleCheck('terms')}
            />
            <span>이용약관 (필수)</span>
          </label>
          <button
            className="text-sm text-gray-400 hover:text-gray-600"
            onClick={() => handleOpenModal('terms')}
          >
            보기
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={agreements.privacy}
              onCheckedChange={() => handleSingleCheck('privacy')}
            />
            <span>개인정보 수집 및 이용에 대한 안내 (필수)</span>
          </label>
          <button
            className="text-sm text-gray-400 hover:text-gray-600"
            onClick={() => handleOpenModal('privacy')}
          >
            보기
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={agreements.privacyOption}
              onCheckedChange={() => handleSingleCheck('privacyOption')}
            />
            <span>개인정보 수집 및 이용에 대한 안내 (선택)</span>
          </label>
          <button
            className="text-sm text-gray-400 hover:text-gray-600"
            onClick={() => handleOpenModal('privacyOption')}
          >
            보기
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={agreements.marketing}
              onCheckedChange={() => handleSingleCheck('marketing')}
            />
            <span>당구장 맞춤 정보 수신 동의 (선택)</span>
          </label>
          <button
            className="text-sm text-gray-400 hover:text-gray-600"
            onClick={() => handleOpenModal('marketing')}
          >
            보기
          </button>
        </div>
      </div>

      {/* Terms Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
          {selectedTerm && (
            <>
              <DialogHeader>
                <DialogTitle>{TERMS_CONTENT[selectedTerm].title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 whitespace-pre-line text-sm">
                {TERMS_CONTENT[selectedTerm].content}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 다음 버튼 */}
      <Button
        className="h-12 w-full bg-gray-900 hover:bg-gray-800"
        onClick={handleSubmit}
      >
        다음
      </Button>

      {/* 로그인 링크 */}
      <div className="mt-6 text-center text-sm text-gray-600">
        기존에 사용하시던 아이디가 있나요?{' '}
        <Link href="/login" className="underline">
          로그인
        </Link>
      </div>
    </>
  );
}

export default TermsForm;
