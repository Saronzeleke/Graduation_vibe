import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click Me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick} disabled>Click Me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    
    const button = screen.getByRole('button')
    // Check for gradient which is part of primary variant
    expect(button).toHaveClass('bg-gradient-to-r')
  })

  it('should apply outline variant styles', () => {
    render(<Button variant="outline">Outline</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-2')
  })

  it('should apply small size styles', () => {
    render(<Button size="sm">Small</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-sm')
  })

  it('should apply large size styles', () => {
    render(<Button size="lg">Large</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-lg')
  })

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should render as a different element with asChild', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })
})
