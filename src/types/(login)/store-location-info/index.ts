export interface StoreLocationFormProps {
  onNext: () => void;
}

export interface FormData {
  address: string;
  directions: string;
  parkingType: string;
  parkingCapacity: string;
  parkingNote: string;
}

export interface FormErrors {
  address?: string;
  directions?: string;
  parkingType?: string;
  parkingCapacity?: string;
  parkingNote?: string;
}
