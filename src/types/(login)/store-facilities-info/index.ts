export interface StoreFacilitiesFormProps {
  onComplete: () => void;
  // onPrev: () => void;
}

export interface PriceInfo {
  weekdayPrice: string;
  weekendPrice: string;
}

export interface FormData {
  priceInfo: PriceInfo;
  priceNote: string;
  priceImage: File | null;
  storeImages: File[];
}

export interface FormErrors {
  priceInfo?: string;
  priceImage?: string;
  storeImages?: string;
}
