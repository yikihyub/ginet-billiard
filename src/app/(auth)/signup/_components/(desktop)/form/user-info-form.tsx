import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { TermsFormProps } from '@/types/(login)/user-info';

import { getPasswordStrengthText } from '@/utils/(login)/user-info';

import { useUserInfo } from '@/hooks/login/useUserInfo';

export default function UserInfoPage({ onNext }: TermsFormProps) {
  const {
    formData,
    showError,
    errors,
    phoneVerificationStatus,
    verificationTimer,
    emailCheckStatus,
    passwordStrength,
    setFormData,
    handleEmailCheck,
    handlePasswordChange,
    handleSendVerificationCode,
    handleVerifyCode,
    handleInputChange,
    handleSubmit,
    handlePhoneChange,
  } = useUserInfo(onNext);

  return (
    <div className="mx-auto w-full max-w-[450px]">
      <h1 className="mb-8 text-center text-2xl font-bold">
        회원정보를 입력해주세요
      </h1>

      {showError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            모든 필드를 올바르게 입력해주세요.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">전화번호</Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="010-0000-0000"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={13}
              disabled={phoneVerificationStatus === 'verified'}
              className={
                phoneVerificationStatus === 'verified'
                  ? 'h-12 border-green-500 px-4 text-lg'
                  : 'h-12 px-4 text-lg'
              }
            />
            <Button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={
                phoneVerificationStatus === 'sending' ||
                phoneVerificationStatus === 'verified' ||
                !formData.phone
              }
              className="h-12 w-32 px-4"
            >
              {phoneVerificationStatus === 'sending' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : phoneVerificationStatus === 'verified' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                '인증번호 발송'
              )}
            </Button>
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}

          {phoneVerificationStatus === 'sent' && (
            <div className="mt-2">
              <div className="flex gap-2">
                <Input
                  placeholder="인증번호 6자리"
                  value={formData.verificationCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      verificationCode: e.target.value,
                    }))
                  }
                  maxLength={6}
                  className="h-12 px-4 text-lg"
                />
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={!formData.verificationCode}
                  className="h-12 w-32"
                >
                  확인
                </Button>
              </div>
              {verificationTimer > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {Math.floor(verificationTimer / 60)}:
                  {String(verificationTimer % 60).padStart(2, '0')}
                </p>
              )}
              {errors.verificationCode && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.verificationCode}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleInputChange}
              className={
                emailCheckStatus === 'available'
                  ? 'h-12 border-green-500 px-4'
                  : 'h-12 px-4'
              }
            />
            <Button
              type="button"
              onClick={handleEmailCheck}
              disabled={emailCheckStatus === 'checking' || !formData.email}
              className="relative h-12 w-32"
            >
              {emailCheckStatus === 'checking' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : emailCheckStatus === 'available' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : emailCheckStatus === 'unavailable' ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                '중복확인'
              )}
            </Button>
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
          {emailCheckStatus === 'available' && !errors.email && (
            <p className="mt-1 text-sm text-green-500">
              사용 가능한 이메일입니다.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            value={formData.password}
            onChange={handlePasswordChange}
            className="h-12 px-4"
          />
          {formData.password && (
            <>
              <Progress value={passwordStrength} className="h-2" />
              <p
                className={`text-sm text-${
                  getPasswordStrengthText(passwordStrength).color
                }-500`}
              >
                {getPasswordStrengthText(passwordStrength).text}
              </p>
            </>
          )}
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="h-12 px-4"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="이름을 입력해주세요"
            value={formData.name}
            onChange={handleInputChange}
            className="h-12 px-4"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full bg-gray-900 hover:bg-gray-800"
        >
          다음
        </Button>
      </form>
    </div>
  );
}
