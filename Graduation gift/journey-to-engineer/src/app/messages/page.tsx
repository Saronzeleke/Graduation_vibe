import { Suspense } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import SectionTitle from '@/components/ui/SectionTitle'
import MessageCard from '@/components/messages/MessageCard'
import MessageForm from '@/components/messages/MessageForm'
import { MessageCardSkeleton } from '@/components/ui/LoadingSkeleton'
import { getApprovedMessages } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Messages - Journey to Engineer',
  description: 'Messages from family and friends celebrating the journey',
}

async function MessagesList() {
  const messages = await getApprovedMessages()
  
  if (messages.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-12 glass-effect rounded-2xl border-2 border-gold-100">
          <svg className="w-20 h-20 text-gold-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-600 text-xl font-semibold mb-2">No messages yet</p>
          <p className="text-gray-400">Be the first to leave a congratulatory message!</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {messages.map((message, index) => (
        <MessageCard key={message.id} message={message} index={index} />
      ))}
    </div>
  )
}

function MessagesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <MessageCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function MessagesPage() {
  return (
    <>
      <Section className="py-24 bg-gradient-to-b from-surface-light to-white dark:from-dark-600 dark:to-dark-500">
        <Container>
          <SectionTitle
            title="Messages of Love & Celebration"
            subtitle="Words from family, friends, and loved ones honoring this incredible achievement"
          />
          
          <Suspense fallback={<MessagesLoading />}>
            <MessagesList />
          </Suspense>
        </Container>
      </Section>

      <Section className="py-24 bg-white dark:bg-dark-500">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4 text-dark-500 dark:text-white">
                Leave Your Message
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Share your congratulations and words of encouragement
              </p>
            </div>
            <MessageForm />
          </div>
        </Container>
      </Section>
    </>
  )
}
