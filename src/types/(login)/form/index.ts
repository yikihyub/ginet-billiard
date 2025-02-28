interface BilliardStore {
  id: number;
  name: string;
  owner_name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface FormState {
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
    preferGame: string;
    userThreeAbility: number;
    userFourAbility: number;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  matching: {
    locationConsent: boolean;
    preferredAgeGroup: string[];
    preferredGender: string;
    preferredSkillLevel: string[];
    playStyle: string[];
    preferredTime: string[];
  };
  favoriteStores: {
    selectedStores: BilliardStore[];
    searchKeyword: string;
    searchResults: BilliardStore[];
    showResults: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    markers: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapInstance: any;
  };
}

export type FormAction =
  | { type: 'SET_TERMS'; payload: FormState['terms'] }
  | { type: 'SET_USER_INFO'; payload: FormState['userInfo'] }
  | { type: 'SET_STORE_INFO'; payload: FormState['storeInfo'] }
  | { type: 'SET_LOCATION'; payload: FormState['location'] }
  | { type: 'SET_MATCHING'; payload: FormState['matching'] }
  | {
      type: 'SET_FAVORITE_STORES';
      payload: Partial<FormState['favoriteStores']>;
    }
  | { type: 'RESET' };

export type Step =
  | 'terms'
  | 'userInfo'
  | 'storeInfo'
  | 'locationInfo'
  | 'operation'
  | 'facilities'
  | 'complete';
