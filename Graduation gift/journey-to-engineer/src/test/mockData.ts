import type { Graduate, Message, TimelineEvent, BibleVerse } from '@/types'

export const mockGraduate: Graduate = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Graduate',
  bio: 'A passionate Software Engineering student',
  university: 'Test University',
  degree: 'Bachelor of Science in Software Engineering',
  graduation_date: '2026-06-15',
  photo_url: '/images/test.jpg',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockMessages: Message[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    graduate_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    relationship: 'Friend',
    message: 'Congratulations on your graduation!',
    approved: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    graduate_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Jane Smith',
    relationship: 'Family Member',
    message: 'So proud of you!',
    approved: true,
    created_at: '2024-01-02T00:00:00Z',
  },
]

export const mockPendingMessages: Message[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    graduate_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Bob Johnson',
    relationship: 'Professor',
    message: 'Well done!',
    approved: false,
    created_at: '2024-01-03T00:00:00Z',
  },
]

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    graduate_id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'First Day of University',
    description: 'Started the journey',
    event_date: '2022-09-01',
    image_url: null,
    order_index: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    graduate_id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Graduation Day',
    description: 'Walked across the stage',
    event_date: '2026-06-15',
    image_url: null,
    order_index: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

export const mockBibleVerses: BibleVerse[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    verse: 'I can do all things through Christ who strengthens me.',
    reference: 'Philippians 4:13',
    order_index: 1,
    created_at: '2024-01-01T00:00:00Z',
  },
]
