import { Suspense } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import SectionTitle from '@/components/ui/SectionTitle'
import VerseCard from '@/components/faith/VerseCard'
import { getBibleVerses } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Faith & Inspiration - Journey to Engineer',
  description: 'Biblical wisdom and faith that guided the journey',
}

async function VersesList() {
  const verses = await getBibleVerses()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {verses.map((verse, index) => (
        <VerseCard key={verse.id} verse={verse} index={index} />
      ))}
    </div>
  )
}

function VersesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-72 bg-white/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}

export default function FaithPage() {
  return (
    <Section className="py-28 bg-gradient-to-b from-dark-500 via-dark-600 to-dark-500 relative overflow-hidden">
      {/* Abstract light shape - minimal and elegant */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute top-1/4 left-1/4 w-96 h-96" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="url(#gold-gradient)" />
          <defs>
            <radialGradient id="gold-gradient">
              <stop offset="0%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-1/4 right-1/4 w-96 h-96" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="url(#gold-gradient2)" />
          <defs>
            <radialGradient id="gold-gradient2">
              <stop offset="0%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-20">
          {/* Abstract cross/light symbol */}
          <div className="inline-block mb-8">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 bg-gold-500 opacity-20 blur-xl rounded-full"></div>
              <svg className="relative w-16 h-16 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
              </svg>
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Faith & Inspiration
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Biblical wisdom that illuminated the path and strengthened every step of the journey
          </p>
        </div>

        <div className="mb-16 max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-400 leading-relaxed">
            Through every challenge, late night, and milestone, faith remained the foundation. 
            These verses provided guidance, comfort, and strength.
          </p>
        </div>

        <Suspense fallback={<VersesLoading />}>
          <VersesList />
        </Suspense>
      </Container>
    </Section>
  )
}
