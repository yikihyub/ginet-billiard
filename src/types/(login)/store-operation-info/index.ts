export interface StoreOperationFormProps {
  onNext: () => void;
}

export interface OperatingHours {
  open: string;
  close: string;
}

export interface FormData {
  weekdayHours: OperatingHours;
  saturdayHours: OperatingHours;
  sundayHours: OperatingHours;
  regularHolidays: string[];
  brand: string;
  totalTables: string;
  facilities: string[];
}

export interface FormErrors {
  weekdayHours?: string;
  saturdayHours?: string;
  sundayHours?: string;
  regularHolidays?: string;
  brand?: string;
  totalTables?: string;
}
