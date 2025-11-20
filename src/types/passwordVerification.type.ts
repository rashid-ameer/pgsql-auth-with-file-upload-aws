export interface PasswordVerification {
  id: number;
  token: string;
  user_id: number;
  expires_at: Date;
  created_at: Date;
}
