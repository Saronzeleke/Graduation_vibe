'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { BibleVerse } from '@/types'

interface VerseCardProps {
  verse: BibleVerse
  index?: number
}

export default function VerseCard({ verse, index = 0 }: VerseCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        whileHover={{ scale: 1.02, translateY: -4 }}
        transition={{ duration: 0.3 }}
        className="h-full glass-effect rounded-2xl p-10 hover:shadow-2xl hover:shadow-celebration-gold/30 transition-all duration-300 border border-celebration-gold/30 flex flex-col justify-between min-h-[280px]"
      >
        {/* Decorative quote icon */}
        <div className="mb-6">
          <svg className="w-12 h-12 text-celebration-gold opacity-40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Verse text */}
        <div className="flex-grow">
          <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-200 font-serif italic mb-8">
            "{verse.verse}"
          </p>
        </div>

        {/* Reference */}
        <div className="flex items-center justify-end gap-2">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-celebration-gold"></div>
          <p className="text-celebration-gold font-bold text-lg">
            ✝ {verse.reference}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
