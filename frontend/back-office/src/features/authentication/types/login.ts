import { UserRole } from '@/shared/enums';

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  id: string;
  email: string;
  role: UserRole;
};

export type { LoginFormValues, LoginResponse };
