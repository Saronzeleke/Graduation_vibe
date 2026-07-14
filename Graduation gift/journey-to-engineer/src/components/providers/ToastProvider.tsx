'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
        },
        // Success toast
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#FFD700',
            secondary: '#fff',
          },
          style: {
            background: '#10B981',
            color: '#fff',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        },
        // Loading toast
        loading: {
          iconTheme: {
            primary: '#FFD700',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}
