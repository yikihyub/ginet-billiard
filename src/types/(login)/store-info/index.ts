export interface StoreInfoFormProps {
  onNext: () => void;
}

export interface FormData {
  businessNumber: string;
  storeName: string;
  ownerName: string;
  storeNumber: string;
}

export interface FormErrors {
  businessNumber?: string;
  storeName?: string;
  ownerName?: string;
  storeNumber?: string;
}
