'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Message } from '@/types'

interface MessageCardProps {
  message: Message
  index?: number
}

export default function MessageCard({ message, index = 0 }: MessageCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        whileHover={{ translateY: -4, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="h-full glass-effect rounded-xl p-8 hover:shadow-xl hover:shadow-celebration-gold/20 transition-all duration-300 border border-celebration-gold/30"
      >
        <div className="mb-4">
          <h3 className="font-bold text-xl mb-2 text-dark-500 dark:text-white">{message.name}</h3>
          <div className="inline-block px-3 py-1 bg-celebration-gold/20 text-celebration-gold text-sm font-semibold rounded-full border border-celebration-gold/50">
            {message.relationship}
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic text-lg mb-6">
          "{message.message}"
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time>
            {new Date(message.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </motion.div>
    </motion.div>
  )
}
