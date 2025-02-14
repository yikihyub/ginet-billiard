'use client';

import { useState } from 'react';
import { useForm } from '@/app/(auth)/signup/_components/(desktop)/context/sign-in-context';
import { FormData, FormErrors } from '@/types/(login)/store-location-info';

export function useStoreLocation(onNext: () => void) {
  const [formData, setFormData] = useState<FormData>({
    address: '',
    directions: '',
    parkingType: '',
    parkingCapacity: '',
    parkingNote: '',
  });

  const { dispatch } = useForm();
  const [errors, setErrors] = useState<FormErrors>({});
  const [showError, setShowError] = useState(false);

  // 🔹 주소 변경 핸들러
  const handleAddressChange = (newAddress: string) => {
    setFormData((prev) => ({ ...prev, address: newAddress }));
  };

  // 🔹 공통 입력 필드 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  // 🔹 주차장 형태 변경 핸들러
  const handleParkingTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      parkingType: value,
    }));
    setErrors((prev) => ({
      ...prev,
      parkingType: undefined,
    }));
  };

  // 🔹 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.address) {
      newErrors.address = '매장 주소를 입력해주세요.';
    }

    if (!formData.parkingType) {
      newErrors.parkingType = '주차장 형태를 선택해주세요.';
    }

    if (formData.parkingType !== 'none' && !formData.parkingCapacity) {
      newErrors.parkingCapacity = '주차 가능 대수를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch({
        type: 'SET_LOCATION',
        payload: {
          address: formData.address,
          directions: formData.directions,
          parkingType: formData.parkingType,
          parkingCapacity: formData.parkingCapacity,
          parkingNote: formData.parkingNote,
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
    handleAddressChange,
    handleInputChange,
    handleParkingTypeChange,
    handleSubmit,
  };
}
