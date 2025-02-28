export interface Agreements {
  all: boolean;
  age: boolean;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

export interface UserInfo {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  phone: string;
}

export interface FormData {
  agreements: Agreements;
  userInfo: UserInfo;
}
