// Core type definitions for the application

export interface Graduate {
  id: string;
  name: string;
  bio: string | null;
  university: string;
  degree: string;
  graduation_date: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  graduate_id: string;
  title: string;
  description: string | null;
  event_date: string;
  image_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  graduate_id: string;
  image_url: string;
  caption: string | null;
  order_index: number;
  created_at: string;
}

export interface Message {
  id: string;
  graduate_id: string;
  name: string;
  relationship: string | null;
  message: string;
  approved: boolean;
  created_at: string;
}

export interface BibleVerse {
  id: string;
  verse: string;
  reference: string;
  order_index: number;
  created_at: string;
}

export interface MessageSubmission {
  name: string;
  relationship: string;
  message: string;
}

// Authorization types
export type UserRole = 'ADMIN' | 'USER'

export interface UserRole_DB {
  id: string
  user_id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface UserWithRole {
  id: string
  email: string
  role: UserRole
}
