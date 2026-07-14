import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-dark-600 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        hover ? 'hover:shadow-2xl hover:-translate-y-1 hover:shadow-gold-500/10' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
