export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  profileImage: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SafeUser extends Omit<User, "password"> {}
