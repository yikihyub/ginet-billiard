export interface userPreferenceProps {
  onNext: () => void;
}

export interface FormData {
  preferGame: string;
  userThreeAbility: number;
  userFourAbility: number;
}

export interface FormErrors {
  preferGame?: string;
  userThreeAbility?: number;
  userFourAbility?: number;
}
