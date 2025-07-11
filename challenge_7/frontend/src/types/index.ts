export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  views?: number;
  published_at?: string;
  category_id?: number;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  group?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}