'use client';

import { useState } from 'react';
import { useForm } from '@/app/desktop/(auth)/signin/_components/(desktop)/context/sign-in-context';
import { FormData, FormErrors } from '@/types/(login)/user-preference-info';

export function usePreference(onNext: () => void) {
  const [formData, setFormData] = useState<FormData>({
    preferGame: '',
    userThreeAbility: 0,
    userFourAbility: 0,
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  // 🔹 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.preferGame) {
      newErrors.preferGame = '4구구';
    }

    if (!formData.userFourAbility) {
      newErrors.userFourAbility = 0;
    }

    if (!formData.userThreeAbility) {
      newErrors.userFourAbility = 0;
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
          preferGame: formData.preferGame,
          userThreeAbility: formData.userThreeAbility,
          userFourAbility: formData.userFourAbility,
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
    handleSelectChange,
    handleSubmit,
  };
}
