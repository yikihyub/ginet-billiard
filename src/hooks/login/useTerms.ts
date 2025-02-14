'use client';

import { useState } from 'react';
import { useForm } from '@/app/(auth)/signup/_components/(desktop)/context/sign-in-context';
import { TERMS_CONTENT } from '@/constants/(login)/terms/terms-content';

type TermType = keyof typeof TERMS_CONTENT;

export function useTerms(onNext: () => void) {
  const { dispatch } = useForm();
  const [showError, setShowError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<TermType | null>(null);

  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    terms: false,
    privacy: false,
    privacyOption: false,
    marketing: false,
  });

  // 🔹 전체 동의 체크
  const handleAllCheck = () => {
    const newValue = !agreements.all;
    const newAgreements = {
      all: newValue,
      age: newValue,
      terms: newValue,
      privacy: newValue,
      privacyOption: newValue,
      marketing: newValue,
    };
    setAgreements(newAgreements);

    // Context 업데이트
    dispatch({
      type: 'SET_TERMS',
      payload: {
        age: newValue,
        terms: newValue,
        privacy: newValue,
        privacyOption: newValue,
        marketing: newValue,
      },
    });
    setShowError(false);
  };

  // 🔹 개별 동의 체크
  const handleSingleCheck = (name: keyof typeof agreements) => {
    const newAgreements = {
      ...agreements,
      [name]: !agreements[name],
    };

    const allChecked = Object.entries(newAgreements)
      .filter(([key]) => key !== 'all')
      .every(([, value]) => value);

    setAgreements({
      ...newAgreements,
      all: allChecked,
    });

    // Context 업데이트
    dispatch({
      type: 'SET_TERMS',
      payload: {
        age: newAgreements.age,
        terms: newAgreements.terms,
        privacy: newAgreements.privacy,
        privacyOption: newAgreements.privacyOption,
        marketing: newAgreements.marketing,
      },
    });
    setShowError(false);
  };

  // 🔹 필수 약관 검증
  const validateRequiredTerms = () => {
    const requiredTerms = ['age', 'terms', 'privacy'];
    return requiredTerms.every(
      (term) => agreements[term as keyof typeof agreements]
    );
  };

  // 🔹 약관 동의 후 진행
  const handleSubmit = () => {
    if (validateRequiredTerms()) {
      onNext();
    } else {
      setShowError(true);
    }
  };

  // 🔹 약관 모달 열기
  const handleOpenModal = (term: TermType) => {
    setSelectedTerm(term);
    setModalOpen(true);
  };

  return {
    agreements,
    showError,
    modalOpen,
    selectedTerm,
    handleAllCheck,
    handleSingleCheck,
    handleSubmit,
    handleOpenModal,
    setModalOpen,
  };
}
