export interface User {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
}

export type SafeUser = Omit<User, 'passwordHash'>;
