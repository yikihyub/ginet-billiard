'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormState, FormAction } from '@/types/(login)/form';

const initialState: FormState = {
  terms: {
    age: false,
    terms: false,
    privacy: false,
    privacyOption: false,
    marketing: false,
  },
  userInfo: {
    email: '',
    password: '',
    ownerName: '',
    phoneNumber: '',
  },
  storeInfo: {
    preferGame: '',
    userThreeAbility: 0,
    userFourAbility: 0,
  },
  location: {
    address: '',
    latitude: 0,
    longitude: 0,
  },
  matching: {
    locationConsent: false,
    preferredAgeGroup: [],
    preferredGender: 'any',
    preferredSkillLevel: [],
    playStyle: [],
    preferredTime: [],
  },
  favoriteStores: {
    selectedStores: [],
    searchKeyword: '',
    searchResults: [],
    showResults: false,
    markers: [],
    mapInstance: null,
  },
};

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | null>(null);

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_TERMS':
      return { ...state, terms: action.payload };
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload };
    case 'SET_STORE_INFO':
      return { ...state, storeInfo: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_MATCHING':
      return { ...state, matching: action.payload };
    case 'SET_FAVORITE_STORES':
      return {
        ...state,
        favoriteStores: {
          ...state.favoriteStores, // 기존 값들 유지
          ...action.payload, // 새로운 값으로 업데이트
        },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
