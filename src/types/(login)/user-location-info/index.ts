export interface UserLocationFormProps {
  onNext: () => void;
}

export interface FormData {
  latitude: number;
  longitude: number;
  address: string;
}

export interface FormErrors {
  latitude?: number;
  longitude?: number;
  address?: string;
  location?: string;
}

export interface LocationFormData {
  latitude: string;
  longitude: string;
  address: string;
}

export interface LocationErrors {
  location?: string;
}

export interface UseUserLocationProps {
  onNext: (data: LocationFormData) => void;
}
