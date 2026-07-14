import { z } from 'zod'

/**
 * Message submission schema
 * Used for public message form validation
 */
export const messageSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  relationship: z
    .string()
    .min(2, 'Relationship must be at least 2 characters')
    .max(100, 'Relationship must be less than 100 characters')
    .trim(),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
})

export type MessageFormData = z.infer<typeof messageSchema>

/**
 * Timeline event schema
 * Used for admin timeline management
 */
export const timelineEventSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional()
    .nullable(),
  
  event_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  
  image_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  
  order_index: z
    .number()
    .int('Must be an integer')
    .min(0, 'Order must be 0 or greater')
    .default(0),
})

export type TimelineEventFormData = z.infer<typeof timelineEventSchema>

/**
 * Gallery image schema
 * Used for admin gallery management
 */
export const galleryImageSchema = z.object({
  image_url: z
    .string()
    .url('Must be a valid URL')
    .startsWith('/images/', 'Image must be from /images/ directory or full URL'),
  
  caption: z
    .string()
    .max(200, 'Caption must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),
  
  order_index: z
    .number()
    .int('Must be an integer')
    .min(0, 'Order must be 0 or greater')
    .default(0),
})

export type GalleryImageFormData = z.infer<typeof galleryImageSchema>

/**
 * Bible verse schema
 * Used for admin verse management
 */
export const bibleVerseSchema = z.object({
  verse: z
    .string()
    .min(10, 'Verse must be at least 10 characters')
    .max(500, 'Verse must be less than 500 characters')
    .trim(),
  
  reference: z
    .string()
    .min(3, 'Reference must be at least 3 characters')
    .max(100, 'Reference must be less than 100 characters')
    .trim()
    .regex(/^[A-Za-z0-9\s:-]+$/, 'Invalid reference format (e.g., John 3:16)'),
  
  order_index: z
    .number()
    .int('Must be an integer')
    .min(0, 'Order must be 0 or greater')
    .default(0),
})

export type BibleVerseFormData = z.infer<typeof bibleVerseSchema>

/**
 * Admin login schema
 * Used for login form validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Must be a valid email address')
    .trim()
    .toLowerCase(),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
