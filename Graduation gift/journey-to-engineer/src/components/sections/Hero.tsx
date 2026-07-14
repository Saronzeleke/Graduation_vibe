'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import type { Graduate } from '@/types'

interface HeroProps {
  graduate: Graduate | null
}

// Floating graduation caps (celebratory!)
function FloatingGraduationCaps() {
  const caps = 8
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(caps)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-gold-500 dark:text-gold-400"
          style={{
            left: `${(i * 13) % 100}%`,
            top: `${(i * 17) % 100}%`,
            fontSize: `${20 + (i * 5) % 20}px`,
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.25,
          }}
        >
          🎓
        </motion.div>
      ))}
    </div>
  )
}

// Celebratory sparkles
function CelebratorySparkles() {
  const sparkles = 20
  const colors = ['#FFD700', '#FF6B9D', '#A78BFA', '#60A5FA']
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(sparkles)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2"
          style={{
            left: `${(i * 7) % 100}%`,
            top: `${(i * 11) % 100}%`,
            background: `radial-gradient(circle, ${colors[i % colors.length]}, transparent)`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + (i % 2),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

export default function Hero({ graduate }: HeroProps) {
  const scrollToTimeline = () => {
    const element = document.getElementById('timeline')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!graduate) {
    return (
      <Section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gold-50 to-celebration-pink/10">
        <Container>
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gold-50/50 to-celebration-pink/10 dark:from-dark-500 dark:via-dark-600 dark:to-dark-500 overflow-hidden">
      {/* Floating graduation caps */}
      <FloatingGraduationCaps />
      
      {/* Celebratory sparkles */}
      <CelebratorySparkles />
      
      {/* Celebration burst on page load */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-radial from-gold-400/20 via-transparent to-transparent" />
      </motion.div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Celebratory Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-6 py-3 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-dark-500 rounded-full text-sm font-bold tracking-wide shadow-2xl celebration-glow"
                >
                  🎓 Class of 2026 ✨
                </motion.div>
                <div className="absolute inset-0 bg-gold-400 blur-2xl opacity-50 rounded-full"></div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-dark-500 dark:text-white">
              The Journey to{' '}
              <motion.span
                animate={{ textShadow: ['0 0 20px #FFD700', '0 0 40px #FFD700', '0 0 20px #FFD700'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="block text-gold-500 dark:text-gold-400 mt-2 relative">
              Software Engineer
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-500 via-celebration-pink to-gold-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </motion.span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-8 font-light">
              Celebrating{' '}
              <span className="font-bold text-gold-600 dark:text-gold-400">{graduate.name}</span>
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 mb-10"
            >
              <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span className="font-semibold">Degree:</span> {graduate.degree}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center gap-3">
                <span className="text-2xl">🏛️</span>
                <span className="font-semibold">University:</span> {graduate.university}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <span className="font-semibold">Graduation:</span>{' '}
                {new Date(graduate.graduation_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </motion.div>
            
            {graduate.bio && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10 text-lg"
              >
                {graduate.bio}
              </motion.p>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button onClick={scrollToTimeline} size="lg" variant="primary">
                🎉 Explore the Journey
              </Button>
            </motion.div>
          </motion.div>

          {/* Image with celebration frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: [0, 1, -1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-gold-500 dark:border-gold-600 celebration-glow"
            >
              {graduate.photo_url ? (
                <Image
                  src={graduate.photo_url}
                  alt={graduate.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold-100 via-surface-light to-celebration-pink/20 dark:from-dark-600 dark:via-dark-500 dark:to-dark-600 flex items-center justify-center">
                  <span className="text-8xl font-bold text-gold-500 dark:text-gold-400">
                    {graduate.name.charAt(0)}
                  </span>
                </div>
              )}
              
              {/* Celebration overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gold-500/20 via-transparent to-celebration-pink/10 pointer-events-none"></div>
            </motion.div>
            
            {/* Decorative celebration elements */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-8 -right-8 w-40 h-40 bg-gold-500 dark:bg-gold-600 rounded-full opacity-20 blur-3xl"
            ></motion.div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-8 -left-8 w-48 h-48 bg-celebration-pink rounded-full opacity-20 blur-3xl"
            ></motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
