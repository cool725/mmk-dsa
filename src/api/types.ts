// from '@directus/sdk-js/dist/types/handlers/users';
export interface IUserInfo {
  avatar: string | null;
  description: string | null;
  email: string;
  first_name: string | null;
  id: string;
  language: string;
  last_access: string;
  last_name: string | null;
  last_page: string;
  location: string | null;
  password: string;
  role: string;
  status: string;
  tags: string[];
  tfa_secret: string | null;
  theme: 'auto' | 'dark' | 'light';
  title: string | null;
  token: string | null;
  // custom
  phone: string | null;
  is_employee: boolean;
  managed_by: string | null;
}
export interface ISignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  agreeWithTerms: boolean;
}

// from '@directus/sdk-js/dist/types/handlers/auth';
export interface ILoginByEmailCredentials {
  email: string;
  password: string;
  otp?: string;
}

export interface ILoginByPhoneCredentials {
  phone: string;
  pin: string;
  otp?: string;
}
export interface IAuthResponse {
  access_token: string;
  expires: number;
  refresh_token?: string;
}
