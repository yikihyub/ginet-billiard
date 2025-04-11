'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClubInfo, FormStep, ClubType } from '@/types/(club)/club';

interface ClubRegisterContextProps {
  clubInfo: ClubInfo;
  currentStep: FormStep;
  isAgreed: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
  setClubInfo: (info: ClubInfo) => void;
  updateClubInfo: (field: keyof ClubInfo, value: any) => void;
  setCurrentStep: (step: FormStep) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  handleTypeSelect: (type: ClubType) => void;
  addTag: (tag: string) => void;
  removeTag: (index: number) => void;
  updateTag: (index: number, value: string) => void;
  addRule: (rule: string) => void;
  removeRule: (index: number) => void;
  updateRule: (index: number, value: string) => void;
  resetForm: () => void;
  validateStep: (step: FormStep) => boolean;
  handleSubmit: () => Promise<void>;
  setIsAgreed: (agreed: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  }) => void;
  handleAgreeAll: () => void;
  handleChange: (key: 'terms' | 'privacy' | 'marketing') => void;
  isLoading: boolean;
  handleProfileImageUpload: (file: File) => void;
  handleBannerImageUpload: (file: File) => void;
  profileImagePreview: string | null;
  bannerImagePreview: string | null;
  removeProfileImage: () => void;
  removeBannerImage: () => void;
}

const defaultClubInfo: ClubInfo = {
  type: '',
  name: '',
  description: '',
  location: '',
  maxMembers: 50,
  regularDay: '',
  tags: [''],
  rules: [''],
  placeName: '',
  placeAddress: '',
  contactPhone: '',
  contactEmail: '',
  profileImage: null,
  bannerImage: null,
  profileImageId: null,
  bannerImageId: null,
};

const ClubRegisterContext = createContext<ClubRegisterContextProps | undefined>(
  undefined
);

