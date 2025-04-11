export interface OptionCardProps {
  id: string;
  value: string;
  title: string;
  description: string;
  selectedValue: string;
  srcUrl: string;
  onValueChange: (value: string) => void;
  imagePosition?: 'left' | 'right'; // Control image position
}

export interface Store {
  id: number;
  name: string;
  owner_name: string | null;
  address: string;
}

export interface FormData {
  name: string;
  phone: string;
  handicap: string;
  agreeToTerms: boolean;
  store: Store | null;
}

export interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}

export interface BilliardSelectProps {
  onSelect: (store: Store | null) => void;
  value?: Store | null;
}

export interface AdminDistrict {
  administrative: string[];
}

export interface SidoData {
  [key: string]: {
    [key: string]: AdminDistrict;
  };
}
