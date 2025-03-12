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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(180);
  const [isVerified, setIsVerified] = useState(false);
  const recaptchaVerifier = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timerRef = useRef(null);
  console.log(error);

  if (loading) {
    <div>loading...</div>;
  }

  // 컴포넌트가 언마운트될 때 reCAPTCHA 정리
  useEffect(() => {
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 인증번호 발송 전 reCAPTCHA 초기화
  const initializeRecaptcha = () => {
    // 기존 verifier가 있다면 clear
    if (recaptchaVerifier.current) {
      recaptchaVerifier.current.clear();
      recaptchaVerifier.current = null;
    }

    // 새로운 reCAPTCHA verifier 생성
    recaptchaVerifier.current = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA resolved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          setError('reCAPTCHA가 만료되었습니다. 다시 시도해주세요.');
          setLoading(false);
        },
      }
    );
  };

  // 인증번호 발송
  const handleSendVerification = async () => {
    try {
      setLoading(true);
      setError('');

      // 전화번호 유효성 검사
      if (!phoneNumber || phoneNumber.length < 10) {
        setError('유효한 전화번호를 입력해주세요.');
        setLoading(false);
        return;
      }

      // reCAPTCHA 초기화
      initializeRecaptcha();

      // 전화번호 형식 수정
      const formattedNumber = phoneNumber.startsWith('+82')
        ? phoneNumber
        : `+82${phoneNumber.replace(/^0/, '')}`;

      console.log('Sending verification to:', formattedNumber);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedNumber,
        recaptchaVerifier.current
      );

      setVerificationId(confirmationResult.verificationId);
      setIsSent(true);
      startTimer();
      setLoading(false);
    } catch (error: any) {
      console.error('Error sending verification:', error);
      let errorMessage = '인증번호 발송에 실패했습니다.';

      // Firebase 오류 코드에 따른 메시지 설정
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = '유효하지 않은 전화번호 형식입니다.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage =
          '인증 시도 횟수가 초과되었습니다. 나중에 다시 시도해주세요.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage =
          '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
      }

      setError(errorMessage);
      setLoading(false);
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
