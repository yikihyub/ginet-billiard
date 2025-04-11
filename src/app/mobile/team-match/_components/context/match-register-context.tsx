'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// FormData 내장 객체와 충돌 방지 → 이름을 MatchFormData로 사용
export interface MatchFormData {
  name: string;
  phone: string;
  handicap: string;
  agreeToTerms: boolean;
  store: any; // 실제 타입이 정해지면 수정
}

interface MatchRegisterContextType {
  userId: string;
  step: number;
  setStep: (step: number) => void;
  accountSelectedValue: string;
  setAccountSelectedValue: (val: string) => void;
  gameSelectedValue: string;
  setGameSelectedValue: (val: string) => void;
  formData: MatchFormData;
  setFormData: React.Dispatch<React.SetStateAction<MatchFormData>>;
  preferredDate: Date | null;
  setPreferredDate: (date: Date | null) => void;
  preferredTime: string;
  setPreferredTime: (time: string) => void;
}

// ✅ 초기값 명시
const MatchRegisterContext = createContext<MatchRegisterContextType>({
  userId: '',
  step: 1,
  setStep: () => {},
  accountSelectedValue: '',
  setAccountSelectedValue: () => {},
  gameSelectedValue: '',
  setGameSelectedValue: () => {},
  formData: {
    name: '',
    phone: '',
    handicap: '',
    agreeToTerms: false,
    store: null,
  },
  setFormData: (() => {}) as React.Dispatch<
    React.SetStateAction<MatchFormData>
  >,
  preferredDate: null,
  setPreferredDate: () => {},
  preferredTime: '',
  setPreferredTime: () => {},
});

export const useMatchRegisterContext = () => useContext(MatchRegisterContext);

interface MatchRegisterProviderProps {
  children: ReactNode;
}

export const MatchRegisterProvider = ({
  children,
}: MatchRegisterProviderProps) => {
  const { data: session } = useSession();
  const userId = session?.user.mb_id ?? '';

  const [step, setStep] = useState(1);
  const [accountSelectedValue, setAccountSelectedValue] =
    useState('ONE_VS_ONE');
  const [gameSelectedValue, setGameSelectedValue] = useState('FOUR_BALL');
  const [formData, setFormData] = useState<MatchFormData>({
    name: '',
    phone: '',
    handicap: '',
    agreeToTerms: false,
    store: null,
  });
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [preferredTime, setPreferredTime] = useState('');

  const contextValue: MatchRegisterContextType = {
    userId,
    step,
    setStep,
    accountSelectedValue,
    setAccountSelectedValue,
    gameSelectedValue,
    setGameSelectedValue,
    formData,
    setFormData,
    preferredDate,
    setPreferredDate,
    preferredTime,
    setPreferredTime,
  };

  return (
    <MatchRegisterContext.Provider value={contextValue}>
      {children}
    </MatchRegisterContext.Provider>
  );
};

export const useMatchRegister = () => {
  const context = useContext(MatchRegisterContext);
  if (!context) {
    throw new Error(
      'useMatchRegister must be used within a MatchRegisterProvider'
    );
  }
  return context;
};
