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
import { useTerms } from '@/app/mobile/_hooks/login/useTerms';
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
    <div className="flex flex-col bg-white">
      <div className="mt-8 flex-1 p-4">
        <div>
          <h2 className="text-xl font-bold">
            서비스 이용약관에
            <br />
            동의해주세요.
          </h2>

          {showError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                필수 약관에 모두 동의해주세요.
              </AlertDescription>
            </Alert>
          )}

          {/* 전체 동의 */}
          <div className="mt-4">
            <div className="mt-8 flex items-center rounded-xl bg-gray-50 p-4">
              <Checkbox
                checked={agreements.all}
                onCheckedChange={handleAllCheck}
              />
              <span className="pl-2 font-medium">네, 모두 동의합니다</span>
            </div>
          </div>

          {/* 개별 약관 */}
          <div className="space-y-4 p-4 text-[#333]">
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={agreements.age}
                  onCheckedChange={() => handleSingleCheck('age')}
                />
                <label>[필수] 만 14세 이상입니다.</label>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={agreements.terms}
                  onCheckedChange={() => handleSingleCheck('terms')}
                />
                <label>[필수] 서비스 이용약관 동의</label>
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
                <label>[필수] 개인정보 수집 및 이용 동의</label>
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
                <label>[선택] 선택정보 수집 및 이용 동의</label>
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
                <label>[선택] 당구장 맞춤 정보 수신 동의</label>
              </label>
              <button
                className="text-sm text-gray-400 hover:text-gray-600"
                onClick={() => handleOpenModal('marketing')}
              >
                보기
              </button>
            </div>

            <p className="text-sm text-gray-500">
              선택 항목에 동의하지 않아도 서비스 이용이 가능합니다.
              <br />
              개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며
              <br />
              동의 거부 시 서비스 이용이 제한됩니다.
            </p>
          </div>

          {/* Terms Modal */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
              {selectedTerm && (
                <>
                  <DialogHeader>
                    <DialogTitle>
                      {TERMS_CONTENT[selectedTerm].title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 whitespace-pre-line text-sm">
                    {TERMS_CONTENT[selectedTerm].content}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* 하단버튼 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
            {/* 로그인 링크 */}
            <div className="mb-4 text-center text-sm text-gray-600">
              기존에 사용하시던 아이디가 있나요?{' '}
              <Link href="/mobile/login" className="underline">
                로그인
              </Link>
            </div>
            {/* 다음 버튼 */}
            <Button
              className="h-14 w-full rounded-lg bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsForm;
