import { UserRole } from '@/shared/enums';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type { UserData };
