export interface Post {
  id: number;
  content: string;
  media: string[];
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
