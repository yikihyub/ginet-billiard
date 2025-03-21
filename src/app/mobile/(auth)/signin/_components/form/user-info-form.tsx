import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { TermsFormProps } from '@/types/(login)/user-info';

import { getPasswordStrengthText } from '@/utils/(login)/user-info';

import { useUserInfo } from '@/app/mobile/_hooks/login/useUserInfo';

export default function UserInfoPage({ onNext }: TermsFormProps) {
  const {
    formData,
    showError,
    errors,
    phoneVerificationStatus,
    verificationTimer,
    emailCheckStatus,
    nameCheckStatus,
    passwordStrength,
    setFormData,
    handleNameCheck,
    handleEmailCheck,
    handlePasswordChange,
    handleSendVerificationCode,
    handleVerifyCode,
    handleInputChange,
    handleSubmit,
    handlePhoneChange,
  } = useUserInfo(onNext);

  return (
    <div className="flex flex-col bg-white">
      <div className="mt-8 flex-1 p-4">
        <h2 className="text-xl font-bold">회원정보를 입력해주세요</h2>

        {showError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              모든 필드를 올바르게 입력해주세요.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-4">
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
                    ? 'h-14 border-green-500 px-4 text-lg'
                    : 'h-14 px-4 text-lg'
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
                className="h-14 w-40 px-4"
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
                    className="h-14 px-4 text-lg"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={!formData.verificationCode}
                    className="h-14 w-32"
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
                    ? 'h-14 border-green-500 px-4'
                    : 'h-14 px-4'
                }
              />
              <Button
                type="button"
                onClick={handleEmailCheck}
                disabled={emailCheckStatus === 'checking' || !formData.email}
                className="relative h-14 w-40"
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
            <Label htmlFor="name">닉네임</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="닉네임을 입력해주세요"
                value={formData.name}
                onChange={handleInputChange}
                className={
                  nameCheckStatus === 'available'
                    ? 'h-14 border-green-500 px-4'
                    : 'h-14 px-4'
                }
              />
              <Button
                type="button"
                onClick={handleNameCheck}
                disabled={nameCheckStatus === 'checking' || !formData.name}
                className="relative h-14 w-40"
              >
                {nameCheckStatus === 'checking' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : nameCheckStatus === 'available' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : nameCheckStatus === 'unavailable' ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  '중복확인'
                )}
              </Button>
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
            {nameCheckStatus === 'available' && !errors.name && (
              <p className="mt-1 text-sm text-green-500">
                사용 가능한 닉네임입니다.
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
              className="h-14 px-4"
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
              className="h-14 px-4"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mb-8 mt-8 flex gap-2">
            <Button type="button" variant="outline" className="h-14 w-full">
              이전
            </Button>
            <Button
              type="submit"
              className="h-14 w-full rounded-lg bg-green-600 hover:bg-green-700"
            >
              다음
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
