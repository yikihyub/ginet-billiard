'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface FormState {
  terms: {
    age: boolean;
    terms: boolean;
    privacy: boolean;
    privacyOption: boolean;
    marketing: boolean;
  };
  userInfo: {
    email: string;
    password: string;
    ownerName: string;
    phoneNumber: string;
  };
  storeInfo: {
    businessNumber: string;
    storeName: string;
    ownerName: string;
    storeNumber: string;
  };
  location: {
    address: string;
    directions?: string;
    parkingType: string;
    parkingCapacity?: string;
    parkingNote?: string;
  };
  operation: {
    weekdayHours: { open: string; close: string };
    saturdayHours?: { open: string; close: string };
    sundayHours?: { open: string; close: string };
    regularHolidays: string[];
    brand: string;
    totalTables: string;
    facilities: string[];
  };
  facilities: {
    priceInfo: {
      weekdayPrice: string;
      weekendPrice?: string;
    };
    priceNote?: string;
  };
}

type FormAction =
  | { type: 'SET_TERMS'; payload: FormState['terms'] }
  | { type: 'SET_USER_INFO'; payload: FormState['userInfo'] }
  | { type: 'SET_STORE_INFO'; payload: FormState['storeInfo'] }
  | { type: 'SET_LOCATION'; payload: FormState['location'] }
  | { type: 'SET_OPERATION'; payload: FormState['operation'] }
  | { type: 'SET_FACILITIES'; payload: FormState['facilities'] }
  | { type: 'RESET' };

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
    businessNumber: '',
    storeName: '',
    ownerName: '',
    storeNumber: '',
  },
  location: {
    address: '',
    parkingType: '',
  },
  operation: {
    weekdayHours: { open: '', close: '' },
    regularHolidays: [],
    brand: '',
    totalTables: '',
    facilities: [],
  },
  facilities: {
    priceInfo: {
      weekdayPrice: '',
    },
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
    case 'SET_OPERATION':
      return { ...state, operation: action.payload };
    case 'SET_FACILITIES':
      return { ...state, facilities: action.payload };
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
