'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import SectionTitle from '@/components/ui/SectionTitle'
import { getGalleryImages } from '@/lib/supabase/queries'
import type { GalleryImage } from '@/types'

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    async function loadImages() {
      const data = await getGalleryImages()
      setImages(data)
      setLoading(false)
    }
    loadImages()
  }, [])

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <Section className="py-24 bg-white dark:bg-dark-500 relative overflow-hidden">
      {/* Floating celebration stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          >
            {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '✨' : '🌟'}
          </motion.div>
        ))}
      </div>
      
      <Container>
        <SectionTitle
          title="Graduation Gallery"
          subtitle="Capturing the moments of celebration, achievement, and the beginning of a new chapter"
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-celebration-gold/10 rounded-2xl border-2 border-celebration-gold/30">
              <svg className="w-16 h-16 text-celebration-gold mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-lg">Gallery photos will appear here</p>
              <p className="text-gray-400 text-sm mt-2">Add images to Supabase to populate the gallery</p>
            </div>
          </div>
        ) : (
          <>
            {/* Masonry Grid using CSS columns */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {images.map((image, index) => (
                <GalleryItem
                  key={image.id}
                  image={image}
                  index={index}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>

            {/* Cinematic Modal */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-50 bg-dark-500/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
                  onClick={() => setSelectedImage(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="relative max-w-6xl max-h-[90vh] w-full h-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={selectedImage.image_url}
                        alt={selectedImage.caption || 'Gallery image'}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {selectedImage.caption && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-500 to-transparent p-8 text-center"
                      >
                        <p className="text-white text-lg">{selectedImage.caption}</p>
                      </motion.div>
                    )}
                    
                    {/* Close button */}
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors duration-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </Container>
    </Section>
  )
}

function GalleryItem({ image, index, onClick }: { image: GalleryImage; index: number; onClick: () => void }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="break-inside-avoid mb-6"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl hover:shadow-celebration-gold/30 transition-shadow duration-300"
        onClick={onClick}
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={image.image_url}
            alt={image.caption || 'Gallery image'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Celebration overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-500/80 via-dark-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            {image.caption && (
              <p className="text-white text-sm font-medium">🎉 {image.caption}</p>
            )}
          </div>
          {/* Bright gold border appears on hover */}
          <div className="absolute inset-0 border-3 border-celebration-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl shadow-lg shadow-celebration-gold/50"></div>
        </div>
      </motion.div>
    </motion.div>
  )
}
