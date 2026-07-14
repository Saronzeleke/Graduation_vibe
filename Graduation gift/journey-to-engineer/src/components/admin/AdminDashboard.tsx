'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { getPendingMessagesAction, approveMessageAction, deleteMessageAction } from '@/lib/actions/admin-actions'
import { signOut } from '@/lib/actions/auth-actions'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { AdminMessageSkeleton } from '@/components/ui/LoadingSkeleton'
import type { Message } from '@/types'

export default function AdminDashboard() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    try {
      setLoading(true)
      const result = await getPendingMessagesAction()
      
      if (!result.success) {
        console.error('Failed to load messages:', result.error)
        toast.error(result.error || 'Failed to load messages')
        setMessages([])
        return
      }
      
      setMessages(result.data || [])
    } catch (error) {
      console.error('Failed to load messages:', error)
      toast.error('Failed to load messages')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id: string) {
    const approveToast = toast.loading('Approving message...')
    
    try {
      const result = await approveMessageAction(id)
      
      if (!result.success) {
        toast.error(result.error || 'Failed to approve message', { id: approveToast })
        return
      }
      
      toast.success('Message approved! ✨', { id: approveToast })
      setMessages(messages.filter(m => m.id !== id))
    } catch (error) {
      console.error('Failed to approve message:', error)
      toast.error('Failed to approve message', { id: approveToast })
    }
  }

  async function handleDelete(id: string) {
    // Custom confirmation toast
    const confirmed = window.confirm('Are you sure you want to delete this message? This cannot be undone.')
    if (!confirmed) return
    
    const deleteToast = toast.loading('Deleting message...')
    
    try {
      const result = await deleteMessageAction(id)
      
      if (!result.success) {
        toast.error(result.error || 'Failed to delete message', { id: deleteToast })
        return
      }
      
      toast.success('Message deleted', { id: deleteToast })
      setMessages(messages.filter(m => m.id !== id))
    } catch (error) {
      console.error('Failed to delete message:', error)
      toast.error('Failed to delete message', { id: deleteToast })
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-dark-500 dark:text-white">Pending Messages</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'} awaiting approval
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadMessages} variant="outline" disabled={loading}>
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </Button>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <AdminMessageSkeleton key={i} />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <Card className="p-12 text-center border-2 border-gold-100">
          <div className="inline-block p-6 bg-gold-50 rounded-full mb-6">
            <svg className="w-16 h-16 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">All Caught Up!</h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No pending messages at the moment</p>
        </Card>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-8 border-2 border-gold-100 hover:border-gold-300 transition-colors duration-300">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-grow">
                      <div className="mb-4">
                        <h3 className="font-bold text-2xl text-dark-500 dark:text-white">{message.name}</h3>
                        <div className="inline-block px-3 py-1 bg-gold-100 text-gold-700 text-sm font-semibold rounded-full mt-2">
                          {message.relationship}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 mb-4 text-lg leading-relaxed">{message.message}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <time>
                          {new Date(message.created_at).toLocaleString()}
                        </time>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 flex-shrink-0">
                      <Button
                        onClick={() => handleApprove(message.id)}
                        size="sm"
                        variant="primary"
                        className="whitespace-nowrap"
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        onClick={() => handleDelete(message.id)}
                        size="sm"
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        ✕ Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
