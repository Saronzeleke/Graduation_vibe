import { describe, it, expect } from 'vitest'
import { messageSchema, loginSchema } from './schemas'

describe('Message Validation Schema', () => {
  it('should validate correct message data', () => {
    const validData = {
      name: 'John Doe',
      relationship: 'Friend',
      message: 'Congratulations on your graduation!',
    }

    const result = messageSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject name that is too short', () => {
    const invalidData = {
      name: 'J',
      relationship: 'Friend',
      message: 'Congratulations!',
    }

    const result = messageSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 2 characters')
    }
  })

  it('should reject name that is too long', () => {
    const invalidData = {
      name: 'A'.repeat(101),
      relationship: 'Friend',
      message: 'Congratulations!',
    }

    const result = messageSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('less than 100 characters')
    }
  })

  it('should reject message that is too short', () => {
    const invalidData = {
      name: 'John Doe',
      relationship: 'Friend',
      message: 'Hi',
    }

    const result = messageSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 10 characters')
    }
  })

  it('should reject empty relationship', () => {
    const invalidData = {
      name: 'John Doe',
      relationship: '',
      message: 'Congratulations on your graduation!',
    }

    const result = messageSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should trim whitespace from fields', () => {
    const dataWithWhitespace = {
      name: '  John Doe  ',
      relationship: '  Friend  ',
      message: '  Congratulations!  ',
    }

    const result = messageSchema.safeParse(dataWithWhitespace)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('John Doe')
      expect(result.data.relationship).toBe('Friend')
      expect(result.data.message).toBe('Congratulations!')
    }
  })
})

describe('Login Validation Schema', () => {
  it('should validate correct login data', () => {
    const validData = {
      email: 'admin@example.com',
      password: 'password123',
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'password123',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('valid email')
    }
  })

  it('should reject short password', () => {
    const invalidData = {
      email: 'admin@example.com',
      password: '123',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 8 characters')
    }
  })

  it('should reject empty email', () => {
    const invalidData = {
      email: '',
      password: 'password123',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
