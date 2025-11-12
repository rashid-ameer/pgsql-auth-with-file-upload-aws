export interface User {
  id: string;
  username: string;
  email: string;
  is_verified: boolean;
  profileImage: string | null;
  created_at: string;
  updated_at: string;
}
