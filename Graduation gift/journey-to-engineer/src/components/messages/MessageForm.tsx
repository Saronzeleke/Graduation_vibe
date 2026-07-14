'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitMessage } from '@/lib/actions/message-actions'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

// Lightweight confetti component
function Confetti() {
  const confettiPieces = 30
  const colors = ['#FFD700', '#FF69B4', '#9B59B6', '#3498DB', '#2ECC71', '#F39C12']

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(confettiPieces)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${50 + ((i % 10) - 5) * 4}%`,
            top: '50%',
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            y: [0, -200, 400],
            x: [((i % 10) - 5) * 20],
            opacity: [1, 1, 0],
            rotate: [0, i * 36],
            scale: [1, 1.5, 0],
          }}
          transition={{
            duration: 2,
            ease: 'easeOut',
            delay: i * 0.03,
          }}
        />
      ))}
    </div>
  )
}

export default function MessageForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setFieldErrors({})
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await submitMessage(formData)
      
      if (!result.success) {
        // Check if rate limited
        if ('rateLimited' in result && result.rateLimited) {
          setIsRateLimited(true)
          setError(result.error || 'Too many requests. Please try again later.')
          
          // Clear rate limit flag after the retry period
          if (result.retryAfter) {
            setTimeout(() => {
              setIsRateLimited(false)
              setError('')
            }, result.retryAfter * 1000)
          }
          return
        }
        
        // Try to parse if it's JSON error from database function
        let errorMessage = result.error || 'Failed to submit message'
        
        try {
          // Check if error is a JSON string
          if (errorMessage.startsWith('[') || errorMessage.startsWith('{')) {
            const parsed = JSON.parse(errorMessage)
            if (Array.isArray(parsed) && parsed[0]?.message) {
              errorMessage = parsed[0].message
            }
          }
        } catch {
          // If parsing fails, use original error
        }
        
        if (result.field) {
          // Field-specific error
          setFieldErrors({ [result.field]: errorMessage })
        } else {
          // General error
          setError(errorMessage)
        }
        return
      }
      
      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
      setFocusedField(null)
      
      // Hide confetti after 2.5 seconds
      setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      setError('Failed to submit message. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Confetti on success */}
      <AnimatePresence>
        {success && <Confetti />}
      </AnimatePresence>

      <Card className="p-10 border-2 border-celebration-gold/30 shadow-xl shadow-celebration-gold/10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field with Floating Label */}
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              required
              maxLength={100}
              onFocus={() => setFocusedField('name')}
              onBlur={(e) => !e.target.value && setFocusedField(null)}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 transition-all duration-300 outline-none peer placeholder-transparent text-gray-900 dark:text-white bg-white dark:bg-dark-600 ${
                fieldErrors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-dark-500 focus:border-celebration-gold focus:ring-celebration-gold/20'
              }`}
              placeholder="Your Name"
            />
            <label
              htmlFor="name"
              className={`absolute left-5 transition-all duration-300 pointer-events-none ${
                focusedField === 'name'
                  ? `-top-3 text-sm bg-white dark:bg-dark-600 px-2 font-semibold ${fieldErrors.name ? 'text-red-600' : 'text-celebration-gold'}`
                  : 'top-4 text-gray-500'
              } peer-focus:-top-3 peer-focus:text-sm peer-focus:bg-white dark:peer-focus:bg-dark-600 peer-focus:px-2 peer-focus:text-celebration-gold peer-focus:font-semibold`}
            >
              Your Name *
            </label>
            {fieldErrors.name && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.name}
              </motion.p>
            )}
          </div>

          {/* Relationship Field - Dropdown */}
          <div className="relative">
            <select
              id="relationship"
              name="relationship"
              required
              onFocus={() => setFocusedField('relationship')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 transition-all duration-300 outline-none text-gray-900 dark:text-white bg-white dark:bg-dark-600 ${
                fieldErrors.relationship
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-dark-500 focus:border-celebration-gold focus:ring-celebration-gold/20'
              }`}
            >
              <option value="">Select your relationship</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Professor">Professor</option>
              <option value="Mentor">Mentor</option>
              <option value="Colleague">Colleague</option>
              <option value="Family Member">Family Member</option>
              <option value="Other">Other</option>
            </select>
            <label
              htmlFor="relationship"
              className="-top-3 left-5 text-sm bg-white dark:bg-dark-600 px-2 text-celebration-gold font-semibold absolute pointer-events-none"
            >
              Your Relationship *
            </label>
            {fieldErrors.relationship && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.relationship}
              </motion.p>
            )}
          </div>

          {/* Message Field */}
          <div className="relative">
            <textarea
              id="message"
              name="message"
              required
              maxLength={1000}
              rows={6}
              onFocus={() => setFocusedField('message')}
              onBlur={(e) => !e.target.value && setFocusedField(null)}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 transition-all duration-300 outline-none resize-none peer placeholder-transparent text-gray-900 dark:text-white bg-white dark:bg-dark-600 ${
                fieldErrors.message
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-dark-500 focus:border-celebration-gold focus:ring-celebration-gold/20'
              }`}
              placeholder="Your Message"
            />
            <label
              htmlFor="message"
              className={`absolute left-5 transition-all duration-300 pointer-events-none ${
                focusedField === 'message'
                  ? `-top-3 text-sm bg-white dark:bg-dark-600 px-2 font-semibold ${fieldErrors.message ? 'text-red-600' : 'text-celebration-gold'}`
                  : 'top-4 text-gray-500'
              } peer-focus:-top-3 peer-focus:text-sm peer-focus:bg-white dark:peer-focus:bg-dark-600 peer-focus:px-2 peer-focus:text-celebration-gold peer-focus:font-semibold`}
            >
              Your Message *
            </label>
            {fieldErrors.message && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {fieldErrors.message}
              </motion.p>
            )}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 border-2 rounded-xl text-sm flex items-center gap-3 ${
                  isRateLimited
                    ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  {isRateLimited ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
                <div>
                  <p className="font-semibold">{isRateLimited ? '⏰ Slow down!' : '❌ Error'}</p>
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 bg-gradient-to-r from-celebration-gold/20 to-celebration-gold/30 border-2 border-celebration-gold rounded-xl text-gray-800 dark:text-white font-semibold flex items-center gap-4 shadow-lg shadow-celebration-gold/20"
              >
                <div className="w-12 h-12 bg-celebration-gold rounded-full flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg">🎊 Message Sent Successfully! 🎉</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-normal">It will appear after admin approval ✨</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" disabled={loading || isRateLimited} className="w-full text-lg py-5">
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Sending...
              </span>
            ) : isRateLimited ? (
              'Please Wait...'
            ) : (
              'Send Your Message'
            )}
          </Button>
        </form>
      </Card>
    </>
  )
}
