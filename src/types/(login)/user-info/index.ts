export interface TermsFormProps {
  onNext: () => void;
}

export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  verificationCode: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
  verificationCode?: string;
}

export type EmailCheckStatus =
  | "idle"
  | "checking"
  | "available"
  | "unavailable";
export type PhoneVerificationStatus =
  | "idle"
  | "sending"
  | "sent"
  | "verifying"
  | "verified";
