import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`container mx-auto px-6 max-w-7xl ${className}`}>
      {children}
    </div>
  )
}
