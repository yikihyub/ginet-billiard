'use client';

import { useState } from 'react';
import { useForm } from '@/app/(auth)/signup/_components/(desktop)/context/sign-in-context';
import { FormData, FormErrors } from '@/types/(login)/store-info';
import {
  validateBusinessNumber,
  validatestoreNumber,
} from '@/utils/(login)/store-info';

export function useStoreInfo(onNext: () => void) {
  const [formData, setFormData] = useState<FormData>({
    businessNumber: '',
    storeName: '',
    ownerName: '',
    storeNumber: '',
  });

  const { dispatch } = useForm();
  const [errors, setErrors] = useState<FormErrors>({});
  const [showError, setShowError] = useState(false);

  // 🔹 공통 인풋 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  // 🔹 사업자등록번호 입력 시 자동 하이픈 추가
  const handleBusinessNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 6) {
      value = value.slice(0, 6) + '-' + value.slice(6, 11);
    }
    setFormData((prev) => ({
      ...prev,
      businessNumber: value,
    }));
  };

  // 🔹 전화번호 입력 시 자동 하이픈 추가
  const handlestoreNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      if (value.startsWith('02')) {
        value = value.slice(0, 2) + '-' + value.slice(2);
      } else {
        value = value.slice(0, 3) + '-' + value.slice(3);
      }
    }
    if (value.length > 7) {
      const hyphenIndex = value.indexOf('-');
      value =
        value.slice(0, hyphenIndex + 4) +
        '-' +
        value.slice(hyphenIndex + 4, hyphenIndex + 8);
    }
    setFormData((prev) => ({
      ...prev,
      storeNumber: value,
    }));
  };

  // 🔹 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.businessNumber) {
      newErrors.businessNumber = '사업자등록번호를 입력해주세요.';
    } else if (!validateBusinessNumber(formData.businessNumber)) {
      newErrors.businessNumber = '올바른 사업자등록번호 형식이 아닙니다.';
    }

    if (!formData.storeName) {
      newErrors.storeName = '매장명을 입력해주세요.';
    }

    if (!formData.ownerName) {
      newErrors.ownerName = '대표자명을 입력해주세요.';
    }

    if (!formData.storeNumber) {
      newErrors.storeNumber = '매장 전화번호를 입력해주세요.';
    } else if (!validatestoreNumber(formData.storeNumber)) {
      newErrors.storeNumber = '올바른 전화번호 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Context에 매장 정보 저장
      dispatch({
        type: 'SET_STORE_INFO',
        payload: {
          businessNumber: formData.businessNumber,
          storeName: formData.storeName,
          ownerName: formData.ownerName,
          storeNumber: formData.storeNumber,
        },
      });
      onNext();
    } else {
      setShowError(true);
    }
  };

  return {
    formData,
    errors,
    showError,
    handleInputChange,
    handleBusinessNumberChange,
    handlestoreNumberChange,
    handleSubmit,
  };
}
