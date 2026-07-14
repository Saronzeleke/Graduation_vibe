'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import SectionTitle from '@/components/ui/SectionTitle'
import { TimelineEventSkeleton } from '@/components/ui/LoadingSkeleton'
import { getTimelineEvents } from '@/lib/supabase/queries'
import type { TimelineEvent } from '@/types'

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`flex gap-8 items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.02, translateY: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-dark-600 rounded-xl p-8 shadow-lg hover:shadow-2xl hover:shadow-celebration-gold/20 transition-all duration-300 border border-gray-100 dark:border-dark-500 hover:border-celebration-gold dark:hover:border-celebration-gold group"
        >
          <time className="text-sm font-semibold text-celebration-gold dark:text-celebration-gold mb-3 block tracking-wide uppercase">
            ✨
            {new Date(event.event_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </time>
          <h3 className="text-2xl font-bold mb-4 text-dark-500 dark:text-white group-hover:text-celebration-gold dark:group-hover:text-celebration-gold transition-colors">
            🎓 {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{event.description}</p>
          {event.image_url && (
            <div className="mt-6 relative h-56 rounded-lg overflow-hidden">
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Timeline dot with pulse */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <div className="w-5 h-5 rounded-full bg-celebration-gold border-4 border-white shadow-lg shadow-celebration-gold/50 z-10 relative" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-celebration-gold"
          />
        </motion.div>
      </div>

      <div className="flex-1" />
    </motion.div>
  )
}

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      const data = await getTimelineEvents()
      setEvents(data)
      setLoading(false)
    }
    loadEvents()
  }, [])

  return (
    <Section id="timeline" className="py-24 bg-gradient-to-b from-white via-surface-light to-white dark:from-dark-500 dark:via-dark-600 dark:to-dark-500">
      <Container>
        <SectionTitle
          title="The Journey Timeline"
          subtitle="Every milestone, every challenge, every victory that shaped the path to becoming an engineer"
        />

        {loading ? (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full">
              <div className="w-full h-full bg-gradient-to-b from-celebration-gold/30 via-celebration-gold to-celebration-gold/30"></div>
            </div>
            
            <div className="space-y-16">
              {[...Array(4)].map((_, index) => (
                <TimelineEventSkeleton key={index} isEven={index % 2 === 0} />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line with gradient */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full">
              <div className="w-full h-full bg-gradient-to-b from-celebration-gold/30 via-celebration-gold to-celebration-gold/30"></div>
            </div>
            
            <div className="space-y-16">
              {events.map((event, index) => (
                <TimelineItem key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  )
}
