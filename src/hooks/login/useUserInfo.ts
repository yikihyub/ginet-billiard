'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@/app/(auth)/signup/_components/(desktop)/context/sign-in-context';
import {
  FormData,
  FormErrors,
  EmailCheckStatus,
  PhoneVerificationStatus,
} from '@/types/(login)/user-info';
import {
  checkPasswordStrength,
  checkEmailAvailability,
  sendVerificationCode,
  verifyCode,
  validateEmail,
  validatePassword,
  validatePhone,
} from '@/utils/(login)/user-info';

export function useUserInfo(onNext: () => void) {
  const { dispatch } = useForm();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    verificationCode: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showError, setShowError] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [verificationTimer, setVerificationTimer] = useState<number>(0);
  const [emailCheckStatus, setEmailCheckStatus] =
    useState<EmailCheckStatus>('idle');
  const [phoneVerificationStatus, setPhoneVerificationStatus] =
    useState<PhoneVerificationStatus>('idle');

  console.log('isEmailVerified::: 나중에사용', isEmailVerified);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verificationTimer > 0 && phoneVerificationStatus === 'sent') {
      timer = setInterval(() => {
        setVerificationTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [verificationTimer, phoneVerificationStatus]);

  const handleEmailCheck = async () => {
    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: '올바른 이메일 형식이 아닙니다.',
      }));
      return;
    }

    setEmailCheckStatus('checking');
    try {
      const isAvailable = await checkEmailAvailability(formData.email);
      setEmailCheckStatus(isAvailable ? 'available' : 'unavailable');
      setIsEmailVerified(isAvailable);
      setErrors((prev) => ({
        ...prev,
        email: isAvailable ? undefined : '이미 사용 중인 이메일입니다.',
      }));
    } catch (error) {
      console.log('이메일 확인 중 오류 발생 :', error);
      setEmailCheckStatus('idle');
      setErrors((prev) => ({
        ...prev,
        email: '이메일 확인 중 오류가 발생했습니다.',
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData((prev) => ({ ...prev, password: newPassword }));
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSendVerificationCode = async () => {
    if (!validatePhone(formData.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: '올바른 전화번호 형식이 아닙니다.',
      }));
      return;
    }

    setPhoneVerificationStatus('sending');
    try {
      const success = await sendVerificationCode(formData.phone);
      if (success) {
        setPhoneVerificationStatus('sent');
        setVerificationTimer(180);
        setErrors((prev) => ({
          ...prev,
          phone: undefined,
          verificationCode: undefined,
        }));
      }
    } catch (error) {
      console.log('인증번호 발송에 실패했습니다.', error);
      setPhoneVerificationStatus('idle');
      setErrors((prev) => ({
        ...prev,
        phone: '인증번호 발송에 실패했습니다.',
      }));
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: '인증번호를 입력해주세요.',
      }));
      return;
    }

    setPhoneVerificationStatus('verifying');
    try {
      const success = await verifyCode(
        formData.phone,
        formData.verificationCode
      );
      setPhoneVerificationStatus(success ? 'verified' : 'sent');
      setErrors((prev) => ({
        ...prev,
        verificationCode: success ? undefined : '잘못된 인증번호입니다.',
      }));
    } catch (error) {
      console.log('인증에 실패했습니다.', error);
      setPhoneVerificationStatus('sent');
      setErrors((prev) => ({
        ...prev,
        verificationCode: '인증에 실패했습니다.',
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setEmailCheckStatus('idle');
      setIsEmailVerified(false);
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch({
        type: 'SET_USER_INFO',
        payload: {
          email: formData.email,
          password: formData.password,
          ownerName: formData.name,
          phoneNumber: formData.phone,
        },
      });
      onNext();
    } else {
      setShowError(true);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 3 && value.length <= 7) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 7) {
      value =
        value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
    }
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!validateEmail(formData.email))
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    if (!validatePassword(formData.password))
      newErrors.password =
        '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (
      !validatePhone(formData.phone) ||
      phoneVerificationStatus !== 'verified'
    )
      newErrors.phone = '전화번호 인증이 필요합니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    showError,
    emailCheckStatus,
    phoneVerificationStatus,
    passwordStrength,
    verificationTimer,
    setFormData,
    handleEmailCheck,
    handlePasswordChange,
    handleSendVerificationCode,
    handleVerifyCode,
    handleInputChange,
    handleSubmit,
    handlePhoneChange,
  };
}
