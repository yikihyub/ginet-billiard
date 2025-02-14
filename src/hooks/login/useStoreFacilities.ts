'use client';

import { useState } from 'react';
import { useForm } from '@/app/(auth)/signup/_components/(desktop)/context/sign-in-context';
import {
  FormData,
  FormErrors,
  PriceInfo,
} from '@/types/(login)/store-facilities-info';

export function useStoreFacilities(onComplete: () => void) {
  const { state, dispatch } = useForm(); // FormContext 사용
  const [formData, setFormData] = useState<FormData>({
    priceInfo: {
      weekdayPrice: '',
      weekendPrice: '',
    },
    priceNote: '',
    priceImage: null,
    storeImages: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showError, setShowError] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 🔹 가격 정보 변경 핸들러
  const handlePriceChange = (field: keyof PriceInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      priceInfo: {
        ...prev.priceInfo,
        [field]: value,
      },
    }));
    setErrors((prev) => ({
      ...prev,
      priceInfo: undefined,
    }));
  };

  // 🔹 가격표 이미지 변경 핸들러
  const handlePriceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        priceImage: e.target.files![0],
      }));
      setErrors((prev) => ({
        ...prev,
        priceImage: undefined,
      }));
    }
  };

  // 🔹 매장 사진 업로드 핸들러
  const handleStoreImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        storeImages: [...prev.storeImages, ...newImages],
      }));
      setErrors((prev) => ({
        ...prev,
        storeImages: undefined,
      }));
    }
  };

  // 🔹 매장 사진 삭제 핸들러
  const removeStoreImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      storeImages: prev.storeImages.filter((_, i) => i !== index),
    }));
  };

  // 🔹 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.priceInfo.weekdayPrice) {
      newErrors.priceInfo = '평일 가격을 입력해주세요.';
    }

    if (!formData.priceImage) {
      newErrors.priceImage = '가격표 이미지를 업로드해주세요.';
    }

    if (formData.storeImages.length === 0) {
      newErrors.storeImages = '매장 사진을 한 장 이상 업로드해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setUploading(true);
      try {
        // Context에서 이전 데이터 가져오기
        const storeData = {
          userinfo: state.userInfo,
          storeinfo: state.storeInfo,
          location: state.location,
          operation: state.operation,
          facilities: {
            priceInfo: formData.priceInfo,
            priceNote: formData.priceNote,
          },
        };

        console.log('Dispatching facility data:', storeData);

        dispatch({
          type: 'SET_FACILITIES',
          payload: {
            priceInfo: formData.priceInfo,
            priceNote: formData.priceNote,
          },
        });

        // API 호출
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(storeData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || '매장 등록에 실패했습니다.');
        }

        // 성공 시 Context 초기화
        dispatch({ type: 'RESET' });

        // 완료 페이지로 이동
        onComplete();
      } catch (error) {
        setShowError(true);
        console.error('Submit error:', error);
      } finally {
        setUploading(false);
      }
    } else {
      setShowError(true);
    }
  };

  return {
    formData,
    errors,
    showError,
    uploading,
    setFormData,
    handlePriceChange,
    handlePriceImageChange,
    handleStoreImagesChange,
    removeStoreImage,
    handleSubmit,
  };
}
