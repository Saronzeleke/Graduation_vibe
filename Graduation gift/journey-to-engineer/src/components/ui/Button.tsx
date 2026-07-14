import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group'
  
  const variants = {
    primary: 'bg-gradient-to-r from-celebration-gold to-celebration-gold/90 hover:from-celebration-gold/90 hover:to-celebration-gold text-dark-500 font-bold focus:ring-celebration-gold shadow-lg hover:shadow-xl hover:shadow-celebration-gold/40',
    secondary: 'bg-dark-500 hover:bg-dark-600 text-white focus:ring-dark-500 shadow-lg',
    outline: 'border-2 border-celebration-gold text-celebration-gold hover:bg-celebration-gold/10 focus:ring-celebration-gold',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Shimmer effect on hover */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
