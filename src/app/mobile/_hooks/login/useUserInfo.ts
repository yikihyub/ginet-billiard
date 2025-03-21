'use client';

import { useState, useEffect } from 'react';
import { useForm } from '../../(auth)/signin/_components/context/sign-in-context';
import {
  FormData,
  FormErrors,
  EmailCheckStatus,
  PhoneVerificationStatus,
} from '@/types/(login)/user-info';
import {
  checkPasswordStrength,
  checkEmailAvailability,
  checkNameAvailability,
  checkPhoneAvailability,
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
  const [isNameVerified, setIsNameVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [verificationTimer, setVerificationTimer] = useState<number>(0);
  const [emailCheckStatus, setEmailCheckStatus] =
    useState<EmailCheckStatus>('idle');
  const [nameCheckStatus, setNameCheckStatus] =
    useState<EmailCheckStatus>('idle');
  const [phoneCheckStatus, setPhoneCheckStatus] =
    useState<EmailCheckStatus>('idle');
  const [phoneVerificationStatus, setPhoneVerificationStatus] =
    useState<PhoneVerificationStatus>('idle');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verificationTimer > 0 && phoneVerificationStatus === 'sent') {
      timer = setInterval(() => {
        setVerificationTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [verificationTimer, phoneVerificationStatus]);

  // 이메일 중복 확인
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

  // 이름 중복 확인
  const handleNameCheck = async () => {
    if (!formData.name || formData.name.trim() === '') {
      setErrors((prev) => ({
        ...prev,
        name: '이름을 입력해주세요.',
      }));
      return;
    }

    setNameCheckStatus('checking');
    try {
      const isAvailable = await checkNameAvailability(formData.name);
      setNameCheckStatus(isAvailable ? 'available' : 'unavailable');
      setIsNameVerified(isAvailable);
      setErrors((prev) => ({
        ...prev,
        name: isAvailable ? undefined : '이미 사용 중인 이름입니다.',
      }));
    } catch (error) {
      console.log('이름 확인 중 오류 발생 :', error);
      setNameCheckStatus('idle');
      setErrors((prev) => ({
        ...prev,
        name: '이름 확인 중 오류가 발생했습니다.',
      }));
    }
  };

  // 전화번호 중복 확인
  const handlePhoneCheck = async () => {
    if (!validatePhone(formData.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: '올바른 전화번호 형식이 아닙니다.',
      }));
      return;
    }

    setPhoneCheckStatus('checking');
    try {
      const isAvailable = await checkPhoneAvailability(formData.phone);
      setPhoneCheckStatus(isAvailable ? 'available' : 'unavailable');
      setIsPhoneVerified(isAvailable);
      setErrors((prev) => ({
        ...prev,
        phone: isAvailable ? undefined : '이미 사용 중인 전화번호입니다.',
      }));
    } catch (error) {
      console.log('전화번호 확인 중 오류 발생 :', error);
      setPhoneCheckStatus('idle');
      setErrors((prev) => ({
        ...prev,
        phone: '전화번호 확인 중 오류가 발생했습니다.',
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData((prev) => ({ ...prev, password: newPassword }));
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSendVerificationCode = async () => {
    // 전화번호 중복 확인이 성공적으로 완료된 경우에만 인증 코드 발송
    if (phoneCheckStatus !== 'available') {
      // 먼저 중복 확인이 필요한 경우
      if (phoneCheckStatus === 'idle') {
        await handlePhoneCheck();
        if (!isPhoneVerified) return;
      } else if (phoneCheckStatus === 'unavailable') {
        setErrors((prev) => ({
          ...prev,
          phone: '이미 사용 중인 전화번호입니다.',
        }));
        return;
      }
    }

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

    // 관련 검증 상태 초기화
    if (name === 'email') {
      setEmailCheckStatus('idle');
      setIsEmailVerified(false);
    } else if (name === 'name') {
      setNameCheckStatus('idle');
      setIsNameVerified(false);
    } else if (name === 'phone') {
      setPhoneCheckStatus('idle');
      setIsPhoneVerified(false);
      setPhoneVerificationStatus('idle');
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
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
    setPhoneCheckStatus('idle');
    setIsPhoneVerified(false);
    setPhoneVerificationStatus('idle');
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 이메일 검증
    if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    } else if (!isEmailVerified) {
      newErrors.email = '이메일 중복 확인이 필요합니다.';
    }

    // 이름 검증
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = '이름을 입력해주세요.';
    } else if (!isNameVerified) {
      newErrors.name = '이름 중복 확인이 필요합니다.';
    }

    // 비밀번호 검증
    if (!validatePassword(formData.password)) {
      newErrors.password =
        '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.';
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 전화번호 검증
    if (!validatePhone(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다.';
    } else if (!isPhoneVerified) {
      newErrors.phone = '전화번호 중복 확인이 필요합니다.';
    } else if (phoneVerificationStatus !== 'verified') {
      newErrors.phone = '전화번호 인증이 필요합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    showError,
    emailCheckStatus,
    nameCheckStatus,
    phoneCheckStatus,
    phoneVerificationStatus,
    passwordStrength,
    verificationTimer,
    isEmailVerified,
    isNameVerified,
    isPhoneVerified,
    setFormData,
    handleEmailCheck,
    handleNameCheck,
    handlePhoneCheck,
    handlePasswordChange,
    handleSendVerificationCode,
    handleVerifyCode,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handlePhoneChange,
  };
}
