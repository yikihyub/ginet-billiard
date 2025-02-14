'use client';

import { useState } from 'react';
import { useForm } from '@/app/(auth)/signup/_components/(desktop)/context/sign-in-context';
import { FormData, FormErrors } from '@/types/(login)/store-operation-info';

export function useStoreOperation(onNext: () => void) {
  const { dispatch } = useForm();
  const [formData, setFormData] = useState<FormData>({
    weekdayHours: { open: '', close: '' },
    saturdayHours: { open: '', close: '' },
    sundayHours: { open: '', close: '' },
    regularHolidays: [],
    brand: '',
    totalTables: '',
    facilities: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showError, setShowError] = useState(false);

  // 🔹 운영 시간 변경 핸들러
  const handleTimeChange = (
    period: 'weekdayHours' | 'saturdayHours' | 'sundayHours',
    type: 'open' | 'close',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        [type]: value,
      },
    }));
    setErrors((prev) => ({
      ...prev,
      [period]: undefined,
    }));
  };

  // 🔹 정기 휴일 선택 핸들러
  const handleHolidayChange = (day: string) => {
    setFormData((prev) => {
      const holidays = prev.regularHolidays.includes(day)
        ? prev.regularHolidays.filter((h) => h !== day)
        : [...prev.regularHolidays, day];
      return { ...prev, regularHolidays: holidays };
    });
  };

  // 🔹 보유 시설 선택 핸들러
  const handleFacilityChange = (facilityId: string) => {
    setFormData((prev) => {
      const facilities = prev.facilities.includes(facilityId)
        ? prev.facilities.filter((f) => f !== facilityId)
        : [...prev.facilities, facilityId];
      return { ...prev, facilities };
    });
  };

  // 🔹 브랜드 및 타석 수 변경 핸들러
  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  // 🔹 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.weekdayHours.open || !formData.weekdayHours.close) {
      newErrors.weekdayHours = '평일 운영시간을 입력해주세요.';
    }

    if (!formData.brand) {
      newErrors.brand = '브랜드를 선택해주세요.';
    }

    if (!formData.totalTables) {
      newErrors.totalTables = '타석 수를 입력해주세요.';
    } else if (parseInt(formData.totalTables) < 1) {
      newErrors.totalTables = '올바른 타석 수를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch({
        type: 'SET_OPERATION',
        payload: {
          weekdayHours: formData.weekdayHours,
          saturdayHours: formData.saturdayHours,
          sundayHours: formData.sundayHours,
          regularHolidays: formData.regularHolidays,
          brand: formData.brand,
          totalTables: formData.totalTables,
          facilities: formData.facilities,
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
    setErrors,
    setFormData,
    handleTimeChange,
    handleHolidayChange,
    handleFacilityChange,
    handleSelectChange,
    handleSubmit,
  };
}