export const ClubRegisterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [clubInfo, setClubInfo] = useState<ClubInfo>(defaultClubInfo);
  const [currentStep, setCurrentStep] = useState<FormStep>('agreement');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null
  );
  const [isAgreed, setIsAgreed] = useState({
    terms: false, // 이용약관 동의 (필수)
    privacy: false, // 개인정보 수집 및 이용 동의 (필수)
    marketing: false, // 마케팅 정보 수신 동의 (선택)
  });

  const handleAgreeAll = () => {
    setIsAgreed({ terms: true, privacy: true, marketing: true });
  };

  const handleChange = (key: keyof typeof isAgreed) => {
    setIsAgreed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateClubInfo = (field: keyof ClubInfo, value: any) => {
    setClubInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeSelect = (type: ClubType) => {
    updateClubInfo('type', type);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !clubInfo.tags.includes(tag.trim())) {
      setClubInfo({
        ...clubInfo,
        tags: [...clubInfo.tags, tag.trim()], // 빈 문자열 '' 제거
      });
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...clubInfo.tags];
    newTags.splice(index, 1);
    setClubInfo({
      ...clubInfo,
      tags: newTags.length ? newTags : [''],
    });
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...clubInfo.tags];
    newTags[index] = value;
    setClubInfo({ ...clubInfo, tags: newTags });
  };

  const addRule = (rule: string) => {
    if (rule.trim() && !clubInfo.rules.includes(rule.trim())) {
      setClubInfo({
        ...clubInfo,
        rules: [...clubInfo.rules.filter((r) => r !== ''), rule.trim(), ''],
      });
    }
  };

  const removeRule = (index: number) => {
    const newRules = [...clubInfo.rules];
    newRules.splice(index, 1);
    setClubInfo({
      ...clubInfo,
      rules: newRules.length ? newRules : [''],
    });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...clubInfo.rules];
    newRules[index] = value;
    setClubInfo({ ...clubInfo, rules: newRules });
  };

  // 이미지 업로드 처리 함수
  const handleProfileImageUpload = (file: File) => {
    // 1. 미리보기 URL 생성
    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);

    // 2. 상태 업데이트
    updateClubInfo('profileImage', file);
  };

  const handleBannerImageUpload = (file: File) => {
    // 1. 미리보기 URL 생성
    const previewUrl = URL.createObjectURL(file);
    setBannerImagePreview(previewUrl);

    // 2. 상태 업데이트
    updateClubInfo('bannerImage', file);
  };

  const removeProfileImage = () => {
    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
      setProfileImagePreview(null);
    }
    updateClubInfo('profileImage', null);
    updateClubInfo('profileImageId', null);
  };

  const removeBannerImage = () => {
    if (bannerImagePreview) {
      URL.revokeObjectURL(bannerImagePreview);
      setBannerImagePreview(null);
    }
    updateClubInfo('bannerImage', null);
    updateClubInfo('bannerImageId', null);
  };

  const resetForm = () => {
    // 이미지 미리보기 URL 해제
    if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
    if (bannerImagePreview) URL.revokeObjectURL(bannerImagePreview);

    setProfileImagePreview(null);
    setBannerImagePreview(null);
    setClubInfo(defaultClubInfo);
    setCurrentStep('type');
  };

  const validateStep = (step: FormStep): boolean => {
    switch (step) {
      case 'agreement':
        return isAgreed.terms && isAgreed.privacy;
      case 'type':
        return !!clubInfo.type;
      case 'basic':
        return !!clubInfo.name && !!clubInfo.location;
      case 'details':
        return !!clubInfo.description;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    const steps: FormStep[] = [
      'agreement',
      'type',
      'basic',
      'details',
      'rules',
      'location',
      'contact',
      'review',
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (validateStep(currentStep) && currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToPrevStep = () => {
    const steps: FormStep[] = [
      'agreement',
      'type',
      'basic',
      'details',
      'rules',
      'location',
      'contact',
      'review',
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // 이미지 업로드 처리
      let profileImageId = clubInfo.profileImageId;
      let bannerImageId = clubInfo.bannerImageId;

      // 프로필 이미지 업로드 (파일이 있고 아직 업로드되지 않은 경우)
      if (clubInfo.profileImage && !profileImageId) {
        const formData = new FormData();
        formData.append('file', clubInfo.profileImage);
        formData.append('entityType', 'club');

        const imageResponse = await fetch('/api/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          profileImageId = imageData.id;
        } else {
          throw new Error('프로필 이미지 업로드에 실패했습니다');
        }
      }

      // 배너 이미지 업로드 (파일이 있고 아직 업로드되지 않은 경우)
      if (clubInfo.bannerImage && !bannerImageId) {
        const formData = new FormData();
        formData.append('file', clubInfo.bannerImage);
        formData.append('entityType', 'club');

        const imageResponse = await fetch('/api/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          bannerImageId = imageData.id;
        } else {
          throw new Error('배너 이미지 업로드에 실패했습니다');
        }
      }

      // 동호회 정보 제출 (이미지 ID 포함)
      const response = await fetch('/api/club/postclub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: clubInfo.type,
          name: clubInfo.name,
          description: clubInfo.description,
          location: clubInfo.location,
          maxMembers: clubInfo.maxMembers,
          regularDay: clubInfo.regularDay,
          tags: clubInfo.tags.filter((tag) => tag !== ''),
          rules: clubInfo.rules.filter((rule) => rule !== ''),
          placeName: clubInfo.placeName,
          placeAddress: clubInfo.placeAddress,
          contactPhone: clubInfo.contactPhone,
          contactEmail: clubInfo.contactEmail,
          profileImageId,
          bannerImageId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '동호회 등록에 실패했습니다');
      }

      const result = await response.json();

      // 성공 메시지 표시
      alert('동호회가 성공적으로 등록되었습니다!');

      // 등록된 동호회 페이지로 이동
      window.location.href = `/mobile/club/search/${result.club.club_id}`;
    } catch (error: any) {
      console.error('동호회 등록 중 오류 발생:', error);
      alert(
        error.message ||
          '동호회 등록 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClubRegisterContext.Provider
      value={{
        clubInfo,
        currentStep,
        setClubInfo,
        updateClubInfo,
        setCurrentStep,
        goToNextStep,
        goToPrevStep,
        handleTypeSelect,
        addTag,
        removeTag,
        updateTag,
        addRule,
        removeRule,
        updateRule,
        resetForm,
        validateStep,
        handleSubmit,
        handleAgreeAll,
        setIsAgreed,
        handleChange,
        isLoading,
        isAgreed,
        handleProfileImageUpload,
        handleBannerImageUpload,
        profileImagePreview,
        bannerImagePreview,
        removeProfileImage,
        removeBannerImage,
      }}
    >
      {children}
    </ClubRegisterContext.Provider>
  );
};

export const useClubRegister = () => {
  const context = useContext(ClubRegisterContext);
  if (context === undefined) {
    throw new Error(
      'useClubRegister must be used within a ClubRegisterProvider'
    );
  }
  return context;
};
