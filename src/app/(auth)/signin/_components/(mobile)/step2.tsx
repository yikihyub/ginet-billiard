'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  signInWithCredential,
} from 'firebase/auth';

export default function Step2() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [timer, setTimer] = useState(180);
  const [isVerified, setIsVerified] = useState(false);
  const recaptchaVerifier = useRef<any>(null);

  useEffect(() => {
    // 기존 verifier가 있다면 clear
    if (recaptchaVerifier.current) {
      recaptchaVerifier.current.clear();
    }

    try {
      recaptchaVerifier.current = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA resolved');
          },
        }
      );

      // 명시적으로 render 호출
      recaptchaVerifier.current.render();
    } catch (error) {
      console.error('RecaptchaVerifier error:', error);
    }
  }, []);

  // 인증번호 발송
  const handleSendVerification = async () => {
    try {
      // 전화번호 형식 수정
      const formattedNumber = phoneNumber.startsWith('+82')
        ? phoneNumber
        : `+82${phoneNumber.replace(/^0/, '')}`;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedNumber,
        recaptchaVerifier.current
      );
      setVerificationId(confirmationResult.verificationId);
      setIsSent(true);
      startTimer();
    } catch (error: any) {
      console.error('Error details:', error.code, error.message);
      alert(error.message || '인증번호 발송에 실패했습니다.');
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await signInWithCredential(auth, credential); // 이렇게 수정
      setIsVerified(true);
      alert('인증이 완료되었습니다.');
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('인증번호가 올바르지 않습니다.');
    }
  };

  // 타이머 시작
  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">휴대폰 인증</h2>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="tel"
            placeholder="휴대폰 번호 입력"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="h-14 flex-1 p-5"
            disabled={isVerified}
          />
          <Button
            onClick={handleSendVerification}
            disabled={!phoneNumber || isVerified}
            className="h-14 w-32"
          >
            인증번호 받기
          </Button>
        </div>

        {isSent && !isVerified && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="인증번호 6자리 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="h-14 w-full p-5"
                maxLength={6}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {formatTime(timer)}
              </span>
            </div>
            <Button
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6}
              className="h-14 w-32"
            >
              인증확인
            </Button>
          </div>
        )}

        {isVerified && (
          <p className="text-green-600">휴대폰 인증이 완료되었습니다.</p>
        )}
      </div>

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
