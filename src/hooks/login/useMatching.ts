'use client';

import { useState } from 'react';
import { useForm } from '@/app/(auth)/signup/_components/(desktop)/context/sign-in-context';

export function useMatching(onNext: () => void) {
  const { state, dispatch } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formData = state.matching;

  const handleLocationConsent = async (checked: boolean) => {
    setLoading(true);
    try {
      if (checked) {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
            });
          }
        );

        dispatch({
          type: 'SET_LOCATION',
          payload: {
            ...state.location,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      }

      dispatch({
        type: 'SET_MATCHING',
        payload: {
          ...formData,
          locationConsent: checked,
        },
      });
    } catch (error) {
      setError(
        '위치 정보를 가져오는데 실패했습니다. 브라우저 설정을 확인해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreferredAgeGroupChange = (
    ageGroup: string,
    checked: boolean
  ) => {
    const newAgeGroups = checked
      ? [...formData.preferredAgeGroup, ageGroup]
      : formData.preferredAgeGroup.filter((age) => age !== ageGroup);

    dispatch({
      type: 'SET_MATCHING',
      payload: {
        ...formData,
        preferredAgeGroup: newAgeGroups,
      },
    });
  };

  const handleSkillLevelChange = (level: string, checked: boolean) => {
    const newSkillLevels = checked
      ? [...formData.preferredSkillLevel, level]
      : formData.preferredSkillLevel.filter((skill) => skill !== level);

    dispatch({
      type: 'SET_MATCHING',
      payload: {
        ...formData,
        preferredSkillLevel: newSkillLevels,
      },
    });
  };

  const handlePlayStyleChange = (style: string, checked: boolean) => {
    const newPlayStyles = checked
      ? [...formData.playStyle, style]
      : formData.playStyle.filter((s) => s !== style);

    dispatch({
      type: 'SET_MATCHING',
      payload: {
        ...formData,
        playStyle: newPlayStyles,
      },
    });
  };

  const handlePreferredTimeChange = (time: string, checked: boolean) => {
    const newPreferredTimes = checked
      ? [...formData.preferredTime, time]
      : formData.preferredTime.filter((t) => t !== time);

    dispatch({
      type: 'SET_MATCHING',
      payload: {
        ...formData,
        preferredTime: newPreferredTimes,
      },
    });
  };

  const handleGenderChange = (gender: string) => {
    dispatch({
      type: 'SET_MATCHING',
      payload: {
        ...formData,
        preferredGender: gender,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.location.latitude || !state.location.longitude) {
      setError('위치 정보 수집에 동의해주세요.');
      return;
    }

    if (!formData.preferredSkillLevel.length) {
      setError('본인의 구력을 선택해주세요.');
      return;
    }

    onNext();
  };

  return {
    formData,
    error,
    loading,
    handleLocationConsent,
    handlePreferredAgeGroupChange,
    handleSkillLevelChange,
    handlePlayStyleChange,
    handlePreferredTimeChange,
    handleGenderChange,
    handleSubmit,
    setError,
  };
}
